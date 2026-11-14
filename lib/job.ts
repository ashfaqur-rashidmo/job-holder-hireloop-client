
export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
] as const

export type JobType = (typeof JOB_TYPES)[number]

export type JobStatus = "Active" | "Expired"

export const JOB_CATEGORIES = [
  "Engineering & Tech",
  "Design & Creative",
  "Marketing & Sales",
  "Finance & Accounting",
  "Operations & Support",
  "Healthcare",
  "Education",
] as const

export type JobCategory = (typeof JOB_CATEGORIES)[number]

export const JOB_FREQUENCIES = [
  "per hour",
  "per day",
  "per month",
  "per year",
] as const

export type JobFrequency = (typeof JOB_FREQUENCIES)[number]

export type JobFormData = {
  title: string
  company: string
  companyId: string
  recruiterId: string
  category: string
  jobType: JobType
  isRemote: boolean
  location: string
  deadline: string
  minSalary: string
  maxSalary: string
  frequency: JobFrequency
  responsibilities: string
  qualifications: string
  applicants: number
  status: JobStatus
  description?: string
  benefits?: string
}

export type JobPost = JobFormData & {
  _id: string
  postedAgo: string
}

const CURRENCY = "€"

const FREQUENCY_UNIT: Record<JobFrequency, string> = {
  "per hour": "hr",
  "per day": "day",
  "per month": "mo",
  "per year": "yr",
}

export function formatJobSalary(
  job: Pick<JobPost, "minSalary" | "maxSalary" | "frequency">,
  options: { includePeriod?: boolean } = {}
): string {
  if (!job.minSalary && !job.maxSalary) {
    return "—"
  }

  const suffix = job.frequency === "per year" ? "k" : ""

  const min = job.minSalary
    ? `${CURRENCY}${job.minSalary}${suffix}`
    : ""

  const max = job.maxSalary
    ? `${CURRENCY}${job.maxSalary}${suffix}`
    : ""

  const range = [min, max].filter(Boolean).join(" - ")
  const includePeriod = options.includePeriod ?? true
  const unit = FREQUENCY_UNIT[job.frequency]

  return includePeriod ? `${range} / ${unit}` : range
}

export function getJobStatus(
  job: Pick<JobFormData, "deadline">
): JobStatus {
  if (!job.deadline) {
    return "Active"
  }

  const deadline = new Date(`${job.deadline}T23:59:59`)

  if (Number.isNaN(deadline.getTime())) {
    return "Expired"
  }

  return deadline < new Date() ? "Expired" : "Active"
}
