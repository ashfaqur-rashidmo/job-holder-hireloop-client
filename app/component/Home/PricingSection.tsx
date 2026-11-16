"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ArrowRight,
  ChartColumn,
  Crown,
  Plus,
  Zap,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

type HomePlan = {
  id: string
  name: string
  icon: LucideIcon
  iconClassName: string
  /** USD per month, billing toggle only affects the displayed price. */
  monthlyPrice: number
  features: string[]
  highlighted?: boolean
  /** Existing checkout this card sends the visitor to. */
  checkoutHref: string
}

const YEARLY_DISCOUNT = 0.72 // 28% off

const PLANS: HomePlan[] = [
  {
    id: "starter",
    name: "Starter",
    icon: Crown,
    iconClassName: "text-indigo-400",
    monthlyPrice: 0,
    features: [
      "Daily AI match brief (top 5)",
      "Verified salary bands",
      "Company insight dashboards",
      "1-click apply, unlimited",
    ],
    checkoutHref: "/payment?role=seeker&plan=free",
  },
  {
    id: "growth",
    name: "Growth",
    icon: ChartColumn,
    iconClassName: "text-pink-500",
    monthlyPrice: 17,
    features: [
      "Daily AI match brief (top 5)",
      "Verified salary bands",
      "Company insight dashboards",
      "1-click apply, unlimited",
    ],
    highlighted: true,
    checkoutHref: "/payment?role=seeker&plan=pro",
  },
  {
    id: "premium",
    name: "Premium",
    icon: Zap,
    iconClassName: "text-white",
    monthlyPrice: 99,
    features: [
      "Everything in Pro",
      "Multi-profile career portfolios",
      "Shared talent rooms",
      "Recruiter view (read-only)",
    ],
    checkoutHref: "/payment?role=seeker&plan=premium",
  },
]

type BillingPeriod = "monthly" | "yearly"

export default function PricingSection() {
  const [billing, setBilling] = useState<BillingPeriod>("monthly")

  return (
    <section id="pricing" className="bg-[#050505] py-20 text-white sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-2">
          <span aria-hidden="true" className="size-1.5 rounded-[2px] bg-indigo-500" />
          <span className="text-[11px] font-bold tracking-[0.2em] text-indigo-300 uppercase">
            Pricing
          </span>
          <span aria-hidden="true" className="size-1.5 rounded-[2px] bg-indigo-500" />
        </div>

        {/* Heading */}
        <h2 className="mx-auto mt-4 max-w-2xl text-center text-4xl font-bold tracking-tight sm:text-5xl">
          Pay for the leverage, not the listings
        </h2>

        {/* Billing toggle */}
        <div className="mt-10 flex justify-center">
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-[#111111] p-1">
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              aria-pressed={billing === "monthly"}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                billing === "monthly"
                  ? "bg-white text-black"
                  : "text-white/60 hover:text-white"
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBilling("yearly")}
              aria-pressed={billing === "yearly"}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                billing === "yearly"
                  ? "bg-white text-black"
                  : "text-white/60 hover:text-white"
              )}
            >
              Yearly
              <span className="rounded-full bg-pink-600 px-2 py-0.5 text-[10px] font-bold text-white">
                28%
              </span>
            </button>
          </div>
        </div>

        {/* Plan cards */}
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              yearly={billing === "yearly"}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingCard({ plan, yearly }: { plan: HomePlan; yearly: boolean }) {
  const price = yearly
    ? Math.round(plan.monthlyPrice * YEARLY_DISCOUNT)
    : plan.monthlyPrice

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-2xl border p-6",
        plan.highlighted
          ? "border-white/25 bg-[#181818] shadow-[0_0_50px_rgba(99,102,241,0.12)]"
          : "border-white/10 bg-[#111111]"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
            <plan.icon className={cn("size-4", plan.iconClassName)} aria-hidden="true" />
          </span>
          <h3 className="text-base font-semibold text-white">{plan.name}</h3>
        </div>

        <p className="text-white">
          <span className="text-3xl font-bold">${price}</span>
          <span className="ml-1 text-xs text-white/40">/month</span>
        </p>
      </div>

      <p className="mt-6 text-sm font-medium text-white">
        Start building your insights hub:
      </p>

      <ul className="mt-3 flex flex-col gap-2.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2.5">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.04]">
              <Plus className="size-3 text-indigo-400" aria-hidden="true" />
            </span>
            <span className="text-xs text-white/60">{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href={plan.checkoutHref}
        className={cn(
          "mt-auto inline-flex items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
          plan.highlighted
            ? "mt-8 bg-white text-black hover:bg-white/90"
            : "border border-white/10 bg-white/[0.04] text-white hover:bg-white/10"
        )}
      >
        Choose This Plan
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </article>
  )
}
