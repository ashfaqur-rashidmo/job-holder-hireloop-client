import { ArrowLeft, SearchX } from "lucide-react"
import Link from "next/link"

export default function JobNotFound() {
  return (
    <main className="min-h-screen bg-[#08080A] px-4 pt-20 pb-16 text-[#EDEDEF] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center justify-center border border-white/[0.07] bg-[#141418] px-6 py-24 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-white/10">
          <SearchX className="size-7 text-[#C4C7C8]" />
        </span>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">
          Job not found
        </h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-[#A0A0AB]">
          This job may have been removed, or the link is no longer valid. Browse
          the latest open roles instead.
        </p>
        <Link
          href="/browse-jobs"
          className="mt-8 inline-flex h-11 items-center gap-2 bg-[#FAFAFA] px-6 text-sm font-medium text-[#0B0B0C] transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
        >
          <ArrowLeft className="size-4" />
          Browse jobs
        </Link>
      </div>
    </main>
  )
}
