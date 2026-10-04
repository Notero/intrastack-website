# Intrastack Website

The public marketing site and authenticated web app for Intrastack Solutions
(an IT/cloud consulting and staffing company). It's two things in one Next.js
app:

1. **A public marketing site** — home, about (leadership, advisors,
   certifications, delivery centers, mission/vision, partners, life at
   Intrastack), services, solutions, industries, careers, news (blog posts,
   press releases, trend pieces, whitepapers, client stories), pricing, and
   contact, plus the standard auth flows (login, register, forgot/reset
   password, email confirmation).
2. **An authenticated dashboard** at `/admin`, `/customer`, and `/applicant`,
   gated by a `role` column (`admin | customer | applicant`) on the
   Supabase-backed user profile — see `src/lib/auth/roles.ts`. It's a staffing
   workflow: customers post jobs and review candidates, applicants apply and
   manage their profile/resume, and admins manage all of it (users, leads,
   leadership content, news, support tickets, audit log, GDPR data
   export/delete, feature flags).

## Tech stack

- **Next.js 16** (App Router) + **React 19**, TypeScript, Tailwind CSS v4,
  shadcn/radix UI components.
- **Supabase** (`@supabase/ssr`, `@supabase/supabase-js`) for auth, Postgres,
  storage, and row-level security. Schema lives in `supabasemig/migrations`
  (27 migrations) with separate seed data in `supabasemig/seed`.
- **Resend** for transactional email (`src/lib/email/resend.ts`).
- **Upstash Redis** (`@upstash/ratelimit`) for rate limiting
  (`src/lib/rateLimit.ts`); rate limiting is simply disabled in dev if the
  Upstash env vars aren't set, rather than failing.
- **`@anthropic-ai/sdk`** powers the resume parsing/matching assistant
  (`src/lib/resume/*`) — see "What's real vs. stubbed" below.
- **Groq** powers the marketing-site chat widget's backend
  (`src/app/api/chat/chat/route.ts`).
- **Playwright** for both unit-style and end-to-end tests (details below).
- **Lighthouse** (via `lighthouse` + `chrome-launcher`) for automated
  performance/accessibility/SEO audits (`scripts/audit-lighthouse.mjs`).
- Deployed on **Vercel** (`vercel.json` configures a monthly cron for the
  data-retention purge route).

## Testing

This repo runs two independent Playwright setups against the same test
directory tree (`tests/`), split by what they exercise:

- **Unit tests** (`tests/unit/*.spec.ts`, config: `playwright.config.ts`) —
  plain Playwright-as-a-test-runner specs (no browser) for pure
  logic/modules: role checks, validation, SEO schema generation, the resume
  parsing/matching stubs, rate limiting, Resend wrapper, retention-purge auth,
  and direct Supabase DB-layer functions. Run with `pnpm test:unit`; view the
  last HTML report with `pnpm test:unit:report`.
- **End-to-end tests** (`tests/e2e/*.spec.ts`, config:
  `playwright.e2e.config.ts`) — real-browser tests against a running
  `pnpm dev` server backed by a **real Supabase dev project** (not mocked).
  `tests/e2e/global-setup.ts` creates a fresh applicant user per run, logs in
  as admin/customer/applicant with Playwright's `storageState`, and
  `global-teardown.ts` deletes the applicant user afterwards. These cover
  login/register and a full application-flow walkthrough, plus the chat
  widget. The suite is intentionally run with `workers: 1` because every spec
  shares one dev server and one Supabase project. Run with `pnpm test:e2e`;
  view the report with `pnpm test:e2e:report`.
  - Requires `.env.local` with real Supabase credentials and
    `E2E_ADMIN_EMAIL`/`E2E_ADMIN_PASSWORD`/`E2E_CUSTOMER_EMAIL`/`E2E_CUSTOMER_PASSWORD`
    for pre-existing admin/customer accounts in that project (see
    `.env.example`).
  - Playwright auth state (`tests/e2e/.auth/*.json`, containing live session
    tokens) and run state (`tests/e2e/.state/`) are generated per-run and are
    gitignored — they are never meant to be committed.

**Lighthouse audits** (`pnpm audit:lighthouse`) run against every URL in
`/sitemap.xml` (or specific paths passed as arguments), scoring performance,
accessibility, best-practices, and SEO, and failing (non-zero exit) if any
page scores below `LIGHTHOUSE_MIN_SCORE` (default 90). Reports are written to
`scripts/lighthouse-reports/` as timestamped HTML+JSON pairs; that directory
is gitignored and regenerated on each run, so a fresh clone starts without any
reports.

## Running it locally

```bash
pnpm install
cp .env.example .env.local   # fill in real Supabase/Resend/Upstash/etc. values
pnpm dev                     # http://localhost:3000
```

Other scripts (see `package.json`):

```bash
pnpm build                  # production build
pnpm start                  # run the production build
pnpm lint                   # eslint
pnpm test:unit              # unit-style Playwright specs
pnpm test:unit:report       # open the last unit test HTML report
pnpm test:e2e                # real-browser e2e specs (needs a running dev server + Supabase dev project)
pnpm test:e2e:report          # open the last e2e HTML report
pnpm audit:lighthouse        # Lighthouse audit against BASE_URL (defaults to localhost:3000)
pnpm gen:types                # regenerate src/lib/supabase/database.types.ts from the linked Supabase project
```

Database schema and seed data live under `supabasemig/` — apply the files in
`supabasemig/migrations/` in order against your own Supabase project, then
optionally run the scripts in `supabasemig/seed/` (all seed data — news
items, applicant records, the admin-promotion script — uses placeholder
`@test.com`/`@example.com` accounts and fictional companies, e.g. "MegaCorp").

## What's real vs. scaffolded

- The resume parsing/matching feature (`src/lib/resume/`) works fully, but
  **falls back to a deterministic stub** when `ANTHROPIC_API_KEY` is unset —
  this is intentional (see the doc comments in `src/lib/resume/parse.ts` and
  `match.ts`), not a placeholder left in by mistake. Set the key to get live
  Claude-backed parsing.
- Rate limiting (`src/lib/rateLimit.ts`) is similarly optional in dev: unset
  Upstash env vars just disable it with a console warning instead of
  throwing.
- Everything else (auth, dashboards, job postings, applications, tickets,
  notifications, GDPR export/delete, audit log) is fully wired to Supabase —
  there's no mock data layer behind the dashboard.

## Notes for anyone reviewing this before/after publishing

- Supabase row-level security policies are defined in the migrations under
  `supabasemig/migrations/` — review them if you're standing up your own
  project from this schema.
- The marketing content (team bios, news/press items, service/solution copy)
  reflects Intrastack's own public-facing site content.
