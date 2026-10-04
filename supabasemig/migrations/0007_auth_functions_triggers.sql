-- 0009_auth_functions_triggers.sql
-- Functions and triggers that keep the profile schema consistent.
--
--   1. set_updated_at()             — generic trigger to bump updated_at
--   2. auth_user_role()             — returns the calling user's role; used in RLS
--   3. auth_user_status()           — returns the calling user's status; used in RLS
--   4. auth_customer_verification() — returns the calling customer's verification
--                                      state; used in RLS
--   5. auth_is_admin()              — convenience wrapper around auth_user_role()
--   6. handle_new_user()            — auto-create profiles row on auth.users insert
--   7. handle_profile_role_sync()   — ensure the matching *_profiles row exists,
--                                      drop stale ones when role changes
--
-- Security model:
--   • SECURITY DEFINER functions are owned by postgres so they bypass RLS
--     during the trigger flow; their bodies are tightly scoped.
--   • search_path is pinned to empty to neutralise search_path attacks.

-- ─── 1. updated_at bumper ──────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- attach to every table that has an updated_at column
do $$
declare t text;
begin
  foreach t in array array[
    'profiles',
    'admin_profiles',
    'customer_profiles',
    'applicant_profiles'
  ] loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format(
      'create trigger set_updated_at before update on public.%I
         for each row execute function public.set_updated_at()',
      t
    );
  end loop;
end $$;

-- ─── 2. auth_user_role() ───────────────────────────────────────────────────
-- Reads the role of the currently-authenticated user. Used inside RLS
-- policies so they read naturally. SECURITY DEFINER + pinned search_path
-- so RLS on profiles does not recursively block the lookup.
create or replace function public.auth_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ─── 3. auth_user_status() ─────────────────────────────────────────────────
-- Same rationale as auth_user_role(): a plain subquery against profiles from
-- inside a policy defined on profiles itself makes Postgres re-apply that
-- policy to the subquery, which recurses ("infinite recursion detected in
-- policy for relation \"profiles\""). SECURITY DEFINER sidesteps that the
-- same way auth_user_role() already does.
create or replace function public.auth_user_status()
returns public.user_status
language sql
stable
security definer
set search_path = ''
as $$
  select status from public.profiles where id = auth.uid();
$$;

-- ─── 4. auth_customer_verification() ───────────────────────────────────────
-- Same rationale, for customer_profiles_update_self's immutability check on
-- verified/verified_at/verified_by (0008_role_profiles.sql) — a raw subquery
-- against customer_profiles from inside a policy on customer_profiles itself
-- recurses the same way a profiles self-reference does.
create or replace function public.auth_customer_verification()
returns table (verified boolean, verified_at timestamptz, verified_by uuid)
language sql
stable
security definer
set search_path = ''
as $$
  select verified, verified_at, verified_by
  from public.customer_profiles
  where id = auth.uid();
$$;

-- ─── 5. auth_is_admin() ────────────────────────────────────────────────────
create or replace function public.auth_is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.auth_user_role() = 'admin', false);
$$;

-- ─── 6. handle_new_user() ──────────────────────────────────────────────────
-- Fires after a row is inserted into auth.users (i.e. user signs up or is
-- created in the dashboard). Creates the matching profiles row. Initial role
-- is taken from raw_user_meta_data->>'role' if present and valid, else
-- 'applicant'.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta_role text;
  resolved_role public.user_role;
begin
  meta_role := new.raw_user_meta_data ->> 'role';

  if meta_role in ('admin', 'customer', 'applicant') then
    resolved_role := meta_role::public.user_role;
  else
    resolved_role := 'applicant'::public.user_role;
  end if;

  insert into public.profiles (id, role, email, full_name, consent_version, consent_given_at)
  values (
    new.id,
    resolved_role,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'consent_version',
    nullif(new.raw_user_meta_data ->> 'consent_given_at', '')::timestamptz
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── 7. handle_profile_role_sync() ─────────────────────────────────────────
-- After an insert or a role update on profiles, ensure the right
-- *_profiles row exists, and remove rows in tables for roles the user no
-- longer holds. Keeps the per-role tables in lockstep with profiles.role.
create or replace function public.handle_profile_role_sync()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Insert the matching role-detail row (no-op if it already exists).
  if new.role = 'admin' then
    insert into public.admin_profiles (id) values (new.id) on conflict (id) do nothing;
  elsif new.role = 'customer' then
    insert into public.customer_profiles (id) values (new.id) on conflict (id) do nothing;
  elsif new.role = 'applicant' then
    insert into public.applicant_profiles (id) values (new.id) on conflict (id) do nothing;
  end if;

  -- On role change, drop the stale role-detail row.
  if tg_op = 'UPDATE' and old.role is distinct from new.role then
    if old.role = 'admin'     then delete from public.admin_profiles     where id = new.id; end if;
    if old.role = 'customer'  then delete from public.customer_profiles  where id = new.id; end if;
    if old.role = 'applicant' then delete from public.applicant_profiles where id = new.id; end if;
  end if;

  return new;
end;
$$;

drop trigger if exists on_profile_role_sync on public.profiles;
create trigger on_profile_role_sync
  after insert or update of role on public.profiles
  for each row execute function public.handle_profile_role_sync();
