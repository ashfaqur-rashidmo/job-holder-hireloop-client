"use client"

import * as React from "react"
import Link from "next/link"
import {useState, useEffect} from "react"

import { MapPin, Plus, Users } from "lucide-react"

import { toast } from "sonner"

import { Button, buttonVariants } from "@/components/ui/button"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { JobActions } from "@/app/component/RecruiterJobs/JobActions"
import { JobIdentity } from "@/app/component/RecruiterJobs/JobIdentity"
import { JobStatusBadge } from "@/app/component/RecruiterJobs/JobStatusBadge"
import { getJobs } from "@/lib/api/jobs"
import { useSession } from "@/lib/auth-client"
import { formatJobSalary, getJobStatus, type JobPost } from "@/lib/job"
import { cn } from "@/lib/utils"

// Table styles
const tableHeadClass =
  "px-2.5 py-3 text-[11px] font-semibold tracking-wider uppercase"

const tableCellClass = "px-2.5 py-4"

// Helper functions
function formatDate(value: string) {
  if (!value) {
    return "—"
  }

  const date = new Date(`${value}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}

function locationLabel(job: JobPost) {
  return job.isRemote ? `Remote (${job.location})` : job.location
}

// Main page
export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState<JobPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const { data: sessionData, isPending: isSessionPending } = useSession()

  // Fetch only the signed-in recruiter's job posts
  useEffect(() => {
    // Wait for the session before fetching with the recruiter id
    if (isSessionPending) return

    const fetchJobs = async () => {
      try {
        setLoading(true)
        setError("")

        const user = sessionData?.user

        if (!user) {
          setError("Please sign in as a recruiter to see your job posts.")
          return
        }

        const data = await getJobs(`recruiterId=${user.id}`)

        setJobs(data)

        console.log("Jobs data:", data)
      } catch (error) {
        console.error("Error fetching jobs:", error)

        setError("Failed to load job posts.")
        toast.error("Failed to load jobs")
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [isSessionPending, sessionData])

  // Update job
  function handleUpdate(job: JobPost) {
    toast.info("Update job post", {
      description: job.title,
    })
  }

  // Delete job from frontend state after the API confirms it.
  function handleDelete(id: string) {
    setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id))
  }

  // More actions
  function handleMore(job: JobPost) {
    toast.info("More actions", {
      description: job.title
    })
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading jobs...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
        <p className="text-sm text-destructive">{error}</p>

        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl pb-10">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Manage Jobs</span>
            <span aria-hidden="true">›</span>
            <span>Job Listings &amp; Postings</span>
          </nav>

          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Manage Job Posts
          </h1>

          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
            Review live listings, monitor applicants, and update job details
            across your organization.
          </p>
        </div>

        <Link
          href="/dashboard/recruiter/jobs/new"
          className={buttonVariants({
            variant: "gradient",
            className: "h-9 shrink-0 rounded-lg px-4",
          })}
        >
          <Plus className="size-4" />
          New Job Post
        </Link>
      </div>

      {/* Empty state */}
      {jobs.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border/60 p-12 text-center text-sm text-muted-foreground">
          No job posts yet. Click “New Job Post” to create one.
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-8 hidden overflow-hidden rounded-xl border border-border/60 bg-card xl:block">
            <Table className="min-w-[900px]">
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead className={tableHeadClass}>
                    Job Title &amp; Dept
                  </TableHead>

                  <TableHead className={tableHeadClass}>
                    Company &amp; Location
                  </TableHead>

                  <TableHead
                    className={cn(
                      tableHeadClass,
                      "hidden min-[1440px]:table-cell"
                    )}
                  >
                    Type
                  </TableHead>

                  <TableHead className={tableHeadClass}>Compensation</TableHead>

                  <TableHead
                    className={cn(
                      tableHeadClass,
                      "hidden min-[1440px]:table-cell"
                    )}
                  >
                    Applicants
                  </TableHead>

                  <TableHead className={tableHeadClass}>Status</TableHead>

                  <TableHead className={tableHeadClass}>Deadline</TableHead>

                  <TableHead className={cn(tableHeadClass, "text-right")}>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job._id} className="border-border/60">
                    <TableCell className={tableCellClass}>
                      <JobIdentity
                        job={job}
                        titleClassName="max-w-[190px] truncate text-sm font-medium"
                      />
                    </TableCell>

                    <TableCell className={tableCellClass}>
                      <p className="text-sm">{job.company}</p>

                      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3 shrink-0" />

                        <span className="max-w-[180px] truncate">
                          {locationLabel(job)}
                        </span>
                      </p>
                    </TableCell>

                    <TableCell
                      className={cn(
                        tableCellClass,
                        "hidden min-[1440px]:table-cell"
                      )}
                    >
                      <span className="inline-flex rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                        {job.jobType}
                      </span>
                    </TableCell>

                    <TableCell className={tableCellClass}>
                      <span className="text-sm">{formatJobSalary(job)}</span>
                    </TableCell>

                    <TableCell
                      className={cn(
                        tableCellClass,
                        "hidden min-[1440px]:table-cell"
                      )}
                    >
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Users className="size-4" />
                        {job.applicants} Candidates
                      </span>
                    </TableCell>

                    <TableCell className={tableCellClass}>
                      <JobStatusBadge status={getJobStatus(job)} />
                    </TableCell>

                    <TableCell className={tableCellClass}>
                      <p className="text-sm">{formatDate(job.deadline)}</p>

                      <p className="text-xs text-muted-foreground">
                        {job.postedAgo}
                      </p>
                    </TableCell>

                    <TableCell className={tableCellClass}>
                      <JobActions
                        job={job}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                        onMore={handleMore}
                        className="justify-end gap-1"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile / tablet cards */}
          <div className="mt-8 grid gap-3 md:grid-cols-2 xl:hidden">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onMore={handleMore}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// Mobile / tablet job card
function JobCard({
  job,
  onUpdate,
  onDelete,
  onMore,
}: {
  job: JobPost
  onUpdate: (job: JobPost) => void
  onDelete: (id: string) => void
  onMore: (job: JobPost) => void
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <JobIdentity
          job={job}
          className="min-w-0"
          titleClassName="truncate text-sm font-semibold"
        />

        <JobStatusBadge status={getJobStatus(job)} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
        <div className="col-span-2">
          <dt className="text-muted-foreground">Company</dt>
          <dd className="mt-0.5 text-sm">{job.company}</dd>
        </div>

        <div className="col-span-2">
          <dt className="text-muted-foreground">Location</dt>

          <dd className="mt-0.5 flex items-center gap-1 text-sm">
            <MapPin className="size-3.5 shrink-0 text-muted-foreground" />

            <span className="truncate">{locationLabel(job)}</span>
          </dd>
        </div>

        <div>
          <dt className="text-muted-foreground">Type</dt>

          <dd className="mt-0.5">
            <span className="inline-flex rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {job.jobType}
            </span>
          </dd>
        </div>

        <div>
          <dt className="text-muted-foreground">Compensation</dt>
          <dd className="mt-0.5 text-sm">{formatJobSalary(job)}</dd>
        </div>

        <div>
          <dt className="text-muted-foreground">Applicants</dt>

          <dd className="mt-0.5 flex items-center gap-1 text-sm">
            <Users className="size-3.5 text-muted-foreground" />
            {job.applicants} Candidates
          </dd>
        </div>

        <div>
          <dt className="text-muted-foreground">Deadline</dt>

          <dd className="mt-0.5 text-sm">{formatDate(job.deadline)}</dd>

          <dd className="text-[11px] text-muted-foreground">{job.postedAgo}</dd>
        </div>
      </dl>

      <JobActions
        job={job}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onMore={onMore}
        className="mt-4 border-t border-border/60 pt-3"
        updateClassName="flex-1"
      />
    </div>
  )
}
