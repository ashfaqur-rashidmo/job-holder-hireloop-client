import {
  Bike,
  CircleDollarSign,
  Laptop,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"
import type { ReactNode } from "react"

import type { JobPost } from "@/lib/job"

import {
  getJobBenefits,
  getJobDescription,
  splitJobList,
} from "../../../lib/jobDetailsData/job-details-data"

const BENEFIT_ICONS: LucideIcon[] = [
  ShieldCheck,
  CircleDollarSign,
  Laptop,
  Bike,
]

const FALLBACK_RESPONSIBILITIES = [
  "Responsibilities will be discussed during the interview process.",
]

const FALLBACK_REQUIREMENTS = [
  "Requirements will be discussed during the interview process.",
]

type JobDescriptionSectionsProps = {
  job: JobPost
}

type SectionProps = {
  title: string
  children: ReactNode
  bordered?: boolean
}

function Section({ title, children, bordered = false }: SectionProps) {
  return (
    <section
      className={bordered ? "border-t border-white/[0.07] pt-6" : undefined}
    >
      <h2 className="text-[22px] leading-7 font-medium text-[#EDEDEF]">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex gap-6">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-white" />
          <p className="text-[13px] leading-5 text-[#A0A0AB]">{item}</p>
        </li>
      ))}
    </ul>
  )
}

export function JobDescriptionSections({ job }: JobDescriptionSectionsProps) {
  const description = getJobDescription(job)
  const responsibilities = splitJobList(job.responsibilities)
  const requirements = splitJobList(job.qualifications)
  const benefits = getJobBenefits(job)

  return (
    <article className="space-y-6 border border-white/[0.07] bg-[#141418] p-6 sm:p-8">
      <Section title="Job Description">
        <p className="text-[13px] leading-5 text-[#A0A0AB]">{description}</p>
      </Section>

      <Section title="Responsibilities" bordered>
        <BulletList
          items={
            responsibilities.length
              ? responsibilities
              : FALLBACK_RESPONSIBILITIES
          }
        />
      </Section>

      <Section title="Requirements" bordered>
        <BulletList
          items={requirements.length ? requirements : FALLBACK_REQUIREMENTS}
        />
      </Section>

      <Section title="Benefits" bordered>
        {benefits.length ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
            {benefits.map((benefit, index) => {
              const Icon = BENEFIT_ICONS[index % BENEFIT_ICONS.length]

              return (
                <div
                  key={`${benefit}-${index}`}
                  className="flex h-16 items-center gap-6 px-3"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <Icon className="size-4 text-white" strokeWidth={1.8} />
                  </span>
                  <span className="text-base text-[#EDEDEF]">{benefit}</span>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-[13px] leading-5 text-[#A0A0AB]">
            The employer has not listed additional benefits for this role.
          </p>
        )}
      </Section>
    </article>
  )
}
