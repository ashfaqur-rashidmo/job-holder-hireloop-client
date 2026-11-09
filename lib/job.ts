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
]

export const JOB_FREQUENCIES = ["per hour", "per day", "per month", "per year"]

export type JobFormData = {
  title: string
  company: string
  category: string
  jobType: JobType
  isRemote: boolean
  location: string
  deadline: string
  minSalary: string
  maxSalary: string
  frequency: string
  responsibilities: string
  qualifications: string
  applicants: number
  status: JobStatus
}

export type JobPost = JobFormData & {
  _id: string
  postedAgo: string
}

export function getJobStatus(job: Pick<JobFormData, "deadline">): JobStatus {
  if (!job.deadline) return "Active"

  const deadline = new Date(`${job.deadline}T23:59:59`)

  return deadline < new Date() ? "Expired" : "Active"
}
