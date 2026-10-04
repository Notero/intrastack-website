-- 0025_leads.sql
-- Leads system — unified lead pool across all capture surfaces.

-- Enum for lead source so the admin dashboard can filter by origin
do $$ begin
  create type lead_source as enum (
    'contact_form',
    'whitepaper_download',
    'newsletter_signup'
  );
exception when duplicate_object then null; end $$;

-- Whitepaper download leads — slim table for gated content captures
create table if not exists public.whitepaper_leads (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  email           text not null,
  intent          text,           -- optional free-text "what are you looking for?"
  news_item_slug  text not null,  -- which whitepaper triggered the gate
  news_item_title text,           -- denormalized for admin readability
  consent_given   boolean not null default false,
  consent_version text,
  consent_given_at timestamptz,
  constraint whitepaper_leads_email_check check (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$')
);

alter table public.whitepaper_leads enable row level security;

drop policy if exists "whitepaper_leads anon insert" on public.whitepaper_leads;
create policy "whitepaper_leads anon insert"
  on public.whitepaper_leads for insert
  with check (true);

drop policy if exists "whitepaper_leads admin read" on public.whitepaper_leads;
create policy "whitepaper_leads admin read"
  on public.whitepaper_leads for select
  using (public.auth_is_admin());

-- ─── Unified leads view ─────────────────────────────────────────────────────
-- Pools contact_form_leads + whitepaper_leads into a single feed.
-- Admins query this view; no direct table manipulation needed.

create or replace view public.leads_pool as
  select
    id,
    created_at,
    'contact_form'::lead_source as source,
    work_email                  as email,
    full_name                   as name,
    null::text                  as intent,
    null::text                  as resource_slug,
    null::text                  as resource_title,
    message                     as notes,
    status::text                as status
  from public.contact_form_leads

  union all

  select
    id,
    created_at,
    'whitepaper_download'::lead_source as source,
    email,
    null::text                         as name,
    intent,
    news_item_slug                     as resource_slug,
    news_item_title                    as resource_title,
    null::text                         as notes,
    'new'::text                        as status
  from public.whitepaper_leads;

-- Grant admin read on the view (RLS on underlying tables handles auth)
grant select on public.leads_pool to authenticated;
