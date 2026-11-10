import type { JobPost } from "@/lib/job"

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const getJobs = async (query = ""): Promise<JobPost[]> => {
  const res = await fetch(`${baseURL}/jobs?${query}`)
  return res.json()
}

export const getJob = async (id: string): Promise<JobPost | null> => {
  const res = await fetch(`${baseURL}/jobs/${encodeURIComponent(id)}`)

  if (!res.ok) {
    return null
  }

  return res.json()
}
