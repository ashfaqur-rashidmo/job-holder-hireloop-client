"use client"

import { ExternalLink } from "lucide-react"

import { ApplicationStatusBadge } from "@/app/component/SeekerApplications/ApplicationStatusBadge"
import { ApplicantAvatar } from "@/app/component/RecruiterApplications/ApplicantAvatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatRelativeDate, type JobApplication } from "@/lib/application"
import { cn } from "@/lib/utils"

type ApplicationsTableProps = {
  applications: JobApplication[]
  className?: string
}

// Shared cell paddings so the columns stay aligned.
const headClass = "h-11 text-xs font-medium"
const cellClass = "px-4 text-[13px]"

/** Desktop table listing the applicants of one job post. */
export function ApplicationsTable({
  applications,
  className,
}: ApplicationsTableProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs",
        className
      )}
    >
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-transparent">
            <TableHead className={cn(headClass, "w-[26%] pl-6")}>
              Applicant
            </TableHead>

            <TableHead className={cn(headClass, "w-[12%]")}>
              Work Mode
            </TableHead>

            <TableHead className={cn(headClass, "w-[12%]")}>Applied</TableHead>

            <TableHead className={cn(headClass, "w-[13%]")}>Status</TableHead>

            <TableHead className={cn(headClass, "w-[12%]")}>Resume</TableHead>

            <TableHead className={cn(headClass, "pr-6")}>
              Cover Letter
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {applications.map((application) => (
            <TableRow
              key={application._id ?? application.userId}
              className="h-16 hover:bg-muted/30"
            >
              <TableCell className="pl-6">
                <div className="flex items-center gap-3">
                  <ApplicantAvatar name={application.userName ?? ""} />

                  <div className="min-w-0">
                    <p className="truncate text-[13px] leading-5 font-medium">
                      {application.userName || "Unknown applicant"}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {application.userEmail}
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell className={cn(cellClass, "text-muted-foreground")}>
                {application.workMode}
              </TableCell>

              <TableCell className={cn(cellClass, "text-muted-foreground")}>
                {formatRelativeDate(application.appliedAt)}
              </TableCell>

              <TableCell className={cellClass}>
                <ApplicationStatusBadge status={application.status} />
              </TableCell>

              <TableCell className={cellClass}>
                {application.resumeUrl ? (
                  <a
                    href={application.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-indigo-600 hover:underline dark:text-indigo-300"
                  >
                    <ExternalLink className="size-3.5" />
                    View
                  </a>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>

              <TableCell className={cn(cellClass, "pr-6")}>
                {application.coverLetter ? (
                  <p
                    title={application.coverLetter}
                    className="max-w-[220px] truncate text-muted-foreground"
                  >
                    {application.coverLetter}
                  </p>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
