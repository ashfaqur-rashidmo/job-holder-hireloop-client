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

- `.env` is gitignored but required locally: it must define `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and `BETTER_AUTH_DB_URI` (shape in the existing `.env`; use `http://localhost:3000` and `mongodb://localhost:27017` locally).
- better-auth connects to MongoDB via `BETTER_AUTH_DB_URI` (db `hireloopdb`) — a local MongoDB must be running for auth to work.
- GitHub social login additionally needs `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`.
- Sign-up includes an account-type selection (seeker / recruiter / admin) sent as the `role` additional field to better-auth `signUp.email`. Uses `sonner` for success/error toasts (`toast.success` / `toast.error`).
- Auth pages (`/sign-in`, `/sign-up`) redirect to `/` when a session already exists (checked via `authClient.useSession()`).

## Architecture

- Next.js 16 App Router: `app/layout.tsx` (root), `app/page.tsx` (renders `HeroSection`), API routes under `app/api`.
- Hero section: `components/Hero-Section.tsx` (badge + job search + trending roles + globe background + 4 stat cards at bottom). References `public/images/globe.png` (1440×1882 portrait; earth sits ~34–71% down the image). The image is anchored to the hero bottom and top-masked below `lg`; `public/images/cta-bg.png` exists but isn't referenced in source.
- Navbar: `components/navbar.tsx` (responsive, rendered in `app/layout.tsx`). Nav links always visible; when logged in shows "Welcome, {name}" + Sign Out button; when logged out shows Sign In / Get Started buttons. Returns `null` on `/dashboard/*` so the dashboard keeps its own shell.
- Dashboard: `app/dashboard/{seeker,recruiter,admin}/page.tsx`, shell in `app/dashboard/layout.tsx` (`SidebarProvider` + `SidebarInset`), sidebar in `app/component/DashboardSidebar.tsx` (note: `component`, not `components`). Role menus live in its `menuItemByRole: Record<Role, MenuItem[]>` using `{ id, name, url, icon }`; role comes from `session.user.role` ("seeker" | "recruiter" | "admin").
- Auth: server `lib/auth.ts` (betterAuth + `@better-auth/mongo-adapter`), client `lib/auth-client.ts` (`createAuthClient` + `inferAdditionalFields<typeof auth>()`), route handler `app/api/auth/[...all]/route.ts`.
- Imports: `@/*` alias; shadcn/base-ui at `@/components/ui` (button, input, separator, sidebar, sheet, skeleton, tooltip); `cn` from `@/lib/utils` (re-exports the `cn` package).
- Tailwind CSS v4 via `@tailwindcss/postcss`; design tokens in `app/globals.css` (`@import "tailwindcss"`). Prettier uses the tailwind plugin with `tailwindStylesheet: app/globals.css` and `tailwindFunctions: ["cn", "cva"]`.
- Route/feature source of truth: `Module-50/hireloop-resources/Project requirements.md` (and `hireloop.fig`). Dashboard paths there (`/dashboard/seeker/jobs`, `/dashboard/admin/users`, etc.) drive the sidebar links.

## Known lint gotcha

- `npm run lint` currently errors on `hooks/use-mobile.ts` (`react-hooks/set-state-in-effect`, pre-existing). `typecheck`, `format`, and `build` still pass. Do not assume the whole repo lints clean.

## Generated / do not edit

- `.next/`, `out/`, `build/`, `node_modules/`, `next-env.d.ts` — generated or ignored; never edit `next-env.d.ts`.
- `CLAUDE.md` is a one-line reference to this file (`@AGENTS.md`).
