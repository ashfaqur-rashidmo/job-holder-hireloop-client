"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRight,
  Building2,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  Globe2,
  MapPin,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"] as const
type JobType = (typeof JOB_TYPES)[number]

const JOB_CATEGORIES = [
  "Engineering & Tech",
  "Design & Creative",
  "Marketing & Sales",
  "Finance & Accounting",
  "Operations & Support",
  "Healthcare",
  "Education",
]

const FREQUENCIES = ["per hour", "per day", "per month", "per year"]

type JobForm = {
  title: string
  company: string
  category: string
  jobType: JobType
  isRemote: boolean
  location: string
  deadline: string
  minSalary: string
  maxSalary: string
  frequency: string
  responsibilities: string
  qualifications: string
}

const INITIAL_FORM: JobForm = {
  title: "",
  company: "",
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
}

const REQUIRED_FIELDS: { key: keyof JobForm; label: string }[] = [
  { key: "title", label: "Job Title" },
  { key: "company", label: "Company Name" },
  { key: "category", label: "Job Category" },
  { key: "location", label: "Job Location" },
  { key: "deadline", label: "Application Deadline" },
  { key: "responsibilities", label: "Key Responsibilities" },
  { key: "qualifications", label: "Qualifications & Requirements" },
]

const fieldClass =
  "h-10 rounded-lg border-border/60 bg-muted/30 text-sm shadow-none focus-visible:border-indigo-500/60 focus-visible:ring-indigo-500/30 dark:[color-scheme:dark]"

const textareaClass =
  "min-h-28 resize-y rounded-lg border-border/60 bg-muted/30 text-sm shadow-none focus-visible:border-indigo-500/60 focus-visible:ring-indigo-500/30"

export default function NewJobPage() {
  const [form, setForm] = React.useState<JobForm>(INITIAL_FORM)

  function update<K extends keyof JobForm>(key: K, value: JobForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const missing = REQUIRED_FIELDS.filter(
      (field) => !String(form[field.key]).trim()
    )

    if (missing.length > 0) {
      toast.error("Please fill in the required fields", {
        description: missing.map((field) => field.label).join(", "),
      })
      return
    }

    // Data is collected here — swap this for the API call when it exists.
    console.log("New job payload:", form)

    fetch("http://localhost:5000/jobs" , {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
    })

    toast.success("Job published!", {
      description: `${form.title} at ${form.company}`,
    })
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

      <form
        id="new-job-form"
        onSubmit={handleSubmit}
        className="mt-8 space-y-10"
      >
        {/* 1. Basic Information */}
        <FormSection number={1} title="Basic Information">
          <Field label="Job Title" required>
            <Input
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
              placeholder="e.g. Frontend Developer"
              className={fieldClass}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company Name" required>
              <div className="relative">
                <Building2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={form.company}
                  onChange={(event) => update("company", event.target.value)}
                  placeholder="e.g. HirePulse Network"
                  className={cn(fieldClass, "pl-9")}
                />
              </div>
            </Field>

            <Field label="Job Category" required>
              <SelectInput
                value={form.category}
                onChange={(event) => update("category", event.target.value)}
                options={JOB_CATEGORIES}
                placeholder="Select a category"
              />
            </Field>
          </div>

          <Field label="Job Type" required>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {JOB_TYPES.map((type) => {
                const selected = form.jobType === type
                return (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => update("jobType", type)}
                    className={cn(
                      "h-10 rounded-lg border text-sm font-medium transition-colors",
                      selected
                        ? "border-indigo-500/60 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300"
                        : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    {type}
                  </button>
                )
              })}
            </div>
          </Field>
        </FormSection>

        {/* 2. Location, Compensation & Timeline */}
        <FormSection number={2} title="Location, Compensation & Timeline">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                <Globe2 className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Remote Work Allowed{" "}
                  <span className="font-normal text-muted-foreground">
                    (isRemote)
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Enable worldwide or distributed candidate applications
                </p>
              </div>
            </div>
            <Switch
              checked={form.isRemote}
              onChange={(checked) => update("isRemote", checked)}
              label="Remote work allowed"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Job Location" required hint="(location)">
              <div className="relative">
                <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={form.location}
                  onChange={(event) => update("location", event.target.value)}
                  placeholder="e.g. New York, USA"
                  className={cn(fieldClass, "pl-9")}
                />
              </div>
            </Field>

            <Field label="Application Deadline" required hint="(deadline)">
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="date"
                  value={form.deadline}
                  onChange={(event) => update("deadline", event.target.value)}
                  className={cn(fieldClass, "pl-9")}
                />
              </div>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Min Salary / Rate">
              <div className="relative">
                <CircleDollarSign className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  min={0}
                  value={form.minSalary}
                  onChange={(event) => update("minSalary", event.target.value)}
                  placeholder="25"
                  className={cn(fieldClass, "pl-9")}
                />
              </div>
            </Field>

            <Field label="Max Salary / Rate">
              <div className="relative">
                <CircleDollarSign className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  min={0}
                  value={form.maxSalary}
                  onChange={(event) => update("maxSalary", event.target.value)}
                  placeholder="40"
                  className={cn(fieldClass, "pl-9")}
                />
              </div>
            </Field>

            <Field label="Frequency">
              <SelectInput
                value={form.frequency}
                onChange={(event) => update("frequency", event.target.value)}
                options={FREQUENCIES}
                placeholder="Select frequency"
              />
            </Field>
          </div>
        </FormSection>

        {/* 3. Responsibilities & Requirements */}
        <FormSection number={3} title="Responsibilities & Requirements">
          <Field label="Key Responsibilities" required>
            <Textarea
              rows={5}
              value={form.responsibilities}
              onChange={(event) =>
                update("responsibilities", event.target.value)
              }
              placeholder="Showcase your commitment to delivering exceptional user interfaces and digital experiences…"
              className={textareaClass}
            />
          </Field>

          <Field label="Qualifications & Requirements" required>
            <Textarea
              rows={5}
              value={form.qualifications}
              onChange={(event) => update("qualifications", event.target.value)}
              placeholder="List the experience, skills and qualifications this role requires…"
              className={textareaClass}
            />
          </Field>
        </FormSection>
        <Button
          type="submit"
          form="new-job-form"
          variant="gradient"
          className="h-9 shrink-0 rounded-lg px-4"
        >
          Publish Job
          <ArrowRight className="size-4" />
        </Button>
      </form>
    </div>
  )
}

function FormSection({
  number,
  title,
  children,
}: {
  number: number
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="border-t border-border/60 pt-8 first:border-t-0 first:pt-0">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
        <span className="size-1.5 rotate-45 bg-indigo-500" aria-hidden="true" />
        {number}. {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-foreground/80">
        {label}
        {hint && (
          <span className="ml-1 font-normal text-muted-foreground">{hint}</span>
        )}
        {required && (
          <span className="ml-0.5 text-indigo-500 dark:text-indigo-400">*</span>
        )}
      </Label>
      {children}
    </div>
  )
}

function SelectInput({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  options: string[]
  placeholder: string
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={cn(
          "h-10 w-full appearance-none rounded-lg border border-border/60 bg-muted/30 px-3 pr-9 text-sm shadow-none outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/30",
          value ? "text-foreground" : "text-muted-foreground"
        )}
      >
        <option value="" disabled className="bg-background text-foreground">
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-background text-foreground"
          >
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:outline-none",
        checked ? "bg-indigo-500" : "bg-muted-foreground/30"
      )}
    >
      <span
        className={cn(
          "inline-block size-5 rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        )}
      />
    </button>
  )
}
