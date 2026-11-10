import {
  getCategoryMeta,
  JobCategoryIcon,
} from "@/app/component/RecruiterJobs/JobCategoryIcon"
import type { JobPost } from "@/lib/job"
import { cn } from "@/lib/utils"

export function JobIdentity({
  job,
  className,
  titleClassName = "truncate text-sm font-medium",
}: {
  job: Pick<JobPost, "title" | "category">
  className?: string
  titleClassName?: string
}) {
  const meta = getCategoryMeta(job.category)

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <JobCategoryIcon category={job.category} />

      <div className="min-w-0">
        <p className={titleClassName}>{job.title}</p>

        <p className={cn("text-xs", meta.className)}>{job.category}</p>
      </div>
    </div>
  )
}
