import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { getJob, getJobs } from "@/lib/api/jobs"
import { getJobStatus } from "@/lib/job"

import { JobCard } from "../../component/BrowseJobs/JobCard"

import { getJobDescription } from "../../../lib/jobDetailsData/job-details-data"
import { JobDetailsStats } from "@/app/component/Job-Details/JobDetailsStats"
import { JobDescriptionSections } from "@/app/component/Job-Details/JobDescriptionSections"
import { CompanyOverview } from "@/app/component/Job-Details/CompanyOverview"
import { JobDetailsHeader } from "@/app/component/Job-Details/JobDetailsHeader"

type JobDetailsPageProps = {
  params: Promise<{ id: string }>
}


export async function generateMetadata({
  params,
}: JobDetailsPageProps): Promise<Metadata> {
  const { id } = await params
  const job = await getJob(id)

  if (!job) {
    return { title: "Job not found" }
  }

  return {
    title: `${job.title} at ${job.company}`,
    description: getJobDescription(job),
  }
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { id } = await params
  const job = await getJob(id)

  if (!job) {
    notFound()
  }

  const status = getJobStatus(job)
  const relatedJobs = await getJobs(
    `category=${encodeURIComponent(job.category)}`
  ).catch(() => [])
  const similarJobs = relatedJobs
    .filter((relatedJob) => relatedJob._id !== job._id)
    .slice(0, 3)

  return (
    <main className="min-h-screen bg-[#08080A] px-4 pt-20 pb-16 text-[#EDEDEF] sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1240px]">
        <JobDetailsHeader job={job} status={status} />

        <div className="mt-6 grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_397px]">
          <div className="min-w-0 space-y-6">
            <JobDetailsStats job={job} />
            <JobDescriptionSections job={job} />
          </div>

          <CompanyOverview job={job} />
        </div>

        {similarJobs.length > 0 && (
          <section className="mt-12">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[13px] font-medium tracking-wide text-[#8E9192] uppercase">
                  More opportunities
                </p>
                <h2 className="mt-2 text-[22px] leading-7 font-medium text-[#EDEDEF]">
                  Similar Jobs
                </h2>
              </div>

              <Link
                href={`/browse-jobs?category=${(job.category)}`}
                className="inline-flex items-center gap-1.5 text-sm text-[#A0A0AB] transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
              >
                View all
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {similarJobs.map((similarJob) => (
                <JobCard key={similarJob._id} job={similarJob} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
