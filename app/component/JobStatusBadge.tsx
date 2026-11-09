import type { JobStatus } from "@/lib/job"
import { cn } from "@/lib/utils"

export function JobStatusBadge({ status }: { status: JobStatus }) {
  const isActive = status === "Active"

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        isActive
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "bg-muted text-muted-foreground"
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          isActive ? "bg-emerald-500" : "bg-muted-foreground"
        )}
      />

      {status}
    </span>
  )
}
