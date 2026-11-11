import Link from "next/link"
import { FileText } from "lucide-react"

import { ApplicationsStats } from "@/app/component/SeekerApplications/ApplicationsStats"
import { ApplicationsTable } from "@/app/component/SeekerApplications/ApplicationsTable"
import { ExportPdfButton } from "@/app/component/SeekerApplications/ExportPdfButton"
import { buttonVariants } from "@/components/ui/button"
import { getApplications } from "@/lib/actions/applications"
import { getJobs } from "@/lib/api/jobs"
import { getApplicationStats, withResolvedJobIds } from "@/lib/application"
import { auth } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { headers } from "next/headers"

type ApplicationsTab = "active" | "archived"

type ApplicationsPageProps = {
  searchParams: Promise<{ tab?: string }>
}

const TABS: { id: ApplicationsTab; label: string }[] = [
  { id: "active", label: "Active" },
  { id: "archived", label: "Archived" },
]

export default async function SeekerApplicationsPage({
  searchParams,
}: ApplicationsPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const applications = session?.user?.id
    ? await getApplications(session.user.id)
    : []

  // Fill missing jobId from real jobs so Details links work.
  const needsJobIds = applications.some((application) => !application.jobId)
  const resolvedApplications = needsJobIds
    ? withResolvedJobIds(applications, await getJobs())
    : applications

  const { tab } = await searchParams
  const activeTab: ApplicationsTab = tab === "archived" ? "archived" : "active"

  const stats = getApplicationStats(resolvedApplications)
  const visibleApplications = resolvedApplications.filter((application) =>
    activeTab === "archived" ? application.archived : !application.archived
  )

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-2xl leading-7 font-semibold tracking-tight">
            My Applications
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Track your job applications and interview progress in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 print:hidden">
          <div
            role="tablist"
            aria-label="Filter applications"
            className="inline-flex rounded-lg border bg-muted/50 p-1"
          >
            {TABS.map((item) => (
              <Link
                key={item.id}
                href={
                  item.id === "archived"
                    ? "/dashboard/seeker/applications?tab=archived"
                    : "/dashboard/seeker/applications"
                }
                role="tab"
                aria-selected={activeTab === item.id}
                className={cn(
                  "inline-flex h-8 items-center justify-center rounded-md px-4 text-[13px] font-medium transition-colors",
                  activeTab === item.id
                    ? "border bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <ExportPdfButton />
        </div>
      </header>

      <ApplicationsStats {...stats} />

      {visibleApplications.length > 0 ? (
        <ApplicationsTable key={activeTab} applications={visibleApplications} />
      ) : (
        <EmptyApplicationsState tab={activeTab} />
      )}
    </div>
  )
}

function EmptyApplicationsState({ tab }: { tab: ApplicationsTab }) {
  return (
    <section className="flex flex-col items-center justify-center rounded-xl border bg-card px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <FileText className="size-5" />
      </span>
      <h2 className="mt-4 text-base font-semibold">
        {tab === "active" ? "No applications yet" : "No archived applications"}
      </h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {tab === "active"
          ? "When you apply for a job, it will show up here so you can track its progress."
          : "Applications you archive will be kept here for later reference."}
      </p>
      {tab === "active" && (
        <Link
          href="/browse-jobs"
          className={buttonVariants({ className: "mt-5 h-9 px-4" })}
        >
          Browse jobs
        </Link>
      )}
    </section>
  )
}
