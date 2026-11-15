<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands (npm)

- `npm run dev` — dev server on http://localhost:3000 (also regenerates the AGENTS.md block above).
- `npm run build` — production build (output to `.next`).
- `npm run start` — production server, run only after `build`.
- `npm run typecheck` — `tsc --noEmit` (strict mode, `@/*` -> `./*`).
- `npm run lint` — ESLint flat config with `eslint-config-next`.
- `npm run format` — Prettier `--write **/*.{ts,tsx}` (no semicolons, double quotes, LF, 80 col, tailwind plugin).
- No test runner is installed; there are no test commands to run.

Verify before committing: `npm run typecheck && npm run lint`, then `npm run format` if you changed formatting.

## Dev prerequisites

- `.env` is gitignored but required locally: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `BETTER_AUTH_DB_URI`, `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY` (shape in the existing `.env`; use `http://localhost:3000` and `mongodb://localhost:27017` locally).
- A local MongoDB must be running: better-auth connects via `BETTER_AUTH_DB_URI` (db `hireloopdb`, `@better-auth/mongo-adapter`). GitHub social login additionally needs `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`.
- Job/application backend: `../hireloop-server` (Express + MongoDB) on `http://localhost:5000` (configurable via `NEXT_PUBLIC_API_BASE_URL`). Endpoints used by this client: `/jobs` (+ `/jobs/:id`, `/jobs/count?recruiterId=`), `/applications`, `/saved-jobs`, `/users/:id/premium`, `/payments/checkout-verify`. `DELETE /jobs/:id` responds with MongoDB's `{ acknowledged, deletedCount }`, not `{ success }` — normalize it client-side.
- Sign-up includes an account-type selection (seeker / recruiter / admin) sent as the `role` additional field to better-auth `signUp.email`. Toasts use `sonner` (`toast.success` / `toast.error`).
- Auth pages (`/sign-in`, `/sign-up`) redirect to `/` when a session already exists (checked via `authClient.useSession()`).

## Architecture

- Next.js 16 App Router. Public pages: `/` (renders `HeroSection` from `components/Hero-Section.tsx`), `/browse-jobs` + `/browse-jobs/[id]` (job details), `/payment` + `/payment/success`, `/unauthorized`. Auth pages live in `app/(auth)/sign-in|sign-up`. API routes under `app/api`.
- Server pages are async Server Components; `params` and `searchParams` are Promises — `await` them before use.
- Two component directories with different purposes — don't confuse them:
  - `components/` — navbar (`components/navbar.tsx`, returns `null` on `/dashboard/*` so the dashboard keeps its own shell), `Hero-Section.tsx`, `theme-provider.tsx`, and shadcn primitives in `components/ui/`.
  - `app/component/` (singular) — feature components grouped by feature folder: `BrowseJobs/`, `Job-Details/`, `Payment/`, `RecruiterJobs/`, `RecruiterDashboard/`, `RecruiterApplications/`, `SeekerApplications/`, `SeekerSavedJobs/`, `AdminUsers/`.
- `lib/` layout:
  - `lib/api/*` — GET fetch helpers against the Express backend. `lib/api/users.server.ts` imports `next/headers` and is server-only; browser-safe user helpers live in `lib/api/users.ts`.
  - `lib/actions/*` — POST/PUT create/update fetch wrappers (`jobs.ts`, `applications.ts`, `saved-jobs.ts`, `payments.ts`). Despite the name, these are plain async functions, NOT `"use server"` actions.
  - Types/constants live beside features: `lib/job.ts` (`JobFormData`, `JobPost`, `JOB_CATEGORIES`, `JOB_TYPES`), `lib/application.ts`, `lib/saved-job.ts`, `lib/user.ts`, `lib/plans.ts`.
