import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { stripe } from "@/lib/stripe"
import { getSession } from "@/lib/core/server"

// Stripe Price IDs.
// Recruiter: $50 one-time "Hireloop Recruiter Plan" — swap this ID for your
// own recruiter price if you prefer (Stripe dashboard → Prices).
const SEEKER_PRICE_ID = "price_1UbD0cIdHxTs9n08Xu4VOVPA"
const RECRUITER_PRICE_ID = "price_1UbMNOIdHxTs9n08BezBTL59"

export async function POST(request: Request) {
  const userSession = await getSession()

  try {
    const headersList = await headers()
    const origin = headersList.get("origin")

    // Pick the price based on who is paying: recruiters pay the recruiter
    // plan (from /payment?role=recruiter), seekers the seeker plan.
    const { searchParams } = new URL(request.url)
    const role =
      searchParams.get("role") === "recruiter" ? "recruiter" : "seeker"
    const priceId = role === "recruiter" ? RECRUITER_PRICE_ID : SEEKER_PRICE_ID

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: userSession?.user?.email ?? undefined,
      metadata: userSession?.user?.id
        ? { userId: userSession.user.id, role }
        : undefined,
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment?canceled=1`,
      // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
      integration_identifier: "hire_loop_web_001",
    })
    return NextResponse.redirect(session.url as string, 303)
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
