import {
  Briefcase,
  Code2,
  GraduationCap,
  HeartPulse,
  Megaphone,
  PenTool,
  Settings,
  Wallet,
  type LucideIcon,
} from "lucide-react"

import type { JobPost } from "@/lib/job"
import { cn } from "@/lib/utils"

const CATEGORY_META: Record<string, { icon: LucideIcon; className: string }> = {
  "Engineering & Tech": {
    icon: Code2,
    className: "text-sky-500 dark:text-sky-400",
  },

  "Design & Creative": {
    icon: PenTool,
    className: "text-orange-500 dark:text-orange-400",
  },

  "Marketing & Sales": {
    icon: Megaphone,
    className: "text-fuchsia-500 dark:text-fuchsia-400",
  },

  "Finance & Accounting": {
    icon: Wallet,
    className: "text-emerald-500 dark:text-emerald-400",
  },

  "Operations & Support": {
    icon: Settings,
    className: "text-indigo-500 dark:text-indigo-400",
  },

  Healthcare: {
    icon: HeartPulse,
    className: "text-rose-500 dark:text-rose-400",
  },

  Education: {
    icon: GraduationCap,
    className: "text-amber-500 dark:text-amber-400",
  },
}

const DEFAULT_CATEGORY_META: {
  icon: LucideIcon
  className: string
} = {
  icon: Briefcase,
  className: "text-indigo-500 dark:text-indigo-400",
}

export function JobIdentity({
  job,
  className,
  titleClassName = "truncate text-sm font-medium",
}: {
  job: Pick<JobPost, "title" | "category">
  className?: string
  titleClassName?: string
}) {
  const meta = CATEGORY_META[job.category] ?? DEFAULT_CATEGORY_META
  const CategoryIcon = meta.icon

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/60",
          meta.className
        )}
      >
        <CategoryIcon className="size-4" />
      </div>

      <div className="min-w-0">
        <p className={titleClassName}>{job.title}</p>

        <p className={cn("text-xs", meta.className)}>{job.category}</p>
      </div>
    </div>
  )
}
