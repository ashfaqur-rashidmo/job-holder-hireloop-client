import { headers } from "next/headers"
import Link from "next/link"

import { AdminUsersView } from "@/app/component/AdminUsers/AdminUsersView"
import { buttonVariants } from "@/components/ui/button"
import { getUsers } from "@/lib/api/users"
import { auth } from "@/lib/auth"
import { USER_ROLES, type PlatformUser, type UserRole } from "@/lib/user"

export default async function AdminUsersPage() {
  // Only admins can open the Manage Users page.
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

  // Load all registered users through the better-auth admin API.
  let users: PlatformUser[] = []

  try {
    const response = await getUsers()

    // The admin API returns { users, total } in current versions.
    const rows = Array.isArray(response) ? response : response.users

    users = rows.map((row) => ({
      id: row.id,
      name: row.name ?? "",
      email: row.email,
      role: USER_ROLES.includes(row.role as UserRole)
        ? (row.role as UserRole)
        : null,
      premium: row.premium === true,
      emailVerified: row.emailVerified === true,
      createdAt: new Date(row.createdAt).toISOString(),
    }))
  } catch (error) {
    console.error("Failed to load users:", error)
  }

  return <AdminUsersView users={users} />
}
