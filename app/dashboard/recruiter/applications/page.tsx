"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { ApplicationsCards } from "@/app/component/RecruiterApplications/ApplicationsCards"
import { ApplicationsTable } from "@/app/component/RecruiterApplications/ApplicationsTable"
import { buttonVariants } from "@/components/ui/button"
import {
  getApplicationsByJob,
  type ApplicationsByJobResult,
} from "@/lib/actions/applications"
import { getJobs } from "@/lib/api/jobs"
import { useSession } from "@/lib/auth-client"
import { type JobApplication } from "@/lib/application"

type ApplicationCounts = {
  total: number
  underReview: number
  shortlisted: number
  offered: number
}

function countApplications(applications: JobApplication[]): ApplicationCounts {
  return {
    total: applications.length,
    underReview: applications.filter(
      (application) => application.status === "Under Review"
    ).length,
    shortlisted: applications.filter(
      (application) => application.status === "Shortlisted"
    ).length,
    offered: applications.filter(
      (application) => application.status === "Offered"
    ).length,
  }
}

export default function RecruiterApplicationsPage() {
  const router = useRouter()
  const [applications, setApplications] = React.useState<JobApplication[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")

  const { data: sessionData, isPending: isSessionPending } = useSession()

  React.useEffect(() => {
    if (isSessionPending) return

    const fetchData = async () => {
      try {
        setLoading(true)
        setError("")

        const user = sessionData?.user

        if (!user) {
          setError("Please sign in as a recruiter to review applications.")
          return
        }

        // Load every job post of this recruiter, then the applications of
        // each post (the backend has no recruiter-wide applications filter).
        const jobs = await getJobs(
          `recruiterId=${encodeURIComponent(user.id)}`
        )

        const results = await Promise.all(
          jobs.map((job) =>
            getApplicationsByJob(job._id).catch(
              () => null as ApplicationsByJobResult | null
            )
          )
        )

        // An invalid/expired session fails every call — go to /unauthorized
        // once instead of rendering an empty list.
        if (results.some((result) => result?.status === "unauthorized")) {
          router.push("/unauthorized")
          return
        }

        // Merge this recruiter's own applications, newest first. Forbidden
        // or failed jobs are skipped (they are not readable by this user).
        const allApplications = results
          .filter(
            (result): result is ApplicationsByJobResult =>
              result?.status === "ok"
          )
          .flatMap((result) => result.applications)
          .sort((a, b) =>
            (b.appliedAt ?? "").localeCompare(a.appliedAt ?? "")
          )

        setApplications(allApplications)
      } catch (fetchError) {
        console.error("Error loading applications:", fetchError)
        setError("Failed to load applications.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isSessionPending, sessionData, router])

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading applications...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
        <p className="text-sm text-destructive">{error}</p>

        <Link
          href="/dashboard/recruiter/jobs"
          className={buttonVariants({ variant: "outline" })}
        >
          <ArrowLeft className="size-4" />
          Back to Job Posts
        </Link>
      </div>
    )
  }

  const counts = countApplications(applications)
  const stats = [
    { label: "Total Applications", value: counts.total },
    { label: "Under Review", value: counts.underReview },
    { label: "Shortlisted", value: counts.shortlisted },
    { label: "Offered", value: counts.offered },
  ]

  return (
    <div className="mx-auto w-full max-w-6xl pb-10">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link
              href="/dashboard/recruiter/jobs"
              className="hover:text-foreground hover:underline"
            >
              Manage Jobs
            </Link>
            <span aria-hidden="true">›</span>
            <span>Applications</span>
          </nav>

          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            All Applications
          </h1>

          <p className="mt-1.5 text-sm text-muted-foreground">
            Every application across your job posts, newest first.
          </p>
        </div>

        <Link
          href="/dashboard/recruiter/jobs"
          className={buttonVariants({
            variant: "outline",
            className: "h-9 shrink-0 rounded-lg px-4",
          })}
        >
          <ArrowLeft className="size-4" />
          Back to Job Posts
        </Link>
      </div>

      {/* Summary cards */}
      <section aria-label="Application statistics" className="mt-8">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border bg-card p-5 text-card-foreground shadow-xs"
            >
              <p className="text-[13px] leading-5 text-muted-foreground">
                {stat.label}
              </p>

              <p className="mt-2 text-[26px] leading-8 font-semibold tracking-tight">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Applications list */}
      {applications.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border/60 p-12 text-center text-sm text-muted-foreground">
          No applications yet across your job posts.
        </div>
      ) : (
        <>
          <ApplicationsTable
            applications={applications}
            showJob
            className="mt-8 hidden xl:block"
          />

          <ApplicationsCards
            applications={applications}
            showJob
            className="mt-8 space-y-3 xl:hidden"
          />
        </>
      )}
    </div>
  )
}
