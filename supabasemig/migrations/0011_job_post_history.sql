-- 0017_job_post_history.sql
-- Immutable audit log for job listing outcomes.
--
-- A row is written whenever a job moves out of the active workflow:
--   'approved'  — admin approved; job stays in job_posts (published=true)
--   'rejected'  — admin rejected; job deleted from job_posts
--   'withdrawn' — customer withdrew pending listing; job deleted from job_posts
--
-- Stores a full snapshot of the listing at the time of the action so the
-- history remains readable even after the original row is gone.

do $$ begin
  create type public.job_outcome as enum ('approved', 'rejected', 'withdrawn');
exception when duplicate_object then null; end $$;

create table if not exists public.job_post_history (
  id              uuid        primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),

  -- Link back to the original row (nullable — row may have been deleted)
  job_post_id     uuid,

  -- Who submitted it (customer who posted the job)
  recruiter_id    uuid        references public.profiles(id) on delete set null,

  -- Snapshot of the listing at outcome time
  title           text        not null,
  team            text,
  location        text        not null,
  remote          boolean     not null default false,
  employment_type public.employment_type not null,
  seniority       text,
  salary_range    text,
  short_description text      not null,
  description     text,
  responsibilities text[],
  requirements     text[],
  nice_to_have     text[],
  tags            text[],

  -- Outcome
  outcome         public.job_outcome not null,
  outcome_at      timestamptz not null default now(),
  outcome_by      uuid        references public.profiles(id) on delete set null,
  reason          text
);

create index if not exists job_post_history_customer_idx  on public.job_post_history (recruiter_id, outcome_at desc);
create index if not exists job_post_history_outcome_idx   on public.job_post_history (outcome);
create index if not exists job_post_history_job_post_idx  on public.job_post_history (job_post_id);

alter table public.job_post_history enable row level security;

-- Customer can read their own history
drop policy if exists "job_post_history_customer_select" on public.job_post_history;
create policy "job_post_history_customer_select"
  on public.job_post_history for select
  using (recruiter_id = auth.uid() and public.auth_user_role() = 'customer');

-- Admin can read all history
drop policy if exists "job_post_history_admin_select" on public.job_post_history;
create policy "job_post_history_admin_select"
  on public.job_post_history for select
  using (public.auth_is_admin());

-- Only the server (via service role / admin) can insert
drop policy if exists "job_post_history_admin_insert" on public.job_post_history;
create policy "job_post_history_admin_insert"
  on public.job_post_history for insert
  with check (public.auth_is_admin());
