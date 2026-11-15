"use server"

import type { JobApplication, JobApplicationInput } from "@/lib/application"
import { authFetch } from "@/lib/core/server"

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
    `${BASE_URL}/applications?applicantId=${applicantId}`,
    { cache: "no-store" }
  )

  if (!response.ok) {
    throw new Error("Failed to load applications.")
  }

  const data = (await response.json()) as JobApplication[]
  return data
}

/** Applications submitted for one job post (recruiter review view). */
export type ApplicationsByJobResult = {
  status: "ok" | "unauthorized" | "forbidden" | "error"
  applications: JobApplication[]
}

export async function getApplicationsByJob(
  jobId: string
): Promise<ApplicationsByJobResult> {
  // Authenticated: the session token lets the backend (once it verifies
  // it) scope this to the signed-in recruiter's own job posts.
  const api = `${BASE_URL}/applications?jobId=${encodeURIComponent(jobId)}`
  const response = await authFetch(api)

  // 401: not signed in / expired session. 403: signed in, but this job
  // post belongs to another recruiter (or is unowned legacy data).
  if (response.status === 401) {
    return { status: "unauthorized", applications: [] }
  }

  if (response.status === 403) {
    return { status: "forbidden", applications: [] }
  }

  if (!response.ok) {
    return { status: "error", applications: [] }
  }

  // Newest applications first.
  const data = (await response.json()) as JobApplication[]
  const applications = data.sort((a, b) =>
    (b.appliedAt ?? "").localeCompare(a.appliedAt ?? "")
  )
  return { status: "ok", applications }
}

export async function getApplicationCount(
  applicantId: string
): Promise<number> {
  const response = await fetch(
    `${BASE_URL}/applications/count?applicantId=${applicantId}`,
    { cache: "no-store" }
  )

  if (!response.ok) {
    throw new Error("Failed to load application count.")
  }

  const data = (await response.json()) as { count: number }
  return data.count
}
