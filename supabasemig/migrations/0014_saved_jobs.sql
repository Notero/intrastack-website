-- 0021_saved_jobs.sql
-- Bookmarked job posts for applicants ("save for later").
-- Simple join table; no status or workflow — a row either exists or it doesn't.

create table if not exists public.saved_jobs (
  id           uuid        primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),   -- when the applicant saved it

  applicant_id uuid        not null references auth.users(id) on delete cascade,
  job_post_id  uuid        not null references public.job_posts(id) on delete cascade,

  constraint saved_jobs_unique unique (applicant_id, job_post_id)
);

create index if not exists saved_jobs_applicant_idx on public.saved_jobs (applicant_id, created_at desc);
create index if not exists saved_jobs_job_post_idx  on public.saved_jobs (job_post_id);

-- ─── RLS ────────────────────────────────────────────────────────────────────

alter table public.saved_jobs enable row level security;

drop policy if exists "saved_jobs_select_own" on public.saved_jobs;
create policy "saved_jobs_select_own"
  on public.saved_jobs for select
  using (applicant_id = auth.uid() or public.auth_is_admin());

drop policy if exists "saved_jobs_insert_own" on public.saved_jobs;
create policy "saved_jobs_insert_own"
  on public.saved_jobs for insert
  with check (applicant_id = auth.uid());

drop policy if exists "saved_jobs_delete_own" on public.saved_jobs;
create policy "saved_jobs_delete_own"
  on public.saved_jobs for delete
  using (applicant_id = auth.uid() or public.auth_is_admin());
