export type PlanRole = "seeker" | "recruiter"

export type Plan = {
  id: string
  name: string
  role: PlanRole
  /** USD per month. 0 means the plan is free. */
  price: number
  features: string[]
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    role: "seeker",
    price: 0,
    features: [
      "Browse & save up to 10 jobs",
      "Apply to up to 3 jobs per month",
      "Basic profile",
      "Email job alerts",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    role: "seeker",
    price: 19,
    features: [
      "Apply to up to 30 jobs per month",
      "Unlimited saved jobs",
      "Application tracking",
      "Salary insights",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    role: "seeker",
    price: 39,
    features: [
      "Everything in Pro",
      "Unlimited applications",
      "Profile boost to recruiters",
      "Early access to new jobs",
      "Priority support",
    ],
  },
  {
    id: "free",
    name: "Free",
    role: "recruiter",
    price: 0,
    features: [
      "Up to 3 active job posts",
      "Basic applicant management",
      "Standard listing visibility",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    role: "recruiter",
    price: 49,
    features: [
      "Up to 10 active job posts",
      "Applicant tracking",
      "Basic analytics",
      "Email support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    role: "recruiter",
    price: 149,
    features: [
      "Up to 50 active job posts",
      "Advanced analytics dashboard",
      "Featured job listings",
      "Team collaboration",
      "Custom branding",
      "Priority support",
    ],
  },
]

const DEFAULT_PAID_PLAN_ID: Record<PlanRole, string> = {
  seeker: "pro",
  recruiter: "growth",
}

export function getPlanRole(value?: string): PlanRole {
  return value === "recruiter" ? "recruiter" : "seeker"
}

/** Finds the plan for the role, falling back to the role's default paid plan. */
export function getPlan(role: PlanRole, planId?: string): Plan {
  const plan = PLANS.find(
    (candidate) => candidate.role === role && candidate.id === planId
  )

  if (plan) {
    return plan
  }

  const fallbackId = DEFAULT_PAID_PLAN_ID[role]

  return PLANS.find(
    (candidate) => candidate.role === role && candidate.id === fallbackId
  ) as Plan
}

export function formatPlanPrice(plan: Plan): string {
  return plan.price === 0 ? "$0/forever" : `$${plan.price}/month`
}

export function formatPlanAmount(amount: number): string {
  return `$${amount.toFixed(2)}`
}

/** Fixed display rate until live FX comes from Stripe. */
export const USD_TO_BDT_RATE = 127.6865

export function formatBdt(amount: number): string {
  return `BDT ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}
