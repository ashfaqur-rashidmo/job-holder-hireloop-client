"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { toast } from "sonner"

import { JobForm } from "@/app/component/RecruiterJobs/JobForm"
import { buttonVariants } from "@/components/ui/button"
import { updateJob } from "@/lib/actions/jobs"
import { getJob } from "@/lib/api/jobs"
import { useSession } from "@/lib/auth-client"
import type { JobFormData, JobPost } from "@/lib/job"

const REQUIRED_FIELDS: { key: keyof JobFormData; label: string }[] = [
  { key: "title", label: "Job Title" },
  { key: "company", label: "Company Name" },
  { key: "category", label: "Job Category" },
  { key: "location", label: "Job Location" },
  { key: "deadline", label: "Application Deadline" },
  { key: "responsibilities", label: "Key Responsibilities" },
  { key: "qualifications", label: "Qualifications & Requirements" },
]

/** Keep only the editable form fields from the stored job post. */
function jobToForm(job: JobPost): JobFormData {
  return {
    title: job.title,
    company: job.company,
    companyId: job.companyId ?? "",
    recruiterId: job.recruiterId ?? "",
    category: job.category,
    jobType: job.jobType,
    isRemote: job.isRemote,
    location: job.location,
    deadline: job.deadline,
    minSalary: job.minSalary,
    maxSalary: job.maxSalary,
    frequency: job.frequency,
    responsibilities: job.responsibilities,
    qualifications: job.qualifications,
    applicants: job.applicants,
    status: job.status,
    description: job.description,
    benefits: job.benefits,
  }
}

export default function EditJobPage() {
  const { id } = useParams<{ id: string }>()

  const [form, setForm] = React.useState<JobFormData | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")

  const router = useRouter()
  const { data: sessionData, isPending: isSessionPending } = useSession()
  

  // Load the job post once the session is ready.
  React.useEffect(() => {
    if (isSessionPending || !id) return

    const fetchJob = async () => {
      try {
        setLoading(true)
        setError("")

        const user = sessionData?.user

        if (!user) {
          setError("Please sign in as a recruiter to edit a job post.")
          return
        }

        const job = await getJob(id)

        if (!job) {
          setError("Job post not found.")
          return
        }

        // Recruiters can only edit their own job posts.
        if (job.recruiterId && job.recruiterId !== user.id) {
          setError("You can only edit your own job posts.")
          return
        }

        setForm(jobToForm(job))
      } catch (fetchError) {
        console.error("Error loading job:", fetchError)
        setError("Failed to load the job post.")
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [id, isSessionPending, sessionData])

  function update<K extends keyof JobFormData>(key: K, value: JobFormData[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form || isSubmitting) return

    const missing = REQUIRED_FIELDS.filter(
      (field) => !String(form[field.key]).trim()
    )

    if (missing.length > 0) {
      toast.error("Please fill in the required fields", {
        description: missing.map((field) => field.label).join(", "),
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await updateJob(id, form)

      if (!result.success) {
        toast.error(result.message)
        return
      }

      toast.success("Job post updated!", {
        description: `${form.title} at ${form.company}`,
      })

      router.push("/dashboard/recruiter/jobs")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading job post...</p>
      </div>
    )
  }

  // Error state
  if (error || !form) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
        <p className="text-sm text-destructive">{error || "Job not found."}</p>

        <Link
          href="/dashboard/recruiter/jobs"
          className={buttonVariants({ variant: "outline" })}
        >
          <ArrowLeft className="size-4" />
          Back to Job Posts
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl pb-10">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link
              href="/dashboard/recruiter/jobs"
              className="transition-colors hover:text-foreground"
            >
              Manage Jobs
            </Link>
            <span aria-hidden="true">›</span>
            <span className="max-w-[200px] truncate">{form.title}</span>
            <span aria-hidden="true">›</span>
            <span>Edit</span>
          </nav>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Edit Job Post
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
            Update the position details. Changes are visible to candidates right
            away.
          </p>
        </div>
      </div>

      <JobForm
        form={form}
        onChange={update}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
