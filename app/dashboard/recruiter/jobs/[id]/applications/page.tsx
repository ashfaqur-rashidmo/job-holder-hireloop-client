"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, MapPin } from "lucide-react"

import { ApplicationsCards } from "@/app/component/RecruiterApplications/ApplicationsCards"
import { ApplicationsTable } from "@/app/component/RecruiterApplications/ApplicationsTable"
import { JobStatusBadge } from "@/app/component/RecruiterJobs/JobStatusBadge"
import { buttonVariants } from "@/components/ui/button"
import { getApplicationsByJob } from "@/lib/actions/applications"
import { getJob } from "@/lib/api/jobs"
import { useSession } from "@/lib/auth-client"
import { type JobApplication } from "@/lib/application"
import { getJobStatus, type JobPost } from "@/lib/job"

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

export default function JobApplicationsPage() {
  const { id } = useParams<{ id: string }>()

  const [job, setJob] = React.useState<JobPost | null>(null)
  const [applications, setApplications] = React.useState<JobApplication[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")

  const { data: sessionData, isPending: isSessionPending } = useSession()

  React.useEffect(() => {
    if (isSessionPending || !id) return

    const fetchData = async () => {
      try {
        setLoading(true)
        setError("")

        const user = sessionData?.user

        if (!user) {
          setError("Please sign in as a recruiter to review applications.")
          return
        }

        const jobData = await getJob(id)

        if (!jobData) {
          setError("Job post not found.")
          return
        }

        // Recruiters can only review applications for their own job posts.
        if (jobData.recruiterId && jobData.recruiterId !== user.id) {
          setError("You can only review applications for your own job posts.")
          return
        }

        const applicationData = await getApplicationsByJob(id)

        setJob(jobData)
        setApplications(applicationData)
      } catch (fetchError) {
        console.error("Error loading applications:", fetchError)
        setError("Failed to load applications.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, isSessionPending, sessionData])

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading applications...</p>
      </div>
    )
  }

  // Error state
  if (error || !job) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
        <p className="text-sm text-destructive">{error || "Job not found."}</p>

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
            <span className="max-w-[180px] truncate">{job.title}</span>
            <span aria-hidden="true">›</span>
            <span>Applications</span>
          </nav>

          <h1 className="mt-2 truncate text-2xl font-bold tracking-tight sm:text-3xl">
            Applications for {job.title}
          </h1>

          <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span>{job.company}</span>

            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5 shrink-0" />
              {job.isRemote ? `Remote (${job.location})` : job.location}
            </span>

            <JobStatusBadge status={getJobStatus(job)} />
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
          No applications yet for this job post.
        </div>
      ) : (
        <>
          <ApplicationsTable
            applications={applications}
            className="mt-8 hidden xl:block"
          />

          <ApplicationsCards
            applications={applications}
            className="mt-8 space-y-3 xl:hidden"
          />
        </>
      )}
    </div>
  )
}
