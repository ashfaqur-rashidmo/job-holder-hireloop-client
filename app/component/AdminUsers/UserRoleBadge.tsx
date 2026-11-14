import { USER_ROLE_LABELS, type UserRole } from "@/lib/user"
import { cn } from "@/lib/utils"

const ROLE_STYLES: Record<UserRole, string> = {
  seeker:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  recruiter:
    "border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  admin:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
}

/** Colored badge showing a user's role. */
export function UserRoleBadge({
  role,
  className,
}: {
  role: UserRole
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex h-[22px] items-center rounded-[4px] border px-2 text-xs font-medium",
        ROLE_STYLES[role],
        className
      )}
    >
      {USER_ROLE_LABELS[role]}
    </span>
  )
}
