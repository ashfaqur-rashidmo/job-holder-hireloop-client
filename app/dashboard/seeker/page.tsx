import Link from "next/link"
import { headers } from "next/headers"
import { Bookmark, CalendarDays, FileText, Gift, Send } from "lucide-react"

import { getJobs } from "@/lib/api/jobs"
import { auth } from "@/lib/auth"
import { authFetch } from "@/lib/core/server"
import {
  APPLICATION_STATUS_LABELS,
  formatRelativeDate,
  getApplicationStats,
  withResolvedJobIds,
  type ApplicationStatus,
  type JobApplication,
} from "@/lib/application"
import { cn } from "@/lib/utils"

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// Status colors for the activity text (mock shows statuses highlighted).
const STATUS_COLOR: Record<ApplicationStatus, string> = {
  Applied: "text-white/60",
  "Under Review": "text-amber-400",
  Shortlisted: "text-emerald-400",
  Rejected: "text-red-400",
  Offered: "text-emerald-400",
}

const ACTIVITY_LIMIT = 5

export default async function SeekerDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const userId = session?.user?.id

  let applications: JobApplication[] = []
  let savedJobsCount = 0

  if (userId) {
    // My applications — the backend scopes this to the session user.
    try {
      const res = await authFetch(
        `${baseURL}/applications?applicantId=${encodeURIComponent(userId)}`
      )
      const data = (await res.json()) as JobApplication[]
      applications = withResolvedJobIds(data, await getJobs())
    } catch (error) {
      console.error("Failed to load applications:", error)
    }

    // Saved jobs list is public and filtered by user id.
    try {
      const res = await fetch(
        `${baseURL}/saved-jobs?userId=${encodeURIComponent(userId)}`
      )
      if (res.ok) {
        savedJobsCount = ((await res.json()) as unknown[]).length
      }
    } catch (error) {
      console.error("Failed to load saved jobs:", error)
    }
  }

  // Real counts computed from my applications (interviews, offers, total).
  const stats = getApplicationStats(applications)
  const offersCount = applications.filter(
    (application) => application.status === "Offered"
  ).length

  const statCards = [
    {
      icon: Bookmark,
      iconClass: "text-white/60",
      label: "Saved Jobs",
      value: savedJobsCount,
      href: "/dashboard/seeker/saved",
    },
    {
      icon: Send,
      iconClass: "text-indigo-400",
      label: "Applications Submitted",
      value: stats.total,
      href: "/dashboard/seeker/applications",
    },
    {
      icon: CalendarDays,
      iconClass: "text-amber-400",
      label: "Interviews Scheduled",
      value: stats.interviews,
      href: "/dashboard/seeker/applications",
    },
    {
      icon: Gift,
      iconClass: "text-emerald-400",
      label: "Offers Received",
      value: offersCount,
      href: "/dashboard/seeker/applications",
    },
  ]

  // Latest applications become the activity feed (real events, real times).
  const recentActivity = [...applications]
    .sort((a, b) => (a.appliedAt < b.appliedAt ? 1 : -1))
    .slice(0, ACTIVITY_LIMIT)

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border bg-card p-5 text-card-foreground shadow-xs transition-colors hover:border-white/25"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs text-muted-foreground">{card.label}</p>
              <card.icon
                className={cn("size-5 shrink-0", card.iconClass)}
                aria-hidden="true"
              />
            </div>
            <p className="mt-4 text-3xl font-bold text-foreground">
              {card.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Recent Activity
          </h2>
          <Link
            href="/dashboard/seeker/applications"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            View All Activity
          </Link>
        </div>

        <div className="space-y-3">
          {recentActivity.map((application) => (
            <div
              key={application._id ?? application.jobId}
              className="flex items-center gap-4 rounded-xl border bg-card px-5 py-4 text-card-foreground shadow-xs"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/[0.06]">
                <FileText className="size-4 text-indigo-400" aria-hidden="true" />
              </span>

              <p className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
                {application.status === "Applied" ? (
                  <>
                    You applied for{" "}
                    <span className="text-foreground">{application.jobTitle}</span>{" "}
                    at {application.companyName}
                  </>
                ) : (
                  <>
                    Application for{" "}
                    <span className="text-foreground">{application.jobTitle}</span>{" "}
                    at {application.companyName} updated to{" "}
                    <span className={STATUS_COLOR[application.status]}>
                      &quot;{APPLICATION_STATUS_LABELS[application.status]}&quot;
                    </span>
                  </>
                )}
              </p>

              <span className="shrink-0 text-xs text-muted-foreground">
                {formatRelativeDate(application.appliedAt)}
              </span>
            </div>
          ))}

          {recentActivity.length === 0 && (
            <div className="rounded-xl border bg-card px-5 py-10 text-center text-card-foreground shadow-xs">
              <p className="text-sm text-muted-foreground">
                No activity yet — apply to your first job to see it here.
              </p>
              <Link
                href="/browse-jobs"
                className="mt-4 inline-block rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-white/90"
              >
                Browse Jobs
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
