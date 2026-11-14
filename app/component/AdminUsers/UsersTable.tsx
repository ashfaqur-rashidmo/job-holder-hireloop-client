"use client"

import { ApplicantAvatar } from "@/app/component/RecruiterApplications/ApplicantAvatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { PlatformUser, UserRole } from "@/lib/user"
import { cn } from "@/lib/utils"

import { UserRoleBadge } from "./UserRoleBadge"
import { UserRoleSelect } from "./UserRoleSelect"

type UsersTableProps = {
  users: PlatformUser[]
  onRoleChange: (user: PlatformUser, role: UserRole) => void
  className?: string
}

const headClass = "h-11 px-4 text-xs font-medium"
const cellClass = "px-4 text-[13px]"

/** Short date, e.g. "Nov 6, 2026". */
export function formatJoinDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "—"
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}

/** Desktop table listing every registered user. */
export function UsersTable({
  users,
  onRoleChange,
  className,
}: UsersTableProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs",
        className
      )}
    >
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-transparent">
            <TableHead className={cn(headClass, "w-[30%]")}>User</TableHead>

            <TableHead className={cn(headClass, "w-[12%]")}>Role</TableHead>

            <TableHead className={cn(headClass, "w-[10%]")}>Premium</TableHead>

            <TableHead className={cn(headClass, "w-[12%]")}>Verified</TableHead>

            <TableHead className={cn(headClass, "w-[14%]")}>Joined</TableHead>

            <TableHead className={cn(headClass, "text-right")}>
              Change Role
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="h-16 hover:bg-muted/30">
              <TableCell className={cn(cellClass, "pl-6")}>
                <div className="flex items-center gap-3">
                  <ApplicantAvatar name={user.name} />

                  <div className="min-w-0">
                    <p className="truncate text-[13px] leading-5 font-medium">
                      {user.name || "Unnamed user"}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell className={cellClass}>
                {user.role ? (
                  <UserRoleBadge role={user.role} />
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>

              <TableCell className={cellClass}>
                {user.premium ? (
                  <span className="inline-flex h-[22px] items-center rounded-[4px] border border-violet-500/30 bg-violet-500/10 px-2 text-xs font-medium text-violet-700 dark:text-violet-300">
                    Premium
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">Free</span>
                )}
              </TableCell>

              <TableCell className={cn(cellClass, "text-muted-foreground")}>
                {user.emailVerified ? "Yes" : "No"}
              </TableCell>

              <TableCell className={cn(cellClass, "text-muted-foreground")}>
                {formatJoinDate(user.createdAt)}
              </TableCell>

              <TableCell className={cn(cellClass, "text-right")}>
                <UserRoleSelect
                  name={user.name || user.email}
                  value={user.role}
                  onRoleChange={(role) => onRoleChange(user, role)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
