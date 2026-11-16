import { headers } from "next/headers"
import Link from "next/link"

import { AdminJobsView } from "@/app/component/AdminJobs/AdminJobsView"
import { buttonVariants } from "@/components/ui/button"
import { getJobs } from "@/lib/api/jobs"
import { auth } from "@/lib/auth"
import type { JobPost } from "@/lib/job"

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export default async function AdminJobsPage() {
  // Only admins can open the Manage Jobs page.
  const session = await auth.api.getSession({ headers: await headers() })

  if (session?.user?.role !== "admin") {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
        <p className="text-sm text-destructive">
          Only admins can view this page.
        </p>

        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Back to Home
        </Link>
      </div>
    )
  }

  let jobs: JobPost[] = []
  let totalApplications = 0

  try {
    jobs = await getJobs()
  } catch (error) {
    console.error("Failed to load jobs:", error)
  }

  // Total applications across the platform (count endpoint, no filter).
  try {
    const res = await fetch(`${baseURL}/applications/count`)
    const data = (await res.json()) as { count?: number }
    totalApplications = typeof data.count === "number" ? data.count : 0
  } catch (error) {
    console.error("Failed to load application count:", error)
  }

  return <AdminJobsView jobs={jobs} totalApplications={totalApplications} />
}
