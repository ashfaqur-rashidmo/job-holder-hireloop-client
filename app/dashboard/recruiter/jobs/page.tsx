"use client"

import * as React from "react"
import Link from "next/link"

import {
  Briefcase,
  Code2,
  GraduationCap,
  HeartPulse,
  MapPin,
  Megaphone,
  MoreVertical,
  PenTool,
  Pencil,
  Plus,
  Settings,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react"

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

import type { JobFormData } from "@/lib/job"
import { cn } from "@/lib/utils"
import { getJobs } from "@/lib/api/jobs"
import { DeleteJobDialog } from "@/app/component/DeleteJobDialog"

// Types
type JobStatus = "Active" | "Expired"

export type JobPost = JobFormData & {
  _id: string
  postedAgo: string
}

// Category icons and styles
const CATEGORY_META: Record<string, { icon: LucideIcon; className: string }> = {
  "Engineering & Tech": {
    icon: Code2,
    className: "text-sky-500 dark:text-sky-400",
  },

  "Design & Creative": {
    icon: PenTool,
    className: "text-orange-500 dark:text-orange-400",
  },

  "Marketing & Sales": {
    icon: Megaphone,
    className: "text-fuchsia-500 dark:text-fuchsia-400",
  },

  "Finance & Accounting": {
    icon: Wallet,
    className: "text-emerald-500 dark:text-emerald-400",
  },

  "Operations & Support": {
    icon: Settings,
    className: "text-indigo-500 dark:text-indigo-400",
  },

  Healthcare: {
    icon: HeartPulse,
    className: "text-rose-500 dark:text-rose-400",
  },

  Education: {
    icon: GraduationCap,
    className: "text-amber-500 dark:text-amber-400",
  },
}

const DEFAULT_CATEGORY_META: {
  icon: LucideIcon
  className: string
} = {
  icon: Briefcase,
  className: "text-indigo-500 dark:text-indigo-400",
}

const CURRENCY = "€"

const FREQUENCY_UNIT: Record<string, string> = {
  "per hour": "hr",
  "per day": "day",
  "per month": "mo",
  "per year": "yr",
}

// Helper functions
function getCategoryMeta(category: string) {
  return CATEGORY_META[category] ?? DEFAULT_CATEGORY_META
}

function getStatus(job: JobPost) {
  if (!job.deadline) return "Active"

  const deadline = new Date(`${job.deadline}T23:59:59`)

  return deadline < new Date() ? "Expired" : "Active"
}

function formatCompensation(job: JobPost) {
  if (!job.minSalary && !job.maxSalary) {
    return "—"
  }

  const unit = FREQUENCY_UNIT[job.frequency] ?? ""
  const suffix = job.frequency === "per year" ? "k" : ""

  const min = job.minSalary ? `${CURRENCY}${job.minSalary}${suffix}` : ""

  const max = job.maxSalary ? `${CURRENCY}${job.maxSalary}${suffix}` : ""

  const range = [min, max].filter(Boolean).join(" - ")

  return unit ? `${range} / ${unit}` : range
}

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
  const [jobs, setJobs] = React.useState<JobPost[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")

  // Fetch jobs
  React.useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        setError("")

        const data = await getJobs()

        setJobs(data as JobPost[])

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
  }, [])

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
      description: job.title,
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
                  <TableHead className="px-2.5 py-3 text-[11px] font-semibold tracking-wider uppercase">
                    Job Title &amp; Dept
                  </TableHead>

                  <TableHead className="px-2.5 py-3 text-[11px] font-semibold tracking-wider uppercase">
                    Company &amp; Location
                  </TableHead>

                  <TableHead className="hidden px-2.5 py-3 text-[11px] font-semibold tracking-wider uppercase min-[1440px]:table-cell">
                    Type
                  </TableHead>

                  <TableHead className="px-2.5 py-3 text-[11px] font-semibold tracking-wider uppercase">
                    Compensation
                  </TableHead>

                  <TableHead className="hidden px-2.5 py-3 text-[11px] font-semibold tracking-wider uppercase min-[1440px]:table-cell">
                    Applicants
                  </TableHead>

                  <TableHead className="px-2.5 py-3 text-[11px] font-semibold tracking-wider uppercase">
                    Status
                  </TableHead>

                  <TableHead className="px-2.5 py-3 text-[11px] font-semibold tracking-wider uppercase">
                    Deadline
                  </TableHead>

                  <TableHead className="px-2.5 py-3 text-right text-[11px] font-semibold tracking-wider uppercase">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {jobs.map((job) => {
                  const meta = getCategoryMeta(job.category)
                  const CategoryIcon = meta.icon

                  return (
                    <TableRow key={job._id} className="border-border/60">
                      <TableCell className="px-2.5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/60",
                              meta.className
                            )}
                          >
                            <CategoryIcon className="size-4" />
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[190px] truncate text-sm font-medium">
                              {job.title}
                            </p>

                            <p className={cn("text-xs", meta.className)}>
                              {job.category}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="px-2.5 py-4">
                        <p className="text-sm">{job.company}</p>

                        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="size-3 shrink-0" />

                          <span className="max-w-[180px] truncate">
                            {locationLabel(job)}
                          </span>
                        </p>
                      </TableCell>

                      <TableCell className="hidden px-2.5 py-4 min-[1440px]:table-cell">
                        <span className="inline-flex rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                          {job.jobType}
                        </span>
                      </TableCell>

                      <TableCell className="px-2.5 py-4">
                        <span className="text-sm">
                          {formatCompensation(job)}
                        </span>
                      </TableCell>

                      <TableCell className="hidden px-2.5 py-4 min-[1440px]:table-cell">
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Users className="size-4" />
                          {job.applicants} Candidates
                        </span>
                      </TableCell>

                      <TableCell className="px-2.5 py-4">
                        <StatusBadge status={getStatus(job)} />
                      </TableCell>

                      <TableCell className="px-2.5 py-4">
                        <p className="text-sm">{formatDate(job.deadline)}</p>

                        <p className="text-xs text-muted-foreground">
                          {job.postedAgo}
                        </p>
                      </TableCell>

                      <TableCell className="px-2.5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1.5 border-indigo-500/30 bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 dark:text-indigo-300"
                            onClick={() => handleUpdate(job)}
                          >
                            <Pencil className="size-3.5" />
                            Update
                          </Button>

                          <DeleteJobDialog job={job} onDeleted={handleDelete} />

                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`More actions for ${job.title}`}
                            onClick={() => handleMore(job)}
                          >
                            <MoreVertical className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
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

// Status badge
function StatusBadge({ status }: { status: JobStatus }) {
  const isActive = status === "Active"

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        isActive
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "bg-muted text-muted-foreground"
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          isActive ? "bg-emerald-500" : "bg-muted-foreground"
        )}
      />

      {status}
    </span>
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
  const meta = getCategoryMeta(job.category)
  const CategoryIcon = meta.icon

  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/60",
              meta.className
            )}
          >
            <CategoryIcon className="size-4" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{job.title}</p>

            <p className={cn("text-xs", meta.className)}>{job.category}</p>
          </div>
        </div>

        <StatusBadge status={getStatus(job)} />
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
          <dd className="mt-0.5 text-sm">{formatCompensation(job)}</dd>
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

      <div className="mt-4 flex items-center gap-2 border-t border-border/60 pt-3">
        <Button
          variant="outline"
          size="sm"
          className="h-8 flex-1 gap-1.5 border-indigo-500/30 bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 dark:text-indigo-300"
          onClick={() => onUpdate(job)}
        >
          <Pencil className="size-3.5" />
          Update
        </Button>

        {/* <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Delete ${job.title}`}
          onClick={() => onDelete(job.id)}
        >
          <Trash2 className="size-4" />
        </Button> */}

        <DeleteJobDialog job={job} onDeleted={onDelete} />

        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`More actions for ${job.title}`}
          onClick={() => onMore(job)}
        >
          <MoreVertical className="size-4" />
        </Button>
      </div>
    </div>
  )
}
