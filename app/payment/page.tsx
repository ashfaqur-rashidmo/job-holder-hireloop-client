import { Check } from "lucide-react"
import Link from "next/link"
import { headers } from "next/headers"

import { StripeStyleCheckout } from "@/app/component/Payment/StripeStyleCheckout"
import { buttonVariants } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { getPlan, getPlanRole, type Plan, type PlanRole } from "@/lib/plans"
import { cn } from "@/lib/utils"

type PaymentPageProps = {
  searchParams: Promise<{ plan?: string; role?: string }>
}

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const { plan: planParam, role: roleParam } = await searchParams
  const role = getPlanRole(roleParam)
  const plan = getPlan(role, planParam)

  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const user = session?.user

  const redirectTo = `/payment?role=${role}&plan=${plan.id}`

  return (
    <main className="min-h-screen bg-[#0b0b0d] text-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
        {plan.price === 0 ? (
          <FreePlanCard plan={plan} role={role} />
        ) : (
          <StripeStyleCheckout
            plan={plan}
            role={role}
            defaultEmail={user?.email ?? ""}
            defaultName={user?.name ?? ""}
            signedIn={Boolean(user)}
            redirectTo={redirectTo}
          />
        )}
      </div>
    </main>
  )
}

function FreePlanCard({ plan, role }: { plan: Plan; role: PlanRole }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
        <Check className="size-5" />
      </span>
      <h1 className="mt-4 text-xl font-semibold">
        The {plan.name} plan is free
      </h1>
      <p className="mt-2 max-w-sm text-sm text-white/50">
        No payment is needed for the {plan.name} plan. You can upgrade any time
        from billing.
      </p>
      <Link
        href={
          role === "recruiter" ? "/dashboard/recruiter" : "/dashboard/seeker"
        }
        className={cn(
          buttonVariants({ className: "mt-6 h-9 px-4" }),
          "bg-white text-black hover:bg-white/85"
        )}
      >
        Go to dashboard
      </Link>
    </div>
  )
}
