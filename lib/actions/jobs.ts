import type { JobFormData } from "@/lib/job"

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const createJob = async (
  data: JobFormData & { recruiterId?: string; recruiterEmail?: string }
) => {
  const res = await fetch(`${baseURL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return res.json()
}

export type UpdateJobResult = {
  success: boolean
  message: string
}

export const updateJob = async (
  jobId: string,
  data: JobFormData & { recruiterId?: string; recruiterEmail?: string }
): Promise<UpdateJobResult> => {
  const res = await fetch(`${baseURL}/jobs/${jobId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  // The API returns a MongoDB UpdateResult: { acknowledged, matchedCount, ... }.
  // Normalize it so callers do not have to know the database shape.
  const data_ = (await res.json().catch(() => null)) as {
    acknowledged?: boolean
    matchedCount?: number
    message?: string
  } | null

  if (!res.ok) {
    return {
      success: false,
      message: data_?.message || "Failed to update the job post.",
    }
  }

  if (!data_?.acknowledged || data_.matchedCount === 0) {
    return {
      success: false,
      message: "Job post not found.",
    }
  }

  return {
    success: true,
    message: "Job post updated.",
  }
}

export type DeleteJobResult = {
  success: boolean
  message: string
  deletedCount: number
}

export const deleteJob = async (jobId: string): Promise<DeleteJobResult> => {
  const res = await fetch(`${baseURL}/jobs/${jobId}`, {
    method: "DELETE",
  })

  // The API returns a MongoDB DeleteResult: { acknowledged, deletedCount }.
  // Normalize it so callers do not have to know the database shape.
  const data = (await res.json().catch(() => null)) as {
    deletedCount?: number
    message?: string
  } | null

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "Failed to delete job",
      deletedCount: 0,
    }
  }

  const deletedCount =
    typeof data?.deletedCount === "number" ? data.deletedCount : 0

  if (deletedCount === 0) {
    return {
      success: false,
      message: "Job not found or already deleted.",
      deletedCount,
    }
  }

  return {
    success: true,
    message: "Job deleted",
    deletedCount,
  }
}
