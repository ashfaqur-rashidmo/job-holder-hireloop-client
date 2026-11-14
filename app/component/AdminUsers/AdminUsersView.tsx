"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { UpdateUserRole } from "@/lib/api/users"
import {
  USER_ROLES,
  USER_ROLE_LABELS,
  type PlatformUser,
  type UserRole,
} from "@/lib/user"

import { UsersCards } from "./UsersCards"
import { UsersTable } from "./UsersTable"

type AdminUsersViewProps = {
  users: PlatformUser[]
}

export function AdminUsersView({ users: initialUsers }: AdminUsersViewProps) {
  // Local copy of the list so role changes show up without a reload.
  const [users, setUsers] = React.useState(initialUsers)
  const [search, setSearch] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState<UserRole | "all">("all")
  const [updatingId, setUpdatingId] = React.useState<string | null>(null)

  // The role update: calls the API, updates the local list, and shows
  // a toast on success or failure.
  async function handleRoleChange(user: PlatformUser, role: UserRole) {
    if (role === user.role || updatingId) return

    setUpdatingId(user.id)

    try {
      const result = await UpdateUserRole(user.id, role)

      if (!result.success) {
        toast.error(result.message)
        return
      }

      setUsers((prevUsers) =>
        prevUsers.map((prevUser) =>
          prevUser.id === user.id ? { ...prevUser, role } : prevUser
        )
      )

      toast.success("Role updated", {
        description: `${user.name || user.email} → ${USER_ROLE_LABELS[role]}`,
      })
    } catch {
      toast.error("Failed to update the user role.")
    } finally {
      setUpdatingId(null)
    }
  }

  // Filter by email/name (search) and by role.
  const query = search.trim().toLowerCase()
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      query === "" ||
      user.email.toLowerCase().includes(query) ||
      user.name.toLowerCase().includes(query)

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  // Counts are computed from the full list, not the filtered one.
  const stats = [
    { label: "Total Users", value: users.length },
    {
      label: "Seekers",
      value: users.filter((user) => user.role === "seeker").length,
    },
    {
      label: "Recruiters",
      value: users.filter((user) => user.role === "recruiter").length,
    },
    {
      label: "Admins",
      value: users.filter((user) => user.role === "admin").length,
    },
  ]

  return (
    <div className="mx-auto w-full max-w-6xl pb-10">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Dashboard</span>
            <span aria-hidden="true">›</span>
            <span>Manage Users</span>
          </nav>

          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Manage Users
          </h1>

          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
            All registered users with role control. Use the role switcher on
            each row to promote or demote a user.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <section aria-label="User statistics" className="mt-8">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border bg-card p-5 text-card-foreground shadow-xs"
            >
              <p className="text-[13px] leading-5 text-muted-foreground">
                {stat.label}
              </p>

              <p className="mt-2 text-[26px] leading-8 font-semibold tracking-tight">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Search + role filter */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by email or name"
            className="h-10 rounded-lg border-border/60 bg-muted/30 pl-9 text-sm shadow-none focus-visible:border-indigo-500/60 focus-visible:ring-indigo-500/30"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(event) =>
            setRoleFilter(event.target.value as UserRole | "all")
          }
          aria-label="Filter by role"
          className="h-10 appearance-none rounded-lg border border-border/60 bg-muted/30 px-3 text-sm shadow-none outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/30"
        >
          <option value="all" className="bg-background text-foreground">
            All roles
          </option>
          {USER_ROLES.map((role) => (
            <option
              key={role}
              value={role}
              className="bg-background text-foreground"
            >
              {USER_ROLE_LABELS[role]}
            </option>
          ))}
        </select>
      </div>

      {/* Users list */}
      {filteredUsers.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border/60 p-12 text-center text-sm text-muted-foreground">
          {users.length === 0
            ? "No users found."
            : "No users match your search."}
        </div>
      ) : (
        <>
          <UsersTable
            users={filteredUsers}
            onRoleChange={handleRoleChange}
            className="mt-6 hidden xl:block"
          />

          <UsersCards
            users={filteredUsers}
            onRoleChange={handleRoleChange}
            className="mt-6 space-y-3 xl:hidden"
          />
        </>
      )}
    </div>
  )
}
