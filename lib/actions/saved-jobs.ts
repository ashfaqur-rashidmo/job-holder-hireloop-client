import type { ApplicationUser } from "@/lib/application"
import type { JobPost } from "@/lib/job"
import {
  buildSavedJobInput,
  type SavedJob,
  type SavedJobInput,
} from "@/lib/saved-job"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export type SavedJobResult = {
  success: boolean
  message: string
  alreadySaved?: boolean
}

export async function getSavedJobs(userId: string): Promise<SavedJob[]> {
  const response = await fetch(`${BASE_URL}/saved-jobs?userId=${userId}`, {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Failed to load saved jobs.")
  }

  return (await response.json()) as SavedJob[]
}

/** Whether the user already bookmarked this job (used to restore the save toggle). */
export async function isJobSaved(
  userId: string,
  jobId: string
): Promise<boolean> {
  const response = await fetch(
    `${BASE_URL}/saved-jobs?userId=${userId}&jobId=${jobId}`,
    { cache: "no-store" }
  )

  if (!response.ok) {
    return false
  }

  const savedJobs = (await response.json()) as SavedJob[]
  return savedJobs.length > 0
}

export async function addSavedJob(
  job: JobPost,
  user: ApplicationUser
): Promise<SavedJobResult> {
  const payload: SavedJobInput & { savedAt: string } = {
    ...buildSavedJobInput(job, user),
    savedAt: new Date().toISOString(),
  }

  const response = await fetch(`${BASE_URL}/saved-jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const result = (await response.json().catch(() => null)) as {
    message?: string
  } | null

  if (!response.ok) {
    return {
      success: false,
      message: result?.message || "Failed to save this job.",
      alreadySaved: response.status === 409,
    }
  }

  return { success: true, message: "Job saved." }
}

export async function removeSavedJob(
  userId: string,
  jobId: string
): Promise<SavedJobResult> {
  const response = await fetch(
    `${BASE_URL}/saved-jobs?userId=${encodeURIComponent(userId)}&jobId=${encodeURIComponent(jobId)}`,
    { method: "DELETE" }
  )

  const result = (await response.json().catch(() => null)) as {
    deletedCount?: number
  } | null

  if (!response.ok) {
    return { success: false, message: "Failed to remove this job." }
  }

  if (!result?.deletedCount) {
    return {
      success: false,
      message: "This job is no longer in your saved jobs.",
    }
  }

  return { success: true, message: "Job removed from saved jobs." }
}
