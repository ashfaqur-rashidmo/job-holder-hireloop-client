"use client"

import { JOB_TYPES, type JobType } from "@/lib/job"

import { FilterRadio } from "./FilterRadio"

type JobFiltersProps = {
  categories: string[]
  jobTypeCounts: Record<JobType, number>
  categoryCounts: Record<string, number>
  selectedJobType?: string
  selectedCategory?: string
}

export function JobFilters({
  categories,
  jobTypeCounts,
  categoryCounts,
  selectedJobType,
  selectedCategory,
}: JobFiltersProps) {
  return (
    <aside className="h-fit rounded-xl border border-white/10 bg-[#101010] p-4">
      <h2 className="text-sm font-semibold text-white">Filters</h2>

      <fieldset className="mt-5">
        <legend className="text-[11px] font-semibold text-white/70">
          Job Type
        </legend>

        <div className="mt-3 space-y-2.5">
          {JOB_TYPES.map((jobType) => (
            <FilterRadio
              key={`${jobType}-${selectedJobType ?? "none"}`}
              name="jobType"
              param="jobType"
              value={jobType}
              label={jobType}
              count={jobTypeCounts[jobType]}
              defaultChecked={jobType === selectedJobType}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-5 border-t border-white/5 pt-4">
        <legend className="text-[11px] font-semibold text-white/70">
          Job Category
        </legend>

        {categories.length === 0 ? (
          <p className="mt-3 text-[11px] text-white/35">
            No categories available
          </p>
        ) : (
          <div className="mt-3 max-h-52 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent] space-y-2.5 overflow-y-auto pr-1">
            {categories.map((category) => (
              <FilterRadio
                key={`${category}-${selectedCategory ?? "none"}`}
                name="jobCategory"
                param="category"
                value={category}
                label={category}
                count={categoryCounts[category] ?? 0}
                defaultChecked={category === selectedCategory}
              />
            ))}
          </div>
        )}
      </fieldset>
    </aside>
  )
}
