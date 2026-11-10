import Image from "next/image"
import Link from "next/link"
import { MapPin } from "lucide-react"

import { JobCategoryIcon } from "@/app/component/RecruiterJobs/JobCategoryIcon"
import type { JobPost } from "@/lib/job"

import { formatJobLocation } from "../../../lib/jobDetailsData/job-details-data"

type CompanyOverviewProps = {
  job: JobPost
}

export function CompanyOverview({ job }: CompanyOverviewProps) {
  const companyJobsHref = `/browse-jobs?search=${encodeURIComponent(job.company)}`

  return (
    <aside className="border border-white/[0.07] bg-[#141418] p-6">
      <h2 className="text-[22px] leading-7 font-medium text-[#EDEDEF]">
        Company Overview
      </h2>

      <div className="mt-6 flex items-center gap-3">
        <JobCategoryIcon
          category={job.category}
          className="size-12 rounded-lg border border-white/[0.07] bg-[#1A1A1F]"
          iconClassName="size-5"
        />

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-[#EDEDEF]">
            {job.company}
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-[#A0A0AB]">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">{formatJobLocation(job)}</span>
          </p>
        </div>
      </div>

      <div className="relative mt-4 h-[240px] overflow-hidden rounded-xl border border-white/[0.07] xl:aspect-[347/204] xl:h-auto">
        <Image
          src="/images/company-office.png"
          alt=""
          fill
          sizes="(min-width: 1280px) 397px, 100vw"
          className="object-fill"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141418]/80 via-transparent to-transparent" />
      </div>

      <dl className="mt-6 divide-y divide-white/[0.07]">
        <div className="flex items-center justify-between gap-4 py-3.5">
          <dt className="text-[13px] text-[#A0A0AB] uppercase">Size</dt>
          <dd className="text-right text-base text-[#EDEDEF]">Not specified</dd>
        </div>
        <div className="flex items-center justify-between gap-4 py-3.5">
          <dt className="text-[13px] text-[#A0A0AB] uppercase">Industry</dt>
          <dd className="text-right text-base text-[#EDEDEF]">
            {job.category || "Not specified"}
          </dd>
        </div>
      </dl>

      <Link
        href={companyJobsHref}
        className="mt-6 flex h-11 w-full items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.04] text-[13px] text-[#EDEDEF] transition-colors hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
      >
        View Company Jobs
      </Link>
    </aside>
  )
}
