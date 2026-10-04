-- 0026_recruiter_to_customer.sql
-- Collapse the recruiter role into customer.
-- Customers are recruiters — a single "customer" role replaces both.
--
-- Safe to run on both:
--   • Existing databases (with old recruiter_profiles / subscription customer_profiles)
--   • Fresh databases (where 0008 already created the correct customer_profiles)

-- 1. Migrate all recruiter users to the customer role
update public.profiles
set role = 'customer'
where role = 'recruiter';

-- 2. Drop the old subscription-based customer_profiles if it still exists
--    (created by the original 0008 before the rewrite; not present on fresh installs)
do $$
begin
  -- Only drop if it has the old subscription_tier column (i.e. the legacy table)
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'customer_profiles'
      and column_name  = 'subscription_tier'
  ) then
    drop table public.customer_profiles cascade;
  end if;
end $$;

-- 3. Rename recruiter_profiles → customer_profiles if it still exists
--    (present on existing databases; not present on fresh installs)
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'recruiter_profiles'
  ) then
    alter table public.recruiter_profiles rename to customer_profiles;
  end if;
end $$;

-- NOTE: The 'recruiter' value remains in the user_role enum. Postgres cannot
-- drop enum values without a full type rebuild. It is unused after this migration.
