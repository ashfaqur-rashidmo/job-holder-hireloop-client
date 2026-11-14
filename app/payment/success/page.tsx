import { Check } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

import { buttonVariants } from "@/components/ui/button"
import { stripe } from "@/lib/stripe"
import { cn } from "@/lib/utils"
import { paymentCheckOutVerify } from "@/lib/actions/payments"

type SuccessPaymentPageProps = {
  searchParams: Promise<{ session_id?: string }>
}

export default async function SuccessPaymentPage({
  searchParams,
}: SuccessPaymentPageProps) {
  const { session_id } = await searchParams

  if (!session_id) {
    return redirect("/payment")
  }

  let session
  try {
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    })
  } catch {
    // Invalid or unknown session id — send the user back to checkout.
    return redirect("/payment")
  }

  // The payment status can lag the redirect back from Stripe (popup-based
  // payments like Link confirm a moment after the redirect starts), so
  // poll briefly instead of bouncing the user away on a stale "open".
  for (
    let attempt = 0;
    attempt < 5 &&
    session.status === "open" &&
    session.payment_status !== "paid";
    attempt++
  ) {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    })
  }

  if (session.status === "complete" || session.payment_status === "paid") {
    // fall through to the success screen below
  } else if (session.status === "open") {
    return redirect("/")
  } else {
    // e.g. "expired" — no payment happened.
    return redirect("/payment")
  }

  const customerEmail = session.customer_details?.email

  console.log({
    status: session.status,
    customerEmail,
    session_id,
    payment_status: session.payment_status,
    line_items: session.line_items?.data,
  })

  const result = await paymentCheckOutVerify(session_id)
  console.log({ result })

  return (
    <main className="min-h-screen bg-[#0b0b0d] text-white">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-md flex-col items-center justify-center px-4 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
          <Check className="size-5" />
        </span>
        <h1 className="mt-4 text-xl font-semibold">Payment successful</h1>
        <p className="mt-2 text-sm text-white/50">
          We appreciate your business! A confirmation email will be sent to{" "}
          {customerEmail ?? "your email"}. If you have any questions, please
          email{" "}
          <a
            href="mailto:orders@example.com"
            className="text-white underline underline-offset-2"
          >
            orders@example.com
          </a>
          .
        </p>
        <Link
          href="/"
          className={cn(
            buttonVariants({ className: "mt-6 h-9 px-4" }),
            "bg-white text-black hover:bg-white/85"
          )}
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}
