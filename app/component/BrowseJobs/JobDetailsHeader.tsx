import { ShieldCheck } from "lucide-react"

import { JobCategoryIcon } from "@/app/component/RecruiterJobs/JobCategoryIcon"
import type { JobPost, JobStatus } from "@/lib/job"

import { JobDetailsActions } from "./JobDetailsActions"

type JobDetailsHeaderProps = {
  job: JobPost
  status: JobStatus
}

export function JobDetailsHeader({ job, status }: JobDetailsHeaderProps) {
  return (
    <header className="flex flex-col gap-6 border border-white/[0.07] bg-[#141418] p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-center gap-5 sm:gap-6">
        <JobCategoryIcon
          category={job.category}
          className="size-16 rounded-xl border border-white/[0.07] bg-[#1A1A1F] sm:size-20"
          iconClassName="size-8 sm:size-9"
        />

        <div className="min-w-0">
          <h1 className="text-2xl leading-8 font-semibold tracking-tight text-[#EDEDEF] sm:text-[32px] sm:leading-10">
            {job.title}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 sm:mt-3">
            <p className="text-lg text-[#A0A0AB] sm:text-[22px]">
              {job.company}
            </p>
            <span className="hidden size-1 rounded-full bg-[#8E9192] sm:block" />
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-500 sm:text-base">
              <ShieldCheck className="size-4 sm:size-5" />
              Verified Employer
            </span>
          </div>
        </div>
      </div>

      <JobDetailsActions jobTitle={job.title} expired={status === "Expired"} />
    </header>
  )
}
