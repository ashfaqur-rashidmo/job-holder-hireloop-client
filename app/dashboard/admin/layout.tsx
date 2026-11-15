import type React from "react"

import { requireRole } from "@/lib/core/server"

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRole("admin")

  return <>{children}</>
}
