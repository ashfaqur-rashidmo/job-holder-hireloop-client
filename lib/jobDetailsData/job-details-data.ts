import type { JobPost } from "@/lib/job"

export function formatJobLocation(job: Pick<JobPost, "location" | "isRemote">) {
  const location = job.location?.trim()

  if (job.isRemote) {
    return location ? `Remote (${location})` : "Remote"
  }

  return location || "Not specified"
}

export function getJobExperience(
  job: Pick<JobPost, "qualifications" | "responsibilities">
) {
  const text = `${job.qualifications ?? ""} ${job.responsibilities ?? ""}`
  const match = text.match(/(\d+)\s*(\+)?\s*years?/i)

  if (!match) {
    return "Not specified"
  }

  return `${match[1]}${match[2] ? "+" : ""} Years`
}

export function getJobDescription(
  job: Pick<
    JobPost,
    | "description"
    | "title"
    | "company"
    | "category"
    | "jobType"
    | "location"
    | "isRemote"
  >
) {
  if (job.description?.trim()) {
    return job.description.trim()
  }

  const workplace = job.isRemote
    ? "remote"
    : `based in ${job.location || "the company office"}`

  return `${job.company} is looking for a ${job.title} to join its ${job.category} team. This ${job.jobType.toLowerCase()} role is ${workplace}, working closely with product, design, and engineering partners to deliver meaningful results.`
}

export function splitJobList(value?: string | string[]) {
  if (!value) {
    return []
  }

  const items = Array.isArray(value)
    ? value
    : value.split(/\r?\n|(?<=[.!?])\s+/)

  return items
    .map((item) => item.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean)
}

export function getJobBenefits(job: Pick<JobPost, "benefits">) {
  return splitJobList(job.benefits)
}
