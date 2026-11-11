"use client"

import * as React from "react"
import { Bookmark, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { JobPost } from "@/lib/job"
import { applyForJob } from "@/lib/actions/applications"
import { buildApplicationInput } from "@/lib/application"

type JobDetailsActionsProps = {
  jobTitle: string
  expired: boolean
  job: JobPost
}

export function JobDetailsActions({
  jobTitle,
  expired,
  job,
}: JobDetailsActionsProps) {
  const router = useRouter()

  const [saved, setSaved] = React.useState(false)

  const toggleSaved = () => {
    const next = !saved
    setSaved(next)
    toast.success(next ? "Job saved" : "Job removed from saved jobs")
  }

  const { data: session, isPending: isSessionPending } = useSession()
  const [isApplying, setIsApplying] = React.useState(false)
  const user = session?.user

  const handleApplyNow = async () => {
    if (expired || isApplying) {
      return
    }

    if (!user) {
      router.push(`/sign-in?redirectTo=/browse-jobs/${job._id}`)
      return
    }

    if (user.role !== "seeker") {
      toast.error("Only job seekers can apply for jobs.")
      return
    }

    setIsApplying(true)

    try {
      const application = buildApplicationInput(job, {
        id: user.id,
        email: user.email,
        name: user.name,
      })
      const result = await applyForJob(application)

      if (!result.success) {
        toast.error(result.message)
        return
      }

      toast.success(result.message)
      router.push("/dashboard/seeker/applications")
    } catch {
      toast.error("Something went wrong while submitting your application.")
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <div className="flex shrink-0 items-center gap-3">
      <button
        type="button"
        aria-label={
          saved ? `Remove ${jobTitle} from saved jobs` : `Save ${jobTitle}`
        }
        aria-pressed={saved}
        onClick={toggleSaved}
        className={cn(
          "inline-flex size-12 items-center justify-center border border-white/[0.07] bg-[#222228] text-[#E5E2E3] transition-colors hover:bg-[#2A2A31] focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none",
          saved && "text-[#8B7CFF]"
        )}
      >
        <Bookmark className={cn("size-5", saved && "fill-current")} />
      </button>

      <button
        type="button"
        disabled={expired || isApplying || isSessionPending}
        onClick={handleApplyNow}
        aria-busy={isApplying}
        className="inline-flex h-12 items-center justify-center gap-2 bg-[#FAFAFA] px-7 text-base font-medium text-[#0B0B0C] transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
      >
        {isApplying && <Loader2 className="size-4 animate-spin" />}
        {expired
          ? "Applications Closed"
          : isApplying
            ? "Applying..."
            : "Apply Now"}
      </button>
    </div>
  )
}
