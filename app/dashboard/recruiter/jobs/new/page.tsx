"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { toast } from "sonner"

import { JobForm } from "@/app/component/RecruiterJobs/JobForm"
import { createJob } from "@/lib/actions/jobs"
import { getRecruiterJobCount } from "@/lib/api/jobs"
import { isUserPremium } from "@/lib/api/users"
import { useSession } from "@/lib/auth-client"
import type { JobFormData } from "@/lib/job"

const INITIAL_FORM: JobFormData = {
  title: "",
  company: "",
  companyId: "",
  recruiterId: "",
  category: "",
  jobType: "Full-time",
  isRemote: false,
  location: "",
  deadline: "",
  minSalary: "",
  maxSalary: "",
  frequency: "per hour",
  responsibilities: "",
  qualifications: "",
  applicants: 0,
  status: "Active",
}

const REQUIRED_FIELDS: { key: keyof JobFormData; label: string }[] = [
  { key: "title", label: "Job Title" },
  { key: "company", label: "Company Name" },
  { key: "category", label: "Job Category" },
  { key: "location", label: "Job Location" },
  { key: "deadline", label: "Application Deadline" },
  { key: "responsibilities", label: "Key Responsibilities" },
  { key: "qualifications", label: "Qualifications & Requirements" },
]

// Free plan: recruiters can keep up to 5 active job posts. Paying the
// recruiter plan removes the cap (premium users are unlimited).
const FREE_JOB_POST_LIMIT = 5

export default function NewJobPage() {
  const [form, setForm] = React.useState<JobFormData>(INITIAL_FORM)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const router = useRouter()
  const { data: sessionData, isPending: isSessionPending } = useSession()

  function update<K extends keyof JobFormData>(key: K, value: JobFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSessionPending || isSubmitting) return

    const missing = REQUIRED_FIELDS.filter(
      (field) => !String(form[field.key]).trim()
    )

    if (missing.length > 0) {
      toast.error("Please fill in the required fields", {
        description: missing.map((field) => field.label).join(", "),
      })
      return
    }

    const user = sessionData?.user

    if (!user) {
      toast.error("Please sign in as a recruiter to post a job.")
      router.push("/sign-in?redirectTo=/dashboard/recruiter/jobs/new")
      return
    }

    // Free plan: up to 5 active job posts — premium users are unlimited.
    const isPremium = await isUserPremium(user.id)

    if (!isPremium) {
      const activeCount = await getRecruiterJobCount(user.id)

      if (activeCount >= FREE_JOB_POST_LIMIT) {
        toast.info("Free plan limit reached", {
          description: `You already have ${FREE_JOB_POST_LIMIT} job posts. Upgrade to post more.`,
        })
        router.push("/payment?role=recruiter&plan=growth")
        return
      }
    }

    // Attach the posting recruiter so Manage Jobs stays per-user.
    setIsSubmitting(true)

    try {
      const result = await createJob({
        ...form,
        recruiterId: user.id,
        recruiterEmail: user.email,
      })

      if (result.insertedId) {
        console.log("Job creation result:", result)
        toast.success("Job published!", {
          description: `${form.title} at ${form.company}`,
        })

        router.push("/dashboard/recruiter/jobs")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl pb-10">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link
              href="/dashboard/recruiter/jobs"
              className="transition-colors hover:text-foreground"
            >
              Manage Jobs
            </Link>
            <span aria-hidden="true">›</span>
            <span>Create New Listing</span>
          </nav>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Post a New Job
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
            Fill in the position specifications to attract qualified talent
            across our network.
          </p>
        </div>
      </div>

      <JobForm
        form={form}
        onChange={update}
        onSubmit={handleSubmit}
        submitLabel="Publish Job"
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
