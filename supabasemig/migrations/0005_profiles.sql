-- 0007_profiles.sql
-- Core profile table. One row per auth.users row, keyed by the same uuid.
-- Holds the fields every user has regardless of role.

create extension if not exists "citext";

-- NOTE: 'recruiter' remains in user_role for backwards compatibility.
-- Postgres cannot drop an enum value without a full type rebuild.
-- All recruiter users were migrated to 'customer' in 0026. The value
-- is unused and safe to ignore.
do $$ begin
  create type public.user_role as enum ('admin', 'customer', 'recruiter', 'applicant');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.user_status as enum ('active', 'invited', 'suspended', 'deactivated');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  role            public.user_role   not null default 'applicant',
  status          public.user_status not null default 'active',
  email           citext             unique,
  full_name       text,
  display_name    text,
  avatar_url      text,
  phone           text,
  locale          text               not null default 'en',
  timezone        text               not null default 'UTC',
  last_sign_in_at timestamptz,
  metadata        jsonb              not null default '{}'::jsonb,
  -- RTR (Right-to-Represent) e-signature: set once the applicant signs.
  signed_for_representation boolean not null default false,
  -- GDPR/CCPA consent, captured at /register.
  consent_version   text,
  consent_given_at  timestamptz,
  -- Employer attachment: set once every required onboarding document for an
  -- application is accepted (see 0032_onboarding_documents.sql).
  employer_id     uuid references auth.users(id) on delete set null,
  employer_since  timestamptz,
  created_at      timestamptz        not null default now(),
  updated_at      timestamptz        not null default now()
);

create index if not exists profiles_role_idx   on public.profiles (role);
create index if not exists profiles_status_idx on public.profiles (status);
create index if not exists profiles_email_idx  on public.profiles (email);

comment on table  public.profiles is 'One row per auth user; the canonical app-side identity record.';
comment on column public.profiles.role     is 'Drives post-login routing and RLS.';
comment on column public.profiles.status   is 'Lifecycle: active | invited | suspended | deactivated.';
comment on column public.profiles.metadata is 'Free-form JSON for ad-hoc per-user flags.';

-- ─── RLS ────────────────────────────────────────────────────────────────────
-- Policy summary:
--   SELECT — own row, admin sees all, a customer sees applicants who applied
--            to one of their job posts, and an employer sees their employees
--   UPDATE — own row (but cannot change role or status), or admin (anything)
--   INSERT — admin only (normal flow is the auth.users trigger, which is
--            SECURITY DEFINER and bypasses RLS)
--   DELETE — admin only

alter table public.profiles enable row level security;

drop policy if exists profiles_select_self_or_admin on public.profiles;
create policy profiles_select_self_or_admin
  on public.profiles for select
  using (id = auth.uid() or public.auth_is_admin());

-- Self-update: users may edit their own row, but role/status are locked
-- so a non-admin cannot self-promote. Compares against auth_user_role()/
-- auth_user_status() rather than a plain subquery against profiles — a
-- subquery here would make Postgres re-apply profiles' own RLS to itself
-- while already evaluating this policy ("infinite recursion detected in
-- policy for relation \"profiles\""), which is also why this UPDATE's
-- combined WITH CHECK (OR'd with profiles_update_admin below) broke admin
-- edits of other users' profiles, not just self-edits.
drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self
  on public.profiles for update
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and role   = public.auth_user_role()
    and status = public.auth_user_status()
  );

-- Admin update: anything goes.
drop policy if exists profiles_update_admin on public.profiles;
create policy profiles_update_admin
  on public.profiles for update
  using (public.auth_is_admin())
  with check (public.auth_is_admin());

drop policy if exists profiles_insert_admin on public.profiles;
create policy profiles_insert_admin
  on public.profiles for insert
  with check (public.auth_is_admin());

drop policy if exists profiles_delete_admin on public.profiles;
create policy profiles_delete_admin
  on public.profiles for delete
  using (public.auth_is_admin());

-- NOTE: profiles_select_customer_applicant (customer sees an applicant's
-- profile once they've applied to one of the customer's job posts) lives in
-- 0020_applications.sql instead of here — it depends on public.applications,
-- which doesn't exist yet at this point in migration order.

-- Customer: view the profile of an applicant employed by them.
drop policy if exists "profiles_customer_select_employee" on public.profiles;
create policy "profiles_customer_select_employee"
  on public.profiles
  for select
  using (employer_id = auth.uid());
