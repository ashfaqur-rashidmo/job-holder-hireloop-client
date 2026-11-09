import type { JobPost } from "@/lib/job"

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const getJobs = async (): Promise<JobPost[]> => {
  const res = await fetch(`${baseURL}/jobs`)
  return res.json()
}
