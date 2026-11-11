import { getJobs } from "@/lib/api/jobs"
import { JOB_CATEGORIES, JOB_TYPES, type JobType } from "@/lib/job"

import { JobCard } from "../component/BrowseJobs/JobCard"
import { JobFilters } from "../component/BrowseJobs/JobFilters"
import { JobSearchBar } from "../component/BrowseJobs/JobSearchBar"
import { SortSelect } from "../component/BrowseJobs/SortSelect"

type BrowseJobsSearchParams = Promise<
  Record<string, string | string[] | undefined>
>

export default async function BrowseJobsPage({
  searchParams
}: {
  searchParams: BrowseJobsSearchParams
}) {
  const params = await searchParams
  const query = new URLSearchParams()


  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      query.set(key, value)
    } else if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, item))
    }
  }

  const queryString = query.toString()
  const [jobs, allJobs] = await Promise.all([
    getJobs(queryString),
    queryString ? getJobs() : Promise.resolve(null),
  ])

  const countJobs = allJobs ?? jobs
  const defaultQuery = typeof params.search === "string" ? params.search : ""
  const selectedJobType =
    typeof params.jobType === "string" ? params.jobType : undefined
  const selectedCategory =
    typeof params.category === "string" ? params.category : undefined

  const jobTypeCounts = JOB_TYPES.reduce(
    (counts, jobType) => {
      counts[jobType] = countJobs.filter(
        (job) => job.jobType === jobType
      ).length
      return counts
    },
    {} as Record<JobType, number>
  )

  const categoryCounts = countJobs.reduce<Record<string, number>>(
    (counts, job) => {
      if (!job.category) {
        return counts
      }

      counts[job.category] = (counts[job.category] ?? 0) + 1

      return counts
    },
    {}
  )

  const jobCategories = Object.keys(categoryCounts)

  const categories =
    jobCategories.length > 0
      ? jobCategories.sort((a, b) => a.localeCompare(b))
      : [...JOB_CATEGORIES].sort((a, b) => a.localeCompare(b))

  return (
    <main className="min-h-screen bg-[#050505] px-4 pt-20 pb-16 text-white sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto w-full">
        <JobSearchBar defaultQuery={defaultQuery} />

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
          <JobFilters
            categories={categories}
            jobTypeCounts={jobTypeCounts}
            categoryCounts={categoryCounts}
            selectedJobType={selectedJobType}
            selectedCategory={selectedCategory}
          />

          <section aria-labelledby="job-results-heading">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1
                id="job-results-heading"
                className="text-lg font-semibold tracking-tight text-white"
              >
                Found {jobs.length.toLocaleString("en-US")} Professional{" "}
                {jobs.length === 1 ? "Job" : "Jobs"}
              </h1>

              <SortSelect />
            </div>

            {jobs.length === 0 ? (
              <div className="mt-5 rounded-xl border border-dashed border-white/10 bg-[#101010] p-10 text-center">
                <p className="text-sm font-medium text-white">No jobs found</p>

                <p className="mt-1 text-xs text-white/40">
                  Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
