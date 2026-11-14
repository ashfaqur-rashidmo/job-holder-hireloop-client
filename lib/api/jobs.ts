import type { JobPost } from "@/lib/job"

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const getJobs = async (query = ""): Promise<JobPost[]> => {
  const res = await fetch(`${baseURL}/jobs?${query}`)
  return res.json()
}

export const getJob = async (id: string): Promise<JobPost | null> => {
  const res = await fetch(`${baseURL}/jobs/${id}`)

  if (!res.ok) {
    return null
  }

  return res.json()
}

// How many job posts a recruiter has (free plan limit checks).
export const getRecruiterJobCount = async (
  recruiterId: string
): Promise<number> => {
  const res = await fetch(
    `${baseURL}/jobs/count?recruiterId=${encodeURIComponent(recruiterId)}`
  )

  if (!res.ok) {
    throw new Error("Failed to count job posts")
  }

  const data = await res.json()
  return typeof data.count === "number" ? data.count : 0
}
