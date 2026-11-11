import { headers } from "next/headers"

import { SavedJobsStats } from "@/app/component/SeekerSavedJobs/SavedJobsStats"
import { SavedJobsTable } from "@/app/component/SeekerSavedJobs/SavedJobsTable"
import { UploadResumeButton } from "@/app/component/SeekerSavedJobs/UploadResumeButton"
import { getSavedJobs } from "@/lib/actions/saved-jobs"
import { auth } from "@/lib/auth"
import { isClosingSoon } from "@/lib/saved-job"

export default async function SeekerSavedJobsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const savedJobs = session?.user?.id ? await getSavedJobs(session.user.id) : []

  const stats = {
    totalSaved: savedJobs.length,
    closingSoon: savedJobs.filter((job) => isClosingSoon(job.deadline)).length,
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-2xl leading-7 font-semibold tracking-tight">
            Saved Jobs
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your bookmarked jobs are kept here so you can apply any time.
          </p>
        </div>

        <div className="flex items-center gap-3 print:hidden">
          <UploadResumeButton />
        </div>
      </header>

      <SavedJobsStats {...stats} />

      <SavedJobsTable savedJobs={savedJobs} />
    </div>
  )
}
