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

import { cn } from "@/lib/utils"

type CategoryMeta = {
  icon: LucideIcon
  className: string
}

const CATEGORY_META: Record<string, CategoryMeta> = {
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

const DEFAULT_CATEGORY_META: CategoryMeta = {
  icon: Briefcase,
  className: "text-indigo-500 dark:text-indigo-400",
}

export function getCategoryMeta(category: string) {
  return CATEGORY_META[category] ?? DEFAULT_CATEGORY_META
}

export function JobCategoryIcon({
  category,
  className,
  iconClassName,
}: {
  category: string
  className?: string
  iconClassName?: string
}) {
  const meta = getCategoryMeta(category)
  const Icon = meta.icon

  return (
    <span
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/60",
        meta.className,
        className
      )}
    >
      <Icon className={cn("size-4", iconClassName)} />
    </span>
  )
}
