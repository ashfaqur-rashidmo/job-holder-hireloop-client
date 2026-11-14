"use client"

import { ChevronDown } from "lucide-react"

import { USER_ROLES, USER_ROLE_LABELS, type UserRole } from "@/lib/user"
import { cn } from "@/lib/utils"

/**
 * Compact role switcher shown on every user row.
 * Selecting a role calls onRoleChange — the parent decides what to do
 * (the actual update is not implemented yet).
 */
export function UserRoleSelect({
  name,
  value,
  onRoleChange,
  disabled = false,
  className,
}: {
  name: string
  value: UserRole | null
  onRoleChange: (role: UserRole) => void
  disabled?: boolean
  className?: string
}) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onRoleChange(event.target.value as UserRole)
  }

  return (
    <div className={cn("relative", className)}>
      <select
        value={value ?? ""}
        onChange={handleChange}
        disabled={disabled}
        aria-label={`Change role for ${name}`}
        className="h-8 w-[120px] appearance-none rounded-lg border border-border/60 bg-muted/30 pr-8 pl-2.5 text-xs shadow-none outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50"
      >
        <option value="" disabled className="bg-background text-foreground">
          No role
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

      <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}
