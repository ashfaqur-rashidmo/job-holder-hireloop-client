import {
  BarChart3,
  Clock3,
  MapPin,
  Wallet,
  type LucideIcon,
} from "lucide-react"

import { formatJobSalary, type JobPost } from "@/lib/job"

import { formatJobLocation, getJobExperience } from "../../../lib/jobDetailsData/job-details-data"

type JobDetailsStatsProps = {
  job: JobPost
}

type Stat = {
  label: string
  value: string
  icon: LucideIcon
}

export function JobDetailsStats({ job }: JobDetailsStatsProps) {
  const stats: Stat[] = [
    {
      label: "Salary Range",
      value: formatJobSalary(job, { includePeriod: false }),
      icon: Wallet,
    },
    {
      label: "Location",
      value: formatJobLocation(job),
      icon: MapPin,
    },
    {
      label: "Job Type",
      value: job.jobType || "Not specified",
      icon: Clock3,
    },
    {
      label: "Experience",
      value: getJobExperience(job),
      icon: BarChart3,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="min-h-[121px] border border-white/[0.07] bg-[#141418] p-5 sm:p-6"
        >
          <Icon className="size-4 text-[#C4C7C8]" strokeWidth={1.8} />
          <p className="mt-3 text-[13px] font-medium tracking-wide text-[#A0A0AB] uppercase">
            {label}
          </p>
          <p className="mt-1 text-[15px] leading-6 font-medium break-words text-[#EDEDEF]">
            {value}
          </p>
        </div>
      ))}
    </div>
  )
}
