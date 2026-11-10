"use client"

import type { ChangeEvent } from "react"

import { Check } from "lucide-react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"

type FilterRadioProps = {
  name: string
  param: string
  value: string
  label: string
  count?: number
  defaultChecked?: boolean
}

export function FilterRadio({
  name,
  param,
  value,
  label,
  count,
  defaultChecked,
}: FilterRadioProps) {
  const router = useRouter()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(window.location.search)
    params.set(param, event.target.value)

    router.push(`/browse-jobs?${params.toString()}`, { scroll: false })
  }

  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-2.5 text-[11px] text-white/65 transition-colors hover:text-white",
        "has-[:checked]:text-white"
      )}
    >
      <span className="relative flex size-3.5 shrink-0 items-center justify-center">
        <input
          type="radio"
          name={name}
          value={value}
          defaultChecked={defaultChecked}
          onChange={handleChange}
          className="peer size-3.5 cursor-pointer appearance-none rounded-[3px] border border-white/20 bg-white/5 transition-colors checked:border-white checked:bg-white focus-visible:ring-2 focus-visible:ring-indigo-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101010] focus-visible:outline-none"
        />

        <Check
          className="pointer-events-none absolute top-1/2 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 text-black opacity-0 peer-checked:opacity-100"
          strokeWidth={3}
        />
      </span>

      <span className="min-w-0 truncate" title={label}>
        {label}
      </span>

      {typeof count === "number" && (
        <span className="ml-auto text-[10px] text-white/35 tabular-nums">
          {formatCompactCount(count)}
        </span>
      )}
    </label>
  )
}

function formatCompactCount(count: number) {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`
  }

  return String(count)
}
