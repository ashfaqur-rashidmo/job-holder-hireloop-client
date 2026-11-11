"use client"

import { ChevronDown } from "lucide-react"

const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "oldest", label: "Oldest" },
  { value: "salary", label: "Salary: High to Low" },
]

type SortSelectProps = {
  onChange?: (value: string) => void
}

export function SortSelect({ onChange }: SortSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-white/35">Sort By:</span>

      <div className="relative">
        <select
          defaultValue="recent"
          onChange={(event) => onChange?.(event.target.value)}
          aria-label="Sort jobs by"
          className="h-8 appearance-none rounded-md border border-white/10 bg-[#101010] pr-7 pl-3 text-[11px] font-medium text-white/80 transition-colors outline-none hover:border-white/20 focus-visible:border-indigo-500/60 focus-visible:ring-2 focus-visible:ring-indigo-500/30"
        >
          {SORT_OPTIONS.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-[#101010] text-white"
            >
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-white/40" />
      </div>
    </div>
  )
}
