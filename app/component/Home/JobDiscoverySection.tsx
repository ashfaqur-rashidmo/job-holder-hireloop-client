import Link from "next/link"
import { ArrowRight, BriefcaseBusiness, MapPin, Wallet } from "lucide-react"

import { getJobs } from "@/lib/api/jobs"
import { formatJobSalary, type JobPost } from "@/lib/job"

// Newest first: the backend returns insertion order and ObjectId hex
// values grow over time, so sorting by _id descending approximates
// "most recently posted" without a backend change.
const FEATURED_JOB_LIMIT = 6

export default async function JobDiscoverySection() {
  let featuredJobs: JobPost[] = []

  try {
    const jobs = await getJobs()
    featuredJobs = [...jobs]
      .sort((a, b) => (a._id < b._id ? 1 : -1))
      .slice(0, FEATURED_JOB_LIMIT)
  } catch {
    // Backend unreachable — hide the section instead of breaking the page.
    return null
  }

  if (featuredJobs.length === 0) {
    return null
  }

  return (
    <section className="bg-[#050505] py-20 text-white sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-2">
          <span aria-hidden="true" className="size-1.5 rounded-[2px] bg-indigo-500" />
          <span className="text-[11px] font-bold tracking-[0.2em] text-indigo-300 uppercase">
            Smart Job Discovery
          </span>
          <span aria-hidden="true" className="size-1.5 rounded-[2px] bg-indigo-500" />
        </div>

        {/* Heading */}
        <h2 className="mx-auto mt-4 max-w-2xl text-center text-4xl font-bold tracking-tight sm:text-5xl">
          The roles you&apos;d never find by searching
        </h2>

        {/* Cards */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredJobs.map((job) => (
            <JobDiscoveryCard key={job._id} job={job} />
          ))}
        </div>

        {/* View all */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/browse-jobs"
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-white/90"
          >
            View all job openings
          </Link>
        </div>
      </div>
    </section>
  )
}

function JobDiscoveryCard({ job }: { job: JobPost }) {
  const salary = formatJobSalary(job)
  const description =
    job.description?.trim() ||
    "View the full role details and apply directly from the job page."

  return (
    <Link href={`/browse-jobs/${job._id}`} className="no-underline">
      <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#111111] p-6 transition-colors hover:border-white/25">
        <h3 className="text-xl font-semibold text-white">{job.title}</h3>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/50">
          {description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <DiscoveryBadge icon={MapPin} label={job.location || "Remote"} />
          {job.jobType && <DiscoveryBadge icon={BriefcaseBusiness} label={job.jobType} />}
          {salary !== "—" && <DiscoveryBadge icon={Wallet} label={salary} />}
        </div>

        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-white transition-colors group-hover:text-indigo-300">
          Apply Now
          <ArrowRight className="size-4" aria-hidden="true" />
        </span>
      </article>
    </Link>
  )
}

function DiscoveryBadge({
  icon: Icon,
  label,
}: {
  icon: React.ElementType
  label: string
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-white/55">
      <Icon className="size-3.5 text-indigo-400" aria-hidden="true" />
      {label}
    </span>
  )
}
