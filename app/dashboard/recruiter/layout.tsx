import type React from "react"

import { requireRole } from "@/lib/core/server"

export default async function RecruiterDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRole("recruiter")

  return <>{children}</>
}
