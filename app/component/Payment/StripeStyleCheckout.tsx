"use client"

import * as React from "react"
import {
  ArrowLeft,
  ChevronDown,
  CreditCard,
  HelpCircle,
  Lock,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  USD_TO_BDT_RATE,
  formatBdt,
  type Plan,
  type PlanRole,
} from "@/lib/plans"
import { cn } from "@/lib/utils"

const COUNTRIES = [
  "Bangladesh",
  "India",
  "Pakistan",
  "Nepal",
  "Sri Lanka",
  "United Arab Emirates",
  "Malaysia",
  "Saudi Arabia",
  "Qatar",
  "Singapore",
  "United States",
  "United Kingdom",
]

const CARD_BRANDS = ["VISA", "MC", "AMEX"]

type StripeStyleCheckoutProps = {
  plan: Plan
  role: PlanRole
  defaultEmail?: string
  defaultName?: string
  signedIn: boolean
  redirectTo: string
}

export function StripeStyleCheckout({
  plan,
  role,
  defaultEmail = "",
  defaultName = "",
  signedIn,
  redirectTo,
}: StripeStyleCheckoutProps) {
  const router = useRouter()

  const [currency, setCurrency] = React.useState<"BDT" | "USD">("BDT")
  const [email, setEmail] = React.useState(defaultEmail)
  const [cardNumber, setCardNumber] = React.useState("")
  const [expiry, setExpiry] = React.useState("")
  const [cvc, setCvc] = React.useState("")
  const [cardholder, setCardholder] = React.useState(defaultName)
  const [country, setCountry] = React.useState("Bangladesh")
  const [saveInfo, setSaveInfo] = React.useState(false)

  const usdAmount = plan.price
  const bdtAmount = plan.price * USD_TO_BDT_RATE
  const amountLabel =
    currency === "BDT" ? formatBdt(bdtAmount) : `$${usdAmount.toFixed(2)}`

  const handlePay = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!signedIn) {
      event.preventDefault()
      router.push(`/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`)
      return
    }

    // Signed in → let the native form POST proceed: the server route
    // (/api/checkout_sessions) creates the Stripe Checkout Session and
    // responds with a 303 redirect to Stripe's hosted page, where the
    // card details are actually collected. The fields above are display
    // only — never send card data from our own site.
  }

  return (
    <div>
      {/* Top bar */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/pricing"
            aria-label="Back to pricing"
            className="flex size-8 items-center justify-center rounded-md text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <span className="flex size-8 items-center justify-center rounded-md bg-white/10 text-white/70">
            <Lock className="size-3.5" />
          </span>
        </div>
        <span className="rounded bg-white/10 px-2 py-1 text-[10px] font-semibold tracking-widest text-white/50">
          SANDBOX
        </span>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-12">
        {/* Left: currency + product */}
        <div>
          <p className="text-[11px] font-medium tracking-wider text-white/40 uppercase">
            Choose a currency:
          </p>
          <div className="mt-2 flex gap-3">
            <CurrencyOption
              selected={currency === "BDT"}
              onClick={() => setCurrency("BDT")}
              label={formatBdt(bdtAmount)}
              flag={<FlagBD className="size-3.5" />}
            />
            <CurrencyOption
              selected={currency === "USD"}
              onClick={() => setCurrency("USD")}
              label={`$${usdAmount.toFixed(2)}`}
              flag={<FlagUS className="size-3.5" />}
            />
          </div>
          <p className="mt-2 text-[11px] text-white/40">
            1 USD = {USD_TO_BDT_RATE} BDT
          </p>

          <div className="mt-6 border-t border-white/10 pt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">
                  Hireloop {plan.name} Plan
                </p>
                <p className="mt-1 text-[13px] text-white/40">
                  {role === "seeker"
                    ? "Access to all features"
                    : "Everything to hire faster"}
                </p>
              </div>
              <p className="text-sm font-semibold text-white">{amountLabel}</p>
            </div>
          </div>
        </div>

        {/* Right: checkout form */}
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() =>
              toast.info(
                "Link express checkout will be available with the Stripe integration."
              )
            }
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#00c623] text-sm font-semibold text-white transition-colors hover:bg-[#00b21f]"
          >
            <Zap className="size-4 fill-current" />
            Link
            <span className="mx-1 h-4 w-px bg-black/25" />
            <span className="text-[13px] font-medium">Express checkout</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-[11px] text-white/40">OR</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <section>
            <h2 className="text-[13px] font-medium text-white/80">
              Contact information
            </h2>
            <p className="mt-2 text-[11px] text-white/40">Email</p>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="email@example.com"
              autoComplete="email"
              className="mt-1.5 h-10 w-full rounded-md border border-white/10 bg-[#131316] px-3 text-[13px] text-white/90 transition-colors outline-none placeholder:text-white/30 focus-visible:border-white/30 focus-visible:ring-2 focus-visible:ring-white/20"
            />
          </section>

          <section>
            <h2 className="text-[13px] font-medium text-white/80">
              Payment method
            </h2>
            <div className="mt-2 rounded-lg border border-white/15 bg-[#131316] p-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <CreditCard className="size-4 text-white/70" />
                <span className="text-[13px] font-medium text-white/90">
                  Card
                </span>
              </div>

              <div className="pt-3">
                <p className="text-[11px] font-medium tracking-wider text-white/40 uppercase">
                  Card information
                </p>
                <div className="relative mt-1.5">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cardNumber}
                    onChange={(event) =>
                      setCardNumber(
                        event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 16)
                          .replace(/(\d{4})(?=\d)/g, "$1 ")
                      )
                    }
                    placeholder="1234 1234 1234 1234"
                    autoComplete="cc-number"
                    className="h-10 w-full rounded-md border border-white/10 bg-[#0f0f12] px-3 pr-[86px] text-[13px] text-white/90 transition-colors outline-none placeholder:text-white/30 focus-visible:border-white/30 focus-visible:ring-2 focus-visible:ring-white/20"
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1">
                    {CARD_BRANDS.map((brand) => (
                      <span
                        key={brand}
                        className="rounded bg-white/10 px-1 py-0.5 text-[8px] font-bold text-white/50"
                      >
                        {brand}
                      </span>
                    ))}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={expiry}
                    onChange={(event) => {
                      const digits = event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 4)
                      setExpiry(
                        digits.length > 2
                          ? `${digits.slice(0, 2)} / ${digits.slice(2)}`
                          : digits
                      )
                    }}
                    placeholder="MM / YY"
                    autoComplete="cc-exp"
                    className="h-10 w-full rounded-md border border-white/10 bg-[#0f0f12] px-3 text-[13px] text-white/90 transition-colors outline-none placeholder:text-white/30 focus-visible:border-white/30 focus-visible:ring-2 focus-visible:ring-white/20"
                  />
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cvc}
                      onChange={(event) =>
                        setCvc(
                          event.target.value.replace(/\D/g, "").slice(0, 4)
                        )
                      }
                      placeholder="CVC"
                      autoComplete="cc-csc"
                      className="h-10 w-full rounded-md border border-white/10 bg-[#0f0f12] px-3 pr-9 text-[13px] text-white/90 transition-colors outline-none placeholder:text-white/30 focus-visible:border-white/30 focus-visible:ring-2 focus-visible:ring-white/20"
                    />
                    <HelpCircle className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-white/30" />
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <p className="text-[11px] font-medium tracking-wider text-white/40 uppercase">
                  Cardholder name
                </p>
                <input
                  type="text"
                  value={cardholder}
                  onChange={(event) => setCardholder(event.target.value)}
                  placeholder="Full name on card"
                  autoComplete="cc-name"
                  className="mt-1.5 h-10 w-full rounded-md border border-white/10 bg-[#0f0f12] px-3 text-[13px] text-white/90 transition-colors outline-none placeholder:text-white/30 focus-visible:border-white/30 focus-visible:ring-2 focus-visible:ring-white/20"
                />
              </div>

              <div className="pt-3">
                <p className="text-[11px] font-medium tracking-wider text-white/40 uppercase">
                  Country or region
                </p>
                <div className="relative mt-1.5">
                  <select
                    value={country}
                    onChange={(event) => setCountry(event.target.value)}
                    autoComplete="country"
                    className="h-10 w-full appearance-none rounded-md border border-white/10 bg-[#0f0f12] px-3 pr-8 text-[13px] text-white/90 transition-colors outline-none focus-visible:border-white/30 focus-visible:ring-2 focus-visible:ring-white/20"
                  >
                    {COUNTRIES.map((name) => (
                      <option key={name} value={name} className="bg-[#0f0f12]">
                        {name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-white/40" />
                </div>
              </div>
            </div>
          </section>

          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 bg-[#131316] p-4">
            <input
              type="checkbox"
              checked={saveInfo}
              onChange={(event) => setSaveInfo(event.target.checked)}
              className="mt-0.5 size-4 accent-[#0e5fd8]"
            />
            <span>
              <span className="block text-[13px] font-medium text-white/90">
                Save my information for faster checkout
              </span>
              <span className="mt-0.5 block text-xs text-white/40">
                Pay securely on this site and everywhere Link is accepted.
              </span>
            </span>
          </label>

          <form
            action={`/api/checkout_sessions?role=${role}&plan=${plan.id}`}
            method="POST"
          >
            <section>
              <button
                type="submit"
                onClick={handlePay}
                className="h-11 w-full rounded-lg bg-[#2563eb] text-sm font-semibold text-white transition-colors hover:bg-[#1d55c9]"
              >
                Pay {amountLabel}
              </button>
            </section>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 flex flex-col items-center gap-2 border-t border-white/10 pt-6">
        <p className="flex items-center gap-1.5 text-xs text-white/40">
          <Lock className="size-3" />
          Powered by Stripe
        </p>
        <p className="text-xs text-white/30">
          <Link
            href="/pricing"
            className="transition-colors hover:text-white/60"
          >
            Terms
          </Link>
          <span className="mx-2">·</span>
          <Link
            href="/pricing"
            className="transition-colors hover:text-white/60"
          >
            Privacy
          </Link>
        </p>
      </div>
    </div>
  )
}

function CurrencyOption({
  selected,
  onClick,
  label,
  flag,
}: {
  selected: boolean
  onClick: () => void
  label: string
  flag: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-colors",
        selected
          ? "border-white/60 bg-white/[0.06] text-white"
          : "border-white/10 text-white/60 hover:border-white/25 hover:text-white/80"
      )}
    >
      {flag}
      {label}
    </button>
  )
}

function FlagBD({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 14"
      className={cn("rounded-[2px]", className)}
      aria-hidden
    >
      <rect width="20" height="14" rx="2" fill="#006a4e" />
      <circle cx="9" cy="7" r="3.4" fill="#f42a41" />
    </svg>
  )
}

function FlagUS({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 14"
      className={cn("rounded-[2px]", className)}
      aria-hidden
    >
      <rect width="20" height="14" rx="2" fill="#b22234" />
      <rect y="2.4" width="20" height="2" fill="#ffffff" />
      <rect y="6.4" width="20" height="2" fill="#ffffff" />
      <rect y="10.4" width="20" height="2" fill="#ffffff" />
      <rect width="9" height="7" fill="#3c3b6e" />
    </svg>
  )
}
