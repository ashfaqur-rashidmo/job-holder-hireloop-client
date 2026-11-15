import type React from "react"

import { requireRole } from "@/lib/core/server"

export default async function SeekerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRole("seeker")

  return <>{children}</>
}
