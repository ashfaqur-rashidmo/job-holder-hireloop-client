"use client"

import * as React from "react"
import Link from "next/link"
import {
  Clock,
  Eye,
  Mail,
  Plus,
  Trash2,
  TrendingUp,
} from "lucide-react"
import { toast } from "sonner"

import { deleteJob } from "@/lib/actions/jobs"
import { getJobStatus, type JobPost } from "@/lib/job"
import { cn } from "@/lib/utils"

type AdminJobsViewProps = {
  jobs: JobPost[]
  totalApplications: number
}

type StatusFilter = "all" | "Active" | "Expired"

const headClass = "h-11 px-4 text-xs font-medium"
const cellClass = "px-4 text-[13px]"
const selectClass =
  "h-9 rounded-lg border border-white/10 bg-[#111111] px-3 text-sm text-white outline-none focus:border-white/30"

export function AdminJobsView({ jobs: initialJobs, totalApplications }: AdminJobsViewProps) {
  // Local copy so a deleted job disappears without a reload.
  const [jobs, setJobs] = React.useState(initialJobs)
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all")
  const [categoryFilter, setCategoryFilter] = React.useState("all")
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  // Status comes from the deadline so legacy posts count correctly.
  const activeCount = jobs.filter((job) => getJobStatus(job) === "Active").length
  const expiredCount = jobs.length - activeCount

  // Categories that actually appear in the data (for the filter dropdown).
  const categories = [...new Set(jobs.map((job) => job.category).filter(Boolean))]

  const filteredJobs = jobs.filter((job) => {
    const matchesStatus =
      statusFilter === "all" || getJobStatus(job) === statusFilter
    const matchesCategory =
      categoryFilter === "all" || job.category === categoryFilter
    return matchesStatus && matchesCategory
  })

  // Deletes the job post (admin override) and updates the local list.
  async function handleDelete(job: JobPost) {
    if (deletingId) return
    if (!window.confirm(`Delete "${job.title}"? This cannot be undone.`)) return

    setDeletingId(job._id)

    try {
      const result = await deleteJob(job._id)

      if (!result.success) {
        toast.error(result.message)
        return
      }

      setJobs((prev) => prev.filter((prevJob) => prevJob._id !== job._id))
      toast.success("Job deleted", { description: job.title })
    } catch {
      toast.error("Failed to delete the job.")
    } finally {
      setDeletingId(null)
    }
  }

  const stats = [
    {
      icon: TrendingUp,
      label: "Active Jobs",
      value: String(activeCount),
      hint: `out of ${jobs.length} total posts`,
    },
    {
      icon: Clock,
      label: "Expired Jobs",
      value: String(expiredCount),
      hint: "deadline has passed",
    },
    {
      icon: Mail,
      label: "Total Applications",
      value: totalApplications.toLocaleString("en-US"),
      hint: "across all jobs",
    },
  ]

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Manage Jobs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Oversee all active listings and historical job posts across the
            platform.
          </p>
        </div>

        <Link
          href="/dashboard/recruiter/jobs/new"
          className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-white/90"
        >
          <Plus className="size-4" aria-hidden="true" />
          Create Job
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as StatusFilter)
          }
          className={selectClass}
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Expired">Expired</option>
        </select>

        <select
          aria-label="Filter by category"
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className={selectClass}
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Status count pills (click to toggle the status filter) */}
        <div className="flex overflow-hidden rounded-lg border border-white/10">
          <button
            type="button"
            onClick={() =>
              setStatusFilter(statusFilter === "Active" ? "all" : "Active")
            }
            aria-pressed={statusFilter === "Active"}
            className={cn(
              "px-3 py-2 text-sm transition-colors",
              statusFilter === "Active"
                ? "bg-white/10 text-white"
                : "text-white/50 hover:text-white"
            )}
          >
            Active ({activeCount})
          </button>
          <button
            type="button"
            onClick={() =>
              setStatusFilter(statusFilter === "Expired" ? "all" : "Expired")
            }
            aria-pressed={statusFilter === "Expired"}
            className={cn(
              "border-l border-white/10 px-3 py-2 text-sm transition-colors",
              statusFilter === "Expired"
                ? "bg-white/10 text-white"
                : "text-white/50 hover:text-white"
            )}
          >
            Expired ({expiredCount})
          </button>
        </div>
      </div>

      {/* Jobs table */}
      <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead className="bg-muted/40">
              <tr>
                <th className={headClass}>Title</th>
                <th className={headClass}>Company</th>
                <th className={headClass}>Category</th>
                <th className={headClass}>Type</th>
                <th className={headClass}>Date Posted</th>
                <th className={headClass}>Status</th>
                <th className={cn(headClass, "text-right")}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => {
                const isActive = getJobStatus(job) === "Active"

                return (
                  <tr key={job._id} className="border-t border-white/5">
                    <TableCell>
                      <p className="font-medium text-foreground">
                        {job.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        Ref: HL-{job._id.slice(-5).toUpperCase()}
                      </p>
                    </TableCell>

                    <TableCell>
                      <span className="flex items-center gap-2">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded bg-white/10 text-[11px] font-semibold text-white/80">
                          {(job.company || "?").charAt(0).toUpperCase()}
                        </span>
                        <span className="truncate">{job.company || "—"}</span>
                      </span>
                    </TableCell>

                    <TableCell>
                      {job.category ? (
                        <span className="inline-flex rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-white/60">
                          {job.category}
                        </span>
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    <TableCell>
                      {job.isRemote ? "Remote" : job.jobType || "—"}
                    </TableCell>

                    <TableCell>{job.postedAgo || "—"}</TableCell>

                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
                          isActive
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                            : "border-white/10 bg-white/[0.06] text-white/50"
                        )}
                      >
                        <span className="size-1.5 rounded-full bg-current" />
                        {isActive ? "Active" : "Expired"}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="flex items-center justify-end gap-1">
                        <Link
                          href={`/browse-jobs/${job._id}`}
                          aria-label={`View ${job.title}`}
                          className="inline-flex size-8 items-center justify-center rounded-md text-white/50 transition-colors hover:bg-white/5 hover:text-white"
                        >
                          <Eye className="size-4" aria-hidden="true" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(job)}
                          disabled={deletingId === job._id}
                          aria-label={`Delete ${job.title}`}
                          className="inline-flex size-8 items-center justify-center rounded-md text-white/50 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                        </button>
                      </span>
                    </TableCell>
                  </tr>
                )
              })}

              {filteredJobs.length === 0 && (
                <tr>
                  <TableCell className="py-10 text-center text-muted-foreground" colSpan={7}>
                    No jobs match the current filters.
                  </TableCell>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border bg-card p-5 text-card-foreground shadow-xs"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <stat.icon className="size-4" aria-hidden="true" />
              {stat.label}
            </div>
            <p className="mt-3 text-3xl font-bold text-foreground">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.hint}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Local helpers so the plain <table> keeps the shadcn spacing classes.
function TableCell({
  children,
  className,
  colSpan,
}: {
  children: React.ReactNode
  className?: string
  colSpan?: number
}) {
  return (
    <td colSpan={colSpan} className={cn(cellClass, "py-3", className)}>
      {children}
    </td>
  )
}
