import type { ApplicationUser } from "@/lib/application"
import type { JobFrequency, JobPost } from "@/lib/job"

export type SavedJob = {
  _id?: string
  jobId: string
  userId: string
  userEmail: string
  jobTitle: string
  companyName: string
  jobCategory: string
  jobType: string
  workMode: string
  location: string
  minSalary: string
  maxSalary: string
  frequency: JobFrequency
  deadline: string
  savedAt: string
}

/** The data needed to store a saved job snapshot. */
export type SavedJobInput = Omit<SavedJob, "_id" | "savedAt">

export function buildSavedJobInput(
  job: JobPost,
  user: ApplicationUser
): SavedJobInput {
  return {
    jobId: job._id,
    userId: user.id,
    userEmail: user.email,
    jobTitle: job.title,
    companyName: job.company,
    jobCategory: job.category,
    jobType: job.jobType,
    workMode: job.isRemote ? "Remote" : "On-site",
    location: job.location,
    minSalary: job.minSalary,
    maxSalary: job.maxSalary,
    frequency: job.frequency,
    deadline: job.deadline,
  }
}

/** A job closes within 7 days when its deadline date is close and still open. */
export function isClosingSoon(deadline: string, now = Date.now()): boolean {
  const daysLeft = getDaysUntilDeadline(deadline, now)
  return daysLeft !== null && daysLeft >= 0 && daysLeft <= 7
}

/** Days until the deadline closes, or null when there is no valid deadline. */
export function getDaysUntilDeadline(
  deadline: string,
  now = Date.now()
): number | null {
  if (!deadline) {
    return null
  }

  const deadlineTime = new Date(`${deadline}T23:59:59`).getTime()

  if (Number.isNaN(deadlineTime)) {
    return null
  }

  return Math.ceil((deadlineTime - now) / 86_400_000)
}
