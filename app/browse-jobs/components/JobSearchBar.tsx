"use client"

import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type JobSearchBarProps = {
  defaultQuery?: string
}

export function JobSearchBar({ defaultQuery = "" }: JobSearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const search = String(formData.get("search") ?? "").trim()
    const params = new URLSearchParams(searchParams.toString())

    if (search) {
      params.set("search", search)
    } else {
      params.delete("search")
    }

    const query = params.toString()

    router.push(query ? `/browse-jobs?${query}` : "/browse-jobs")
  }

  return (
    <section
      aria-label="Job search"
      className="rounded-xl border border-white/10 bg-[#101010] p-2"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-white/35"
            aria-hidden="true"
          />

          <Input
            key={defaultQuery}
            type="search"
            name="search"
            defaultValue={defaultQuery}
            placeholder="Search by job title, keywords..."
            aria-label="Search by job title or keywords"
            className="h-11 rounded-lg border-white/10 bg-[#050505] pl-10 text-sm text-white placeholder:text-white/35 focus-visible:border-indigo-500/60 focus-visible:ring-indigo-500/30"
          />
        </div>

        <Button
          type="submit"
          className="h-11 w-full shrink-0 rounded-lg bg-white px-6 text-sm font-medium text-black hover:bg-white/90 sm:w-auto"
        >
          Search Jobs
        </Button>
      </form>
    </section>
  )
}
