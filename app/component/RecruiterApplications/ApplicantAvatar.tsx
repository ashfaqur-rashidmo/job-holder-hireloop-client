import { cn } from "@/lib/utils"

/** Round initials avatar for an applicant (e.g. "Jhonny Sarker" → "JS"). */
export function ApplicantAvatar({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-semibold text-indigo-600 dark:text-indigo-300",
        className
      )}
    >
      {initials || "?"}
    </span>
  )
}