- Auth: `lib/auth.ts` (betterAuth + mongo adapter + `admin()` plugin), client `lib/auth-client.ts` (`inferAdditionalFields<typeof auth>()`), route handler `app/api/auth/[...all]/route.ts`. `lib/core/server.ts` exports `getSession` and `requireRole(role)` (redirects to `/unauthorized`); most dashboard pages do their own inline `auth.api.getSession` role check instead.
- Dashboard: shell `app/dashboard/layout.tsx` (`SidebarProvider` + `SidebarInset` needs `min-w-0` so wide tables don't widen the page). Sidebar is `app/component/RecruiterDashboard/DashboardSidebar.tsx` with `menuItemByRole: Record<Role, MenuItem[]>` using `{ id, name, url, icon }`; role comes from `session.user.role`. Several sidebar URLs (`/dashboard/seeker/jobs`, `/dashboard/*/billing`/`settings`, `/dashboard/admin/companies|jobs|payments`, public `/jobs` `/companies` `/pricing`) have no pages yet — routes/features follow `../../hireloop-resources/Project requirements.md` (and `hireloop.fig`), the requirements source of truth.
- New job form: `app/dashboard/recruiter/jobs/new/page.tsx` (client) renders the reusable `app/component/RecruiterJobs/JobForm.tsx`; one flat `JobFormData` state + `handleSubmit` with `REQUIRED_FIELDS` validation, then `createJob` (`lib/actions/jobs.ts`) and a `sonner` toast. No react-hook-form/zod. Free-plan gate: recruiters are capped at 5 active posts (`FREE_JOB_POST_LIMIT`) unless `isUserPremium` (backend `GET /users/:id/premium`; returns `false` on any fetch failure — fail-closed), which redirects to `/payment?role=recruiter&plan=growth`.
- Payments: `/payment` → POST `app/api/checkout_sessions` (role via `?role=` query param picks between two hardcoded Stripe Price IDs in that route) → Stripe Checkout (`mode: "payment"`) → `/payment/success?session_id=` → `paymentCheckOutVerify` (`lib/actions/payments.ts`) posts the sessionId to the backend for verification (never throws to the success page). Stripe server client: `lib/stripe.ts` (`server-only`, needs `STRIPE_SECRET_KEY`).
- Job details narrative text (responsibilities/qualifications/company overview) comes from static `lib/jobDetailsData/job-details-data.ts`, not the backend.
- Admin users page (`app/dashboard/admin/users/page.tsx`, Server Component) lists users via better-auth admin API (`auth.api.listUsers` in `lib/api/users.server.ts`, returns `{ users, total }`); role updates go through the Express backend (`UpdateUserRole` in `lib/api/users.ts`).

## Tooling quirks

- Tailwind CSS v4 via `@tailwindcss/postcss`; design tokens in `app/globals.css` (`@import "tailwindcss"`).
- Prettier: no semicolons, double quotes, LF, 80 col, tailwind plugin (`tailwindStylesheet: app/globals.css`, `tailwindFunctions: ["cn", "cva"]`).
- `cn` from `@/lib/utils` (re-exports the `cn` package); imports use the `@/*` alias.

## Auth & security flow

- Anything imported (even indirectly) by a `"use client"` file must never import `next/headers`, use `"use server"`, or touch server-only SDKs (`mongodb`, `stripe`). That's why `lib/core/server.ts` (server `authFetch` — token via `next/headers` cookies; `getToken` redirects to `/unauthorized` when signed out) and `lib/core/client.ts` (browser-safe `authFetch` — token via `authClient.getSession()`) exist separately.
- `lib/actions/applications.ts` is a `"use server"` module: its exports are Server Actions (RPC) callable from client pages, and its bodies run on the Next server — so it must use the **server** `authFetch`; the client one finds no cookies there and silently sends no header.
- Backend `verifyToken` middleware (`../hireloop-server/index.js`) protects `GET /applications`: looks up the Bearer token in better-auth's `session` collection (401 without it) and returns 403 when the job's `recruiterId` ≠ session user. Caveat: `GET /applications` without `jobId` is effectively open to any logged-in user (returns everything).
- Role guards live in `app/dashboard/{seeker,recruiter,admin}/layout.tsx` via `requireRole` — layouts must be `layout.tsx`, not `layout/page.tsx` (the latter is just a page at `/dashboard/<role>/layout`).
- `app/(auth)/sign-in/page.tsx` wraps its form in `<Suspense>` because it calls `useSearchParams()` during static prerendering; removing the wrapper breaks `npm run build`.

## Known lint gotcha

- `npm run lint` currently errors on `hooks/use-mobile.ts` (`react-hooks/set-state-in-effect`, pre-existing). `typecheck`, `format`, and `build` still pass. Do not assume the whole repo lints clean.

## Generated / do not edit

- `.next/`, `out/`, `build/`, `node_modules/`, `next-env.d.ts` — generated or ignored; never edit `next-env.d.ts`.
- `CLAUDE.md` is a one-line reference to this file (`@AGENTS.md`).
