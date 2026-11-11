"use client"

import * as React from "react"
import Link from "next/link"
import {
  Bookmark,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
} from "lucide-react"
import { toast } from "sonner"

import { JobCategoryIcon } from "@/app/component/RecruiterJobs/JobCategoryIcon"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { removeSavedJob } from "@/lib/actions/saved-jobs"
import { formatRelativeDate } from "@/lib/application"
import { formatJobSalary } from "@/lib/job"
import { getDaysUntilDeadline, type SavedJob } from "@/lib/saved-job"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 5

type SavedJobsTableProps = {
  savedJobs: SavedJob[]
}

type SavedJobsSort =
  "recently-saved" | "oldest-saved" | "closing-soon" | "title"

const SORT_OPTIONS: { value: SavedJobsSort; label: string }[] = [
  { value: "recently-saved", label: "Recently Saved" },
  { value: "oldest-saved", label: "Oldest Saved" },
  { value: "closing-soon", label: "Closing Soon" },
  { value: "title", label: "Job Title A–Z" },
]

export function SavedJobsTable({
  savedJobs: initialJobs,
}: SavedJobsTableProps) {
  const [savedJobs, setSavedJobs] = React.useState(initialJobs)
  const [removingJobId, setRemovingJobId] = React.useState<string | null>(null)
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState("")
  const [category, setCategory] = React.useState("all")
  const [sort, setSort] = React.useState<SavedJobsSort>("recently-saved")

  // Category pills: "All Saved" plus every category in the saved list.
  const categories = React.useMemo(() => {
    const unique = Array.from(
      new Set(
        savedJobs
          .map((job) => job.jobCategory)
          .filter((value): value is string => Boolean(value))
      )
    )
    return unique.sort((a, b) => a.localeCompare(b))
  }, [savedJobs])

  const filteredJobs = React.useMemo(() => {
    const query = search.trim().toLowerCase()

    const jobs = savedJobs.filter((job) => {
      const matchesSearch =
        !query ||
        [job.jobTitle, job.companyName, job.location].some((value) =>
          value?.toLowerCase().includes(query)
        )
      const matchesCategory = category === "all" || job.jobCategory === category

      return matchesSearch && matchesCategory
    })

    // "Closing Soon" puts the soonest open deadline first; expired or
    // missing deadlines go last.
    const deadlineTime = (deadline: string) => {
      const daysLeft = getDaysUntilDeadline(deadline)

      if (daysLeft === null || daysLeft < 0) {
        return Number.POSITIVE_INFINITY
      }

      return new Date(`${deadline}T23:59:59`).getTime()
    }

    return jobs.sort((a, b) => {
      switch (sort) {
        case "oldest-saved":
          return new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime()
        case "closing-soon":
          return deadlineTime(a.deadline) - deadlineTime(b.deadline)
        case "title":
          return (a.jobTitle ?? "").localeCompare(b.jobTitle ?? "")
        default:
          return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
      }
    })
  }, [savedJobs, search, category, sort])

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const pageJobs = filteredJobs.slice(start, start + PAGE_SIZE)

  const goToPage = (nextPage: number) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages))
  }

  const changeFilter = (updater: () => void) => {
    updater()
    setPage(1)
  }

  const handleRemove = async (savedJob: SavedJob) => {
    if (removingJobId) {
      return
    }

    setRemovingJobId(savedJob.jobId)

    try {
      const result = await removeSavedJob(savedJob.userId, savedJob.jobId)

      if (!result.success) {
        toast.error(result.message)
        return
      }

      setSavedJobs((jobs) => jobs.filter((job) => job.jobId !== savedJob.jobId))
      toast.success("Job removed from saved jobs")
    } catch {
      toast.error("Something went wrong while removing the job.")
    } finally {
      setRemovingJobId(null)
    }
  }

  return (
    <section
      aria-label="Saved jobs"
      className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs"
    >
      {savedJobs.length === 0 ? (
        <EmptySavedJobsState />
      ) : filteredJobs.length === 0 ? (
        <NoMatchesState
          onClearFilters={() =>
            changeFilter(() => {
              setSearch("")
              setCategory("all")
            })
          }
        />
      ) : (
        <>
          <SavedJobsToolbar
            search={search}
            onSearchChange={(value) => changeFilter(() => setSearch(value))}
            categories={categories}
            category={category}
            onCategoryChange={(value) => changeFilter(() => setCategory(value))}
            sort={sort}
            onSortChange={(value) =>
              changeFilter(() => setSort(value as SavedJobsSort))
            }
          />

          <div className="hidden lg:block">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-11 w-[30%] pl-6 text-xs font-medium">
                    Job Title
                  </TableHead>
                  <TableHead className="h-11 w-[18%] px-4 text-xs font-medium">
                    Company
                  </TableHead>
                  <TableHead className="h-11 w-[16%] px-4 text-xs font-medium">
                    Location
                  </TableHead>
                  <TableHead className="h-11 w-[14%] px-4 text-xs font-medium">
                    Salary
                  </TableHead>
                  <TableHead className="h-11 w-[12%] px-4 text-xs font-medium">
                    Saved
                  </TableHead>
                  <TableHead className="h-11 pr-6 pl-4 text-right text-xs font-medium">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pageJobs.map((savedJob) => (
                  <TableRow
                    key={savedJob._id ?? savedJob.jobId}
                    className="h-16 hover:bg-muted/30"
                  >
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-4">
                        <JobCategoryIcon
                          category={savedJob.jobCategory ?? ""}
                          className="size-8 rounded-[4px]"
                          iconClassName="size-4"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-[13px] leading-5 font-medium">
                            {savedJob.jobTitle}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {[savedJob.jobType, savedJob.workMode]
                              .filter(Boolean)
                              .join(" • ")}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-4 text-[13px]">
                      {savedJob.companyName}
                    </TableCell>

                    <TableCell className="px-4 text-[13px] text-muted-foreground">
                      {savedJob.location || "—"}
                    </TableCell>

                    <TableCell className="px-4 text-[13px]">
                      {formatJobSalary(savedJob)}
                    </TableCell>

                    <TableCell className="px-4 text-[13px] text-muted-foreground">
                      {formatRelativeDate(savedJob.savedAt)}
                    </TableCell>

                    <TableCell className="pr-6 pl-4 text-right">
                      <RowActions
                        savedJob={savedJob}
                        removing={removingJobId === savedJob.jobId}
                        disabled={Boolean(removingJobId)}
                        onRemove={() => handleRemove(savedJob)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="divide-y lg:hidden">
            {pageJobs.map((savedJob) => (
              <article key={savedJob._id ?? savedJob.jobId} className="p-4">
                <div className="flex items-start gap-3">
                  <JobCategoryIcon
                    category={savedJob.jobCategory ?? ""}
                    className="size-9 rounded-[4px]"
                    iconClassName="size-4"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate text-sm font-medium">
                          {savedJob.jobTitle}
                        </h2>
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {[savedJob.jobType, savedJob.workMode]
                            .filter(Boolean)
                            .join(" • ")}
                        </p>
                      </div>
                      <span className="shrink-0 text-[13px] font-medium">
                        {formatJobSalary(savedJob)}
                      </span>
                    </div>

                    <p className="mt-2 truncate text-[13px] text-muted-foreground">
                      {savedJob.companyName}
                      {savedJob.location ? ` • ${savedJob.location}` : ""}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs text-muted-foreground">
                        Saved {formatRelativeDate(savedJob.savedAt)}
                      </span>
                      <RowActions
                        savedJob={savedJob}
                        removing={removingJobId === savedJob.jobId}
                        disabled={Boolean(removingJobId)}
                        onRemove={() => handleRemove(savedJob)}
                      />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="flex flex-col gap-3 border-t bg-muted/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-[13px] text-muted-foreground">
              Showing {filteredJobs.length === 0 ? 0 : start + 1}–
              {Math.min(start + PAGE_SIZE, filteredJobs.length)} of{" "}
              {filteredJobs.length} saved jobs
            </p>

            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </div>
        </>
      )}
    </section>
  )
}

function EmptySavedJobsState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Bookmark className="size-5" />
      </span>
      <h2 className="mt-4 text-base font-semibold">No saved jobs yet</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Bookmark jobs while browsing and they will show up here so you can apply
        later.
      </p>
      <Link
        href="/browse-jobs"
        className={cn(buttonVariants({ className: "mt-5 h-9 px-4" }))}
      >
        Browse jobs
      </Link>
    </div>
  )
}

function NoMatchesState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Search className="size-5" />
      </span>
      <h2 className="mt-4 text-base font-semibold">No saved jobs found</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        No saved jobs match your search or category. Try different filters.
      </p>
      <button
        type="button"
        onClick={onClearFilters}
        className={cn(buttonVariants({ className: "mt-5 h-9 px-4" }))}
      >
        Clear filters
      </button>
    </div>
  )
}

function SavedJobsToolbar({
  search,
  onSearchChange,
  categories,
  category,
  onCategoryChange,
  sort,
  onSortChange,
}: {
  search: string
  onSearchChange: (value: string) => void
  categories: string[]
  category: string
  onCategoryChange: (value: string) => void
  sort: SavedJobsSort
  onSortChange: (value: string) => void
}) {
  const pills = [
    { value: "all", label: "All Saved" },
    ...categories.map((value) => ({ value, label: value })),
  ]

  return (
    <div className="flex flex-col gap-3 border-b bg-muted/20 p-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
      <div
        role="tablist"
        aria-label="Filter saved jobs by category"
        className="flex flex-wrap gap-2"
      >
        {pills.map((pill) => (
          <button
            key={pill.value}
            type="button"
            role="tab"
            aria-selected={category === pill.value}
            onClick={() => onCategoryChange(pill.value)}
            className={cn(
              "inline-flex h-8 items-center justify-center rounded-full border px-3.5 text-xs font-medium transition-colors",
              category === pill.value
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {pill.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search saved jobs..."
            aria-label="Search saved jobs"
            className="h-8 w-full rounded-md pl-8 text-xs sm:w-52"
          />
        </div>

        <div className="relative">
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
            aria-label="Sort saved jobs by"
            className="h-8 w-full appearance-none rounded-md border border-border bg-background pr-7 pl-3 text-xs font-medium text-foreground transition-colors outline-none hover:bg-muted focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 sm:w-auto"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>
    </div>
  )
}

function RowActions({
  savedJob,
  removing,
  disabled,
  onRemove,
}: {
  savedJob: SavedJob
  removing: boolean
  disabled: boolean
  onRemove: () => void
}) {
  return (
    <div className="inline-flex items-center justify-end gap-4">
      <Link
        href={
          savedJob.jobId ? `/browse-jobs/${savedJob.jobId}` : "/browse-jobs"
        }
        className="text-[13px] font-medium text-foreground underline-offset-4 hover:underline"
      >
        Apply
      </Link>
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        aria-busy={removing}
        className={cn(
          "inline-flex items-center gap-1.5 text-[13px] font-medium text-red-500 underline-offset-4 hover:underline disabled:pointer-events-none disabled:opacity-60"
        )}
      >
        {removing && <Loader2 className="size-3.5 animate-spin" />}
        Remove
      </button>
    </div>
  )
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav
      aria-label="Saved jobs pagination"
      className="flex items-center justify-end gap-2"
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="inline-flex size-8 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="size-4" />
      </button>

      {pages.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          onClick={() => onPageChange(pageNumber)}
          aria-label={`Page ${pageNumber}`}
          aria-current={pageNumber === page ? "page" : undefined}
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-lg border text-xs font-medium transition-colors",
            pageNumber === page
              ? "border-foreground bg-foreground text-background"
              : "bg-background text-muted-foreground hover:bg-muted"
          )}
        >
          {pageNumber}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className="inline-flex size-8 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  )
}
