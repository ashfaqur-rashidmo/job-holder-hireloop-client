"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { JobCategoryIcon } from "@/app/component/RecruiterJobs/JobCategoryIcon"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  formatApplicationJobMeta,
  formatRelativeDate,
  type JobApplication,
} from "@/lib/application"
import { cn } from "@/lib/utils"

import { ApplicationStatusBadge } from "./ApplicationStatusBadge"

const PAGE_SIZE = 5

type ApplicationsTableProps = {
  applications: JobApplication[]
}

export function ApplicationsTable({ applications }: ApplicationsTableProps) {
  const [page, setPage] = React.useState(1)
  const totalPages = Math.max(1, Math.ceil(applications.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const pageApplications = applications.slice(start, start + PAGE_SIZE)

  const goToPage = (nextPage: number) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages))
  }

  return (
    <section
      aria-label="Job applications"
      className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs"
    >
      <div className="hidden lg:block">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-11 w-[32%] pl-6 text-xs font-medium">
                Job Title
              </TableHead>
              <TableHead className="h-11 w-[20%] px-4 text-xs font-medium">
                Company
              </TableHead>
              <TableHead className="h-11 w-[16%] px-4 text-xs font-medium">
                Applied
              </TableHead>
              <TableHead className="h-11 w-[18%] px-4 text-xs font-medium">
                Status
              </TableHead>
              <TableHead className="h-11 pr-6 pl-4 text-right text-xs font-medium">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {pageApplications.map((application) => (
              <TableRow
                key={
                  application._id ??
                  `${application.jobId}-${application.appliedAt}`
                }
                className="h-16 hover:bg-muted/30"
              >
                <TableCell className="pl-6">
                  <div className="flex items-center gap-4">
                    <JobCategoryIcon
                      category={application.jobCategory ?? ""}
                      className="size-8 rounded-[4px]"
                      iconClassName="size-4"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-[13px] leading-5 font-medium">
                        {application.jobTitle}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {formatApplicationJobMeta(application)}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-4 text-[13px]">
                  {application.companyName}
                </TableCell>

                <TableCell className="px-4 text-[13px] text-muted-foreground">
                  {formatRelativeDate(application.appliedAt)}
                </TableCell>

                <TableCell className="px-4">
                  <ApplicationStatusBadge status={application.status} />
                </TableCell>

                <TableCell className="pr-6 pl-4 text-right">
                  <Link
                    href={getDetailsHref(application)}
                    className="text-[13px] font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Details
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="divide-y lg:hidden">
        {pageApplications.map((application) => (
          <article
            key={
              application._id ?? `${application.jobId}-${application.appliedAt}`
            }
            className="p-4"
          >
            <div className="flex items-start gap-3">
              <JobCategoryIcon
                category={application.jobCategory ?? ""}
                className="size-9 rounded-[4px]"
                iconClassName="size-4"
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-medium">
                      {application.jobTitle}
                    </h2>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {formatApplicationJobMeta(application)}
                    </p>
                  </div>
                  <ApplicationStatusBadge
                    status={application.status}
                    className="shrink-0"
                  />
                </div>

                <p className="mt-2 truncate text-[13px] text-muted-foreground">
                  {application.companyName}
                </p>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeDate(application.appliedAt)}
                  </span>
                  <Link
                    href={getDetailsHref(application)}
                    className="text-xs font-medium underline-offset-4 hover:underline"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t bg-muted/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-[13px] text-muted-foreground">
          Showing {applications.length === 0 ? 0 : start + 1}–
          {Math.min(start + PAGE_SIZE, applications.length)} of{" "}
          {applications.length} applications
        </p>

        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      </div>
    </section>
  )
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav
      aria-label="Applications pagination"
      className="flex items-center justify-end gap-2"
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="inline-flex size-8 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="size-4" />
      </button>

      {pages.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          onClick={() => onPageChange(pageNumber)}
          aria-label={`Page ${pageNumber}`}
          aria-current={pageNumber === page ? "page" : undefined}
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-lg border text-xs font-medium transition-colors",
            pageNumber === page
              ? "border-foreground bg-foreground text-background"
              : "bg-background text-muted-foreground hover:bg-muted"
          )}
        >
          {pageNumber}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className="inline-flex size-8 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  )
}

function getDetailsHref(application: JobApplication) {
  return application.jobId
    ? `/browse-jobs/${application.jobId}`
    : "/browse-jobs"
}
