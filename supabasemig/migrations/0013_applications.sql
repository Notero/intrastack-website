-- 0020_applications.sql
-- Tracks every job application an applicant submits.
-- Linked to job_posts; applicant is identified by their auth.users uuid.

do $$ begin
  create type public.application_status as enum (
    'submitted',   -- just applied, no action yet
    'reviewing',   -- recruiter has opened the application
    'interview',   -- moved to interview stage
    'offer',       -- offer extended
    'accepted',    -- offer accepted by applicant
    'rejected',    -- rejected at any stage
    'withdrawn'    -- applicant withdrew the application
  );
exception when duplicate_object then null; end $$;

create table if not exists public.applications (
  id             uuid        primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),   -- when the applicant applied
  updated_at     timestamptz not null default now(),

  applicant_id   uuid        not null references auth.users(id) on delete cascade,
  job_post_id    uuid        not null references public.job_posts(id) on delete cascade,

  status         public.application_status not null default 'submitted',
  cover_letter   text,
  cover_letter_url text,      -- uploaded cover letter file, alongside the typed text field
  resume_url     text,        -- snapshot of resume at time of application

  -- Recruiter-facing fields
  notes          text,        -- internal recruiter notes, not shown to applicant
  reviewed_at    timestamptz,
  reviewed_by    uuid        references public.profiles(id) on delete set null,

  -- Prevent duplicate applications to the same job
  constraint applications_unique_per_job unique (applicant_id, job_post_id)
);

create index if not exists applications_applicant_idx  on public.applications (applicant_id, created_at desc);
create index if not exists applications_job_post_idx   on public.applications (job_post_id);
create index if not exists applications_status_idx     on public.applications (status);

drop trigger if exists applications_set_updated_at on public.applications;
create trigger applications_set_updated_at
  before update on public.applications
  for each row execute function public.set_updated_at();

-- ─── RLS ────────────────────────────────────────────────────────────────────

alter table public.applications enable row level security;

-- Applicant sees only their own applications
drop policy if exists "applications_select_own_or_admin" on public.applications;
create policy "applications_select_own_or_admin"
  on public.applications for select
  using (applicant_id = auth.uid() or public.auth_is_admin());

-- Customer: view applications submitted to their own job posts
drop policy if exists "applications_select_customer" on public.applications;
create policy "applications_select_customer"
  on public.applications
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.job_posts jp
      where jp.recruiter_id = auth.uid()
        and jp.id = public.applications.job_post_id
    )
  );

-- Applicant can submit a new application
drop policy if exists "applications_insert_own" on public.applications;
create policy "applications_insert_own"
  on public.applications for insert
  with check (applicant_id = auth.uid());

-- Applicant can withdraw (update status to 'withdrawn') their own application;
-- admin can update anything (status changes, notes, reviewed_by)
drop policy if exists "applications_update_own_or_admin" on public.applications;
create policy "applications_update_own_or_admin"
  on public.applications for update
  using (applicant_id = auth.uid() or public.auth_is_admin())
  with check (applicant_id = auth.uid() or public.auth_is_admin());

drop policy if exists "applications_delete_admin" on public.applications;
create policy "applications_delete_admin"
  on public.applications for delete
  using (public.auth_is_admin());

-- ─── profiles: customer can view an applicant's profile once they've
-- applied to one of the customer's job posts ────────────────────────────────
-- Lives here (not in 0007_profiles.sql) because it depends on this table.
drop policy if exists "profiles_select_customer_applicant" on public.profiles;
create policy "profiles_select_customer_applicant"
  on public.profiles
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.applications a
      join public.job_posts jp on jp.id = a.job_post_id
      where jp.recruiter_id = auth.uid()
        and a.applicant_id = public.profiles.id
    )
  );
