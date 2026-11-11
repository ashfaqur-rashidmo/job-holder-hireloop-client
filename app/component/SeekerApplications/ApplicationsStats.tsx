import { cn } from "@/lib/utils"

type ApplicationStatsProps = {
  total: number
  shortlisted: number
  interviews: number
  successRate: number
}

export function ApplicationsStats({
  total,
  shortlisted,
  interviews,
  successRate,
}: ApplicationStatsProps) {
  const stats = [
    { label: "Total Applied", value: total },
    { label: "Shortlisted", value: shortlisted },
    {
      label: "Interviews",
      value: interviews,
      className: "text-amber-500",
    },
    {
      label: "Success Rate",
      value: `${successRate}%`,
      className: "text-emerald-500",
    },
  ]

  return (
    <section aria-label="Application statistics">
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
