-- 0030_meetings.sql
-- Applicant interview meetings.
-- An applicant whose application has reached the 'interview' stage can propose
-- a meeting; the customer (job poster) or admin confirms/cancels/completes it.

-- ─── Enum ───────────────────────────────────────────────────────────────────

do $$ begin
  create type public.meeting_status as enum (
    'requested',    -- applicant proposed the meeting
    'confirmed',    -- customer/admin accepted
    'completed',    -- meeting took place
    'cancelled',    -- either party cancelled
    'onboarding'    -- onboarding-related meeting
  );
exception when duplicate_object then null; end $$;

-- ─── Table ──────────────────────────────────────────────────────────────────

create table if not exists public.meetings (
  id                uuid            primary key default gen_random_uuid(),
  created_at        timestamptz     not null default now(),

  application_id    uuid            not null references public.applications(id) on delete cascade,
  job_post_id       uuid            not null references public.job_posts(id)    on delete cascade,
  applicant_id      uuid            not null references auth.users(id)          on delete cascade,
  customer_id       uuid            not null references auth.users(id)          on delete cascade,

  proposed_at       timestamptz,                          -- date/time proposed by applicant
  scheduled_at      timestamptz,                          -- confirmed date/time (set on confirm)
  duration_minutes  int             not null default 30,
  meeting_link      text,
  notes             text,
  status            public.meeting_status not null default 'requested'
);

-- ─── Indexes ────────────────────────────────────────────────────────────────

create index if not exists meetings_applicant_idx    on public.meetings (applicant_id, created_at desc);
create index if not exists meetings_customer_idx     on public.meetings (customer_id,  created_at desc);
create index if not exists meetings_application_idx  on public.meetings (application_id);

-- ─── RLS ────────────────────────────────────────────────────────────────────

alter table public.meetings enable row level security;

-- Applicant can see their own meetings
drop policy if exists "meetings_select_own_applicant" on public.meetings;
create policy "meetings_select_own_applicant"
  on public.meetings for select
  using (applicant_id = auth.uid());

-- Customer can see meetings for their job posts
drop policy if exists "meetings_select_own_customer" on public.meetings;
create policy "meetings_select_own_customer"
  on public.meetings for select
  using (customer_id = auth.uid());

-- Admin can see all meetings
drop policy if exists "meetings_select_admin" on public.meetings;
create policy "meetings_select_admin"
  on public.meetings for select
  using (public.auth_is_admin());

-- Applicant can insert meetings (must own the row)
drop policy if exists "meetings_insert_applicant" on public.meetings;
create policy "meetings_insert_applicant"
  on public.meetings for insert
  with check (applicant_id = auth.uid());

-- Customer can update status on their meetings
drop policy if exists "meetings_update_customer" on public.meetings;
create policy "meetings_update_customer"
  on public.meetings for update
  using (customer_id = auth.uid())
  with check (customer_id = auth.uid());

-- Admin can update any meeting
drop policy if exists "meetings_update_admin" on public.meetings;
create policy "meetings_update_admin"
  on public.meetings for update
  using (public.auth_is_admin())
  with check (public.auth_is_admin());
