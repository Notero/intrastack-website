-- 0008_role_profiles.sql
-- Per-role detail tables. 1:1 with profiles; rows are created/removed by the
-- role-change trigger defined in 0009. Each is keyed by the same uuid so
-- joins are trivial and there is no second identifier to keep in sync.

-- ─── admin_profiles ────────────────────────────────────────────────────────
create table if not exists public.admin_profiles (
  id          uuid primary key references public.profiles(id) on delete cascade,
  department  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── customer_profiles ─────────────────────────────────────────────────────
-- Customers post jobs and manage listings; the verified flag is set by admin.
create table if not exists public.customer_profiles (
  id           uuid primary key references public.profiles(id) on delete cascade,
  company_name text,
  title        text,
  linkedin_url text,
  verified     boolean     not null default false,
  verified_at  timestamptz,
  verified_by  uuid        references public.profiles(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists customer_profiles_verified_idx on public.customer_profiles (verified);

-- ─── applicant_profiles ────────────────────────────────────────────────────
create table if not exists public.applicant_profiles (
  id                uuid primary key references public.profiles(id) on delete cascade,
  headline          text,
  bio               text,
  location          text,
  years_experience  int,
  current_title     text,
  current_company   text,
  linkedin_url      text,
  github_url        text,
  portfolio_url     text,
  resume_url        text,           -- Supabase Storage path
  open_to_work      boolean     not null default true,
  skills            text[]      not null default '{}',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists applicant_profiles_open_to_work_idx on public.applicant_profiles (open_to_work);
create index if not exists applicant_profiles_skills_gin       on public.applicant_profiles using gin (skills);

-- ─── RLS ────────────────────────────────────────────────────────────────────
-- Same pattern on every table:
--   SELECT — own row, or admin
--   UPDATE — own row, or admin
--   INSERT — own row or admin (trigger handles normal flow; own-row allows
--            upsert fallback for edge cases, e.g. users created before trigger)
--   DELETE — admin only
--
-- Exception: customer_profiles.verified / verified_at / verified_by are
-- restricted to admins via a column-check inside the self-update policy.

-- ─── admin_profiles ────────────────────────────────────────────────────────
alter table public.admin_profiles enable row level security;

drop policy if exists admin_profiles_select on public.admin_profiles;
create policy admin_profiles_select on public.admin_profiles for select
  using (id = auth.uid() or public.auth_is_admin());

drop policy if exists admin_profiles_update on public.admin_profiles;
create policy admin_profiles_update on public.admin_profiles for update
  using (id = auth.uid() or public.auth_is_admin())
  with check (id = auth.uid() or public.auth_is_admin());

drop policy if exists admin_profiles_insert on public.admin_profiles;
create policy admin_profiles_insert on public.admin_profiles for insert
  with check (public.auth_is_admin());

drop policy if exists admin_profiles_delete on public.admin_profiles;
create policy admin_profiles_delete on public.admin_profiles for delete
  using (public.auth_is_admin());

-- ─── customer_profiles ─────────────────────────────────────────────────────
alter table public.customer_profiles enable row level security;

drop policy if exists customer_profiles_select on public.customer_profiles;
create policy customer_profiles_select on public.customer_profiles for select
  using (id = auth.uid() or public.auth_is_admin());

-- Self-update: customer can edit their own row but not the verification
-- columns. Those stay as-was unless the editor is admin.
-- Compares against auth_customer_verification() rather than a plain subquery
-- against customer_profiles — a subquery here would make Postgres re-apply
-- customer_profiles' own RLS to itself while already evaluating this policy
-- ("infinite recursion detected in policy for relation \"customer_profiles\"").
drop policy if exists customer_profiles_update_self on public.customer_profiles;
create policy customer_profiles_update_self on public.customer_profiles for update
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and verified    is not distinct from (select verified    from public.auth_customer_verification())
    and verified_at is not distinct from (select verified_at from public.auth_customer_verification())
    and verified_by is not distinct from (select verified_by from public.auth_customer_verification())
  );

drop policy if exists customer_profiles_update_admin on public.customer_profiles;
create policy customer_profiles_update_admin on public.customer_profiles for update
  using (public.auth_is_admin())
  with check (public.auth_is_admin());

drop policy if exists customer_profiles_insert on public.customer_profiles;
create policy customer_profiles_insert on public.customer_profiles for insert
  with check (id = auth.uid() or public.auth_is_admin());

drop policy if exists customer_profiles_delete on public.customer_profiles;
create policy customer_profiles_delete on public.customer_profiles for delete
  using (public.auth_is_admin());

-- ─── applicant_profiles ────────────────────────────────────────────────────
alter table public.applicant_profiles enable row level security;

drop policy if exists applicant_profiles_select on public.applicant_profiles;
create policy applicant_profiles_select on public.applicant_profiles for select
  using (id = auth.uid() or public.auth_is_admin());

drop policy if exists applicant_profiles_update on public.applicant_profiles;
create policy applicant_profiles_update on public.applicant_profiles for update
  using (id = auth.uid() or public.auth_is_admin())
  with check (id = auth.uid() or public.auth_is_admin());

-- Own-row insert: trigger handles the normal flow; this allows upsert fallback
-- for edge cases (e.g. users created before trigger was deployed).
drop policy if exists applicant_profiles_insert on public.applicant_profiles;
create policy applicant_profiles_insert on public.applicant_profiles for insert
  with check (id = auth.uid() or public.auth_is_admin());

drop policy if exists applicant_profiles_delete on public.applicant_profiles;
create policy applicant_profiles_delete on public.applicant_profiles for delete
  using (public.auth_is_admin());
