import type { JobApplication, JobApplicationInput } from "@/lib/application"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export type ApplyForJobResult = {
  success: boolean
  message: string
  insertedId?: string
  alreadyApplied?: boolean
}

export type ApplyForJobPayload = JobApplicationInput & {
  appliedAt?: string
  status?: JobApplication["status"]
  archived?: boolean
  interviewDate?: string | null
}

export async function applyForJob(
  data: JobApplicationInput
): Promise<ApplyForJobResult> {
  const payload: ApplyForJobPayload = {
    ...data,
    appliedAt: new Date().toISOString(),
    status: "Applied",
    archived: false,
    interviewDate: null,
  }

  const response = await fetch(`${BASE_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const result = (await response.json().catch(() => null)) as {
    insertedId?: string
    message?: string
  } | null

  if (!response.ok) {
    return {
      success: false,
      message: result?.message || "Failed to submit your application.",
      alreadyApplied: response.status === 409,
    }
  }

  if (!result?.insertedId) {
    return {
      success: false,
      message: "The application was not saved. Please try again.",
    }
  }

  return {
    success: true,
    message: "Application submitted successfully!",
    insertedId: result.insertedId,
  }
}

export async function getApplications(
  applicantId: string
): Promise<JobApplication[]> {
  const response = await fetch(
    `${BASE_URL}/applications?applicantId=${encodeURIComponent(applicantId)}`,
    { cache: "no-store" }
  )

  if (!response.ok) {
    throw new Error("Failed to load applications.")
  }

  const data = (await response.json()) as JobApplication[]
  return data
}
