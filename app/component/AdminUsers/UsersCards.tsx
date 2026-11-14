"use client"

import { ApplicantAvatar } from "@/app/component/RecruiterApplications/ApplicantAvatar"
import type { PlatformUser, UserRole } from "@/lib/user"

import { formatJoinDate } from "./UsersTable"
import { UserRoleBadge } from "./UserRoleBadge"
import { UserRoleSelect } from "./UserRoleSelect"

type UsersCardsProps = {
  users: PlatformUser[]
  onRoleChange: (user: PlatformUser, role: UserRole) => void
  className?: string
}

/** Mobile / tablet cards listing every registered user. */
export function UsersCards({
  users,
  onRoleChange,
  className,
}: UsersCardsProps) {
  return (
    <div className={className}>
      {users.map((user) => (
        <article
          key={user.id}
          className="rounded-xl border bg-card p-4 text-card-foreground shadow-xs"
        >
          <div className="flex items-start gap-3">
            <ApplicantAvatar name={user.name} />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {user.name || "Unnamed user"}
              </p>

              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>

            {user.role && <UserRoleBadge role={user.role} />}
          </div>

          <dl className="mt-3 grid grid-cols-3 gap-x-4 gap-y-2 border-t pt-3 text-xs">
            <div>
              <dt className="text-muted-foreground">Premium</dt>
              <dd className="mt-0.5 text-sm">
                {user.premium ? "Yes" : "Free"}
              </dd>
            </div>

            <div>
              <dt className="text-muted-foreground">Verified</dt>
              <dd className="mt-0.5 text-sm">
                {user.emailVerified ? "Yes" : "No"}
              </dd>
            </div>

            <div>
              <dt className="text-muted-foreground">Joined</dt>
              <dd className="mt-0.5 text-sm">
                {formatJoinDate(user.createdAt)}
              </dd>
            </div>
          </dl>

          <div className="mt-3 border-t pt-3">
            <p className="mb-1.5 text-xs text-muted-foreground">Change role</p>

            <UserRoleSelect
              name={user.name || user.email}
              value={user.role}
              onRoleChange={(role) => onRoleChange(user, role)}
            />
          </div>
        </article>
      ))}
    </div>
  )
}
