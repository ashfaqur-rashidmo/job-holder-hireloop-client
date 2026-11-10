import { Bookmark, Clock, MapPin, Wallet, type LucideIcon } from "lucide-react"

import { JobCategoryIcon } from "@/app/component/JobCategoryIcon"
import { formatJobSalary, type JobPost } from "@/lib/job"
import { cn } from "@/lib/utils"

type JobCardProps = {
  job: JobPost
}

export function JobCard({ job }: JobCardProps) {
  const location = getLocationLabel(job)
  const salary = formatJobSalary(job, { includePeriod: false })
  const meta = [job.company, location].filter(Boolean).join(" • ")

  return (
    <article className="rounded-xl border border-white/10 bg-[#101010] p-4 transition-colors hover:border-white/20">
      <div className="flex gap-4">
        <JobCategoryIcon
          category={job.category}
          className="size-12 rounded-lg border border-white/5 bg-[#1a1a1a]"
          iconClassName="size-5"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-[15px] leading-5 font-semibold text-white">
                {job.title}
              </h2>

              <p className="mt-1 truncate text-[11px] text-white/40">{meta}</p>
            </div>

            <button
              type="button"
              aria-label={`Save ${job.title}`}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-white/30 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Bookmark className="size-4" />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {salary !== "—" && <JobBadge icon={Wallet} label={salary} />}

            {job.jobType && <JobBadge icon={Clock} label={job.jobType} />}

            <JobBadge
              icon={MapPin}
              label={job.isRemote ? "Remote" : "On-site"}
              tone={job.isRemote ? "success" : "default"}
            />
          </div>
        </div>
      </div>
    </article>
  )
}

type JobBadgeProps = {
  icon: LucideIcon
  label: string
  tone?: "default" | "success"
}

function JobBadge({ icon: Icon, label, tone = "default" }: JobBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-medium",
        tone === "success"
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
          : "border-white/10 bg-white/[0.03] text-white/55"
      )}
    >
      <Icon className="size-3" />
      {label}
    </span>
  )
}

function getLocationLabel(job: JobPost) {
  if (!job.location) {
    return job.isRemote ? "Remote" : ""
  }

  return job.isRemote ? `${job.location} (Remote)` : job.location
}
