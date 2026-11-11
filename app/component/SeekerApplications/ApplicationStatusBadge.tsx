import {
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
} from "@/lib/application"
import { cn } from "@/lib/utils"

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Applied:
    "border-border bg-muted/60 text-muted-foreground dark:border-white/10 dark:bg-white/[0.06]",
  "Under Review":
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  Shortlisted: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400",
  Rejected: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400",
  Offered:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
}

export function ApplicationStatusBadge({
  status = "Applied",
  className,
}: {
  status?: ApplicationStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex h-[22px] items-center rounded-[4px] border px-2 text-xs font-medium",
        STATUS_STYLES[status] ?? STATUS_STYLES.Applied,
        className
      )}
    >
      {APPLICATION_STATUS_LABELS[status] ?? status}
    </span>
  )
}
