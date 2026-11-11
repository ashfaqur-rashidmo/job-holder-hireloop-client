import { cn } from "@/lib/utils"

type SavedJobsStatsProps = {
  totalSaved: number
  closingSoon: number
}

export function SavedJobsStats({
  totalSaved,
  closingSoon,
}: SavedJobsStatsProps) {
  const stats = [
    { label: "Total Saved", value: totalSaved },
    {
      label: "Closing Soon",
      value: closingSoon,
      className: "text-amber-500",
    },
  ]

  return (
    <section aria-label="Saved jobs statistics">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4 xl:gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border bg-card p-5 text-card-foreground shadow-xs"
          >
            <p className="text-[13px] leading-5 text-muted-foreground">
              {stat.label}
            </p>
            <p
              className={cn(
                "mt-2 text-[26px] leading-8 font-semibold tracking-tight",
                stat.className
              )}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
