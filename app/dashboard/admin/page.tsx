import { headers } from "next/headers"
import Link from "next/link"

import { AdminDashboardView } from "@/app/component/AdminDashboard/AdminDashboardView"
import type { AdminTransaction } from "@/app/component/AdminDashboard/AdminDashboardView"
import { buttonVariants } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { authFetch } from "@/lib/core/server"
import type { AdminStats } from "@/app/component/AdminDashboard/AdminDashboardView"

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export default async function AdminDashboardPage() {
  // Only admins can open the dashboard home.
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

  // Both endpoints are admin-protected, so the session token is sent along.
  let stats: AdminStats = {
    totalUsers: 0,
    totalRecruiters: 0,
    totalCompanies: 0,
    totalJobs: 0,
    totalRevenue: 0,
  }
  let transactions: AdminTransaction[] = []

  try {
    const res = await authFetch(`${baseURL}/admin/stats`)
    stats = (await res.json()) as AdminStats
  } catch (error) {
    console.error("Failed to load admin stats:", error)
  }

  try {
    const res = await authFetch(`${baseURL}/payments`)
    transactions = (await res.json()) as AdminTransaction[]
  } catch (error) {
    console.error("Failed to load payments:", error)
  }

  return <AdminDashboardView stats={stats} transactions={transactions} />
}
