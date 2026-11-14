"use client"

import { ExternalLink } from "lucide-react"

import { ApplicantAvatar } from "@/app/component/RecruiterApplications/ApplicantAvatar"
import { ApplicationStatusBadge } from "@/app/component/SeekerApplications/ApplicationStatusBadge"
import { formatRelativeDate, type JobApplication } from "@/lib/application"

type ApplicationsCardsProps = {
  applications: JobApplication[]
  className?: string
}

/** Mobile / tablet cards for the applicants of one job post. */
export function ApplicationsCards({
  applications,
  className,
}: ApplicationsCardsProps) {
  return (
    <div className={className}>
      {applications.map((application) => (
        <article
          key={application._id ?? application.userId}
          className="rounded-xl border bg-card p-4 text-card-foreground shadow-xs"
        >
          <div className="flex items-start gap-3">
            <ApplicantAvatar name={application.userName ?? ""} />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {application.userName || "Unknown applicant"}
              </p>

              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {application.userEmail}
              </p>
            </div>

            <ApplicationStatusBadge status={application.status} />
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t pt-3 text-xs">
            <div>
              <dt className="text-muted-foreground">Work mode</dt>
              <dd className="mt-0.5 text-sm">{application.workMode}</dd>
            </div>

            <div>
              <dt className="text-muted-foreground">Applied</dt>
              <dd className="mt-0.5 text-sm">
                {formatRelativeDate(application.appliedAt)}
              </dd>
            </div>
          </dl>

          <div className="mt-3 flex items-center justify-between gap-3 border-t pt-3">
            {application.coverLetter ? (
              <p
                title={application.coverLetter}
                className="min-w-0 truncate text-xs text-muted-foreground"
              >
                {application.coverLetter}
              </p>
            ) : (
              <span className="text-xs text-muted-foreground">
                No cover letter
              </span>
            )}

            {application.resumeUrl && (
              <a
                href={application.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1 text-xs text-indigo-600 hover:underline dark:text-indigo-300"
              >
                <ExternalLink className="size-3.5" />
                Resume
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}
