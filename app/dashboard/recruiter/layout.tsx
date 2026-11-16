import type React from "react"

import { getSession } from "@/lib/core/server"
import { redirect } from "next/navigation"

export default async function RecruiterDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Recruiters own these pages, but admins may also enter them (e.g. to
  // create a job post from the admin "Manage Jobs" page).
  const session = await getSession()

  if (session?.user?.role !== "recruiter" && session?.user?.role !== "admin") {
    redirect("/unauthorized")
  }

  return <>{children}</>
}
