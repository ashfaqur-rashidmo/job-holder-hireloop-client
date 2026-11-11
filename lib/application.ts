import type { JobPost } from "@/lib/job"

export const APPLICATION_STATUSES = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Rejected",
  "Offered",
] as const

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  Applied: "Applied",
  "Under Review": "Review",
  Shortlisted: "Shortlisted",
  Rejected: "Rejected",
  Offered: "Offered",
}

export type WorkMode = "Remote" | "Hybrid" | "On-site"

export type JobApplication = {
  _id?: string
  jobId: string
  jobTitle: string
  companyName: string
  jobCategory: string
  jobType: string
  workMode: WorkMode
  isRemote: boolean
  location: string
  userId: string
  userEmail: string
  userName?: string
  appliedAt: string
  status: ApplicationStatus
  archived: boolean
  interviewDate?: string | null
  interviewInDays?: number
  coverLetter?: string
  resumeUrl?: string
}

/** The data the seeker side has when submitting an application. */
export type JobApplicationInput = Pick<
  JobApplication,
  | "jobId"
  | "jobTitle"
  | "companyName"
  | "jobCategory"
  | "jobType"
  | "workMode"
  | "isRemote"
  | "location"
  | "userId"
  | "userEmail"
  | "userName"
  | "coverLetter"
  | "resumeUrl"
>

export type ApplicationUser = {
  id: string
  email: string
  name?: string | null
}

export function buildApplicationInput(
  job: JobPost,
  user: ApplicationUser
): JobApplicationInput {
  return {
    jobId: job._id,
    jobTitle: job.title,
    companyName: job.company,
    jobCategory: job.category,
    jobType: job.jobType,
    workMode: job.isRemote ? "Remote" : "On-site",
    isRemote: job.isRemote,
    location: job.location,
    userId: user.id,
    userEmail: user.email,
    userName: user.name ?? undefined,
  }
}

/**
 * Some older application records were saved without `jobId`.
 * Match them against real jobs (title + company) so the
 * Details link can point to the job details page.
 */
export function withResolvedJobIds(
  applications: JobApplication[],
  jobs: Pick<JobPost, "_id" | "title" | "company">[]
): JobApplication[] {
  const jobIdByKey = new Map(
    jobs.map((job) => [
      `${(job.title ?? "").trim().toLowerCase()}::${(job.company ?? "").trim().toLowerCase()}`,
      job._id,
    ])
  )

  return applications.map((application) => {
    if (application.jobId) {
      return application
    }

    const jobId = jobIdByKey.get(
      `${(application.jobTitle ?? "").trim().toLowerCase()}::${(application.companyName ?? "").trim().toLowerCase()}`
    )

    return jobId ? { ...application, jobId } : application
  })
}

export function formatApplicationJobMeta(
  application: Pick<JobApplication, "jobType" | "workMode">
) {
  return [application.jobType, application.workMode].filter(Boolean).join(" • ")
}

export function formatRelativeDate(value: string, now = Date.now()) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value || "—"
  }

  const diff = Math.max(0, now - date.getTime())
  const minutes = Math.floor(diff / 60_000)

  if (minutes < 1) {
    return "Just now"
  }

  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`
  }

  const hours = Math.floor(minutes / 60)

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`
  }

  const days = Math.floor(hours / 24)

  if (days < 7) {
    return `${days} day${days === 1 ? "" : "s"} ago`
  }

  const weeks = Math.floor(days / 7)

  if (weeks < 5) {
    return `${weeks} week${weeks === 1 ? "" : "s"} ago`
  }

  const months = Math.floor(days / 30)

  if (months < 12) {
    return `${months} month${months === 1 ? "" : "s"} ago`
  }

  const years = Math.floor(days / 365)

  return `${years} year${years === 1 ? "" : "s"} ago`
}

export function getApplicationStats(applications: JobApplication[]) {
  const total = applications.length
  const shortlisted = applications.filter(
    (application) => application.status === "Shortlisted"
  ).length
  const interviews = applications.filter(
    (application) =>
      Boolean(application.interviewDate) ||
      Number(application.interviewInDays) > 0
  ).length
  const offered = applications.filter(
    (application) => application.status === "Offered"
  ).length

  // Figma shows 12% for 3 offers out of 24 applications, so round down.
  const successRate = total ? Math.floor((offered / total) * 100) : 0

  return { total, shortlisted, interviews, successRate }
}
