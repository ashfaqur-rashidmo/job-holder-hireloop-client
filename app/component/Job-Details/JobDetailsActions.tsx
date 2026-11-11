"use client"

import * as React from "react"
import { Bookmark, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { JobPost } from "@/lib/job"
import { applyForJob } from "@/lib/actions/applications"
import {
  addSavedJob,
  isJobSaved,
  removeSavedJob,
} from "@/lib/actions/saved-jobs"
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
  const [isTogglingSaved, setIsTogglingSaved] = React.useState(false)

  const { data: session, isPending: isSessionPending } = useSession()
  const [isApplying, setIsApplying] = React.useState(false)
  const user = session?.user

  // Restore the saved state for signed-in users.
  React.useEffect(() => {
    if (!user) {
      return
    }

    let cancelled = false

    isJobSaved(user.id, job._id).then((exists) => {
      if (!cancelled) {
        setSaved(exists)
      }
    })

    return () => {
      cancelled = true
    }
  }, [user, job._id])

  const handleToggleSaved = async () => {
    if (isTogglingSaved) {
      return
    }

    if (!user) {
      router.push(`/sign-in?redirectTo=/browse-jobs/${job._id}`)
      return
    }

    setIsTogglingSaved(true)

    try {
      if (saved) {
        const result = await removeSavedJob(user.id, job._id)

        if (!result.success) {
          toast.error(result.message)
          return
        }

        setSaved(false)
        toast.success("Job removed from saved jobs")
      } else {
        const result = await addSavedJob(job, {
          id: user.id,
          email: user.email,
          name: user.name,
        })

        if (!result.success && !result.alreadySaved) {
          toast.error(result.message)
          return
        }

        setSaved(true)
        toast.success(
          result.alreadySaved
            ? "Job is already in your saved jobs"
            : "Job saved"
        )
      }
    } catch {
      toast.error("Something went wrong while updating saved jobs.")
    } finally {
      setIsTogglingSaved(false)
    }
  }

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
        onClick={handleToggleSaved}
        disabled={isTogglingSaved}
        aria-busy={isTogglingSaved}
        className={cn(
          "inline-flex size-12 items-center justify-center border border-white/[0.07] bg-[#222228] text-[#E5E2E3] transition-colors hover:bg-[#2A2A31] focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60",
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
