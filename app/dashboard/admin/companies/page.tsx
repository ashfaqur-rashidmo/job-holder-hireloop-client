import { headers } from "next/headers"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getJobs } from "@/lib/api/jobs"
import { auth } from "@/lib/auth"
import { getJobStatus, type JobPost } from "@/lib/job"

// There is no companies collection in the backend yet — companies only
// exist as `company` / `companyId` fields on job posts. So this page
// groups all job posts by company to build the list.
type AdminCompany = {
  id: string
  name: string
  totalJobs: number
  activeJobs: number
  expiredJobs: number
  categories: string[]
}

/** Group job posts into one row per company. */
function buildCompanyRows(jobs: JobPost[]): AdminCompany[] {
  // Key = companyId (falls back to the company name when missing).
  const rows = new Map<
    string,
    {
      name: string
      totalJobs: number
      activeJobs: number
      expiredJobs: number
      categories: Set<string>
    }
  >()

  for (const job of jobs) {
    const key = job.companyId || job.company || "unknown"
    const row = rows.get(key) ?? {
      name: job.company || "Unknown company",
      totalJobs: 0,
      activeJobs: 0,
      expiredJobs: 0,
      categories: new Set<string>(),
    }

    row.totalJobs++

    // Prefer the deadline-based status so legacy posts without a
    // stored status are still counted correctly.
    if (getJobStatus(job) === "Active") {
      row.activeJobs++
    } else {
      row.expiredJobs++
    }

    if (job.category) {
      row.categories.add(job.category)
    }

    rows.set(key, row)
  }

  // Busiest companies first, then alphabetical.
  return [...rows.entries()]
    .map(([id, row]) => ({
      id,
      name: row.name,
      totalJobs: row.totalJobs,
      activeJobs: row.activeJobs,
      expiredJobs: row.expiredJobs,
      categories: [...row.categories],
    }))
    .sort(
      (a, b) => b.totalJobs - a.totalJobs || a.name.localeCompare(b.name)
    )
}

export default async function AdminCompaniesPage() {
  // Only admins can open the Manage Companies page.
  const session = await auth.api.getSession({ headers: await headers() })

  if (session?.user?.role !== "admin") {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
        <p className="text-sm text-destructive">
          Only admins can view this page.
        </p>

        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Back to Home
        </Link>
      </div>
    )
  }

  let companies: AdminCompany[] = []

  try {
    companies = buildCompanyRows(await getJobs())
  } catch (error) {
    console.error("Failed to load companies:", error)
  }

  const totalJobs = companies.reduce((sum, c) => sum + c.totalJobs, 0)

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          Manage Companies
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {companies.length} companies · {totalJobs} job posts · derived from
          job posts until a companies collection exists
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-11 px-4 text-xs font-medium">
                Company
              </TableHead>
              <TableHead className="h-11 px-4 text-xs font-medium">
                Total Jobs
              </TableHead>
              <TableHead className="h-11 px-4 text-xs font-medium">
                Active
              </TableHead>
              <TableHead className="h-11 px-4 text-xs font-medium">
                Expired
              </TableHead>
              <TableHead className="h-11 px-4 text-xs font-medium">
                Categories
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="px-4 text-[13px] font-medium">
                  {company.name}
                </TableCell>
                <TableCell className="px-4 text-[13px]">
                  {company.totalJobs}
                </TableCell>
                <TableCell className="px-4 text-[13px] text-emerald-500">
                  {company.activeJobs}
                </TableCell>
                <TableCell className="px-4 text-[13px] text-red-400">
                  {company.expiredJobs}
                </TableCell>
                <TableCell className="px-4 text-[13px] text-muted-foreground">
                  {company.categories.length > 0
                    ? company.categories.join(", ")
                    : "—"}
                </TableCell>
              </TableRow>
            ))}

            {companies.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-4 py-10 text-center text-sm text-muted-foreground"
                >
                  No companies found — they will appear here once jobs are
                  posted.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
