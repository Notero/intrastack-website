-- Leads captured from the public "Reach Us" contact form.
-- Submissions come from the anon role via /api/contact.

create table if not exists public.contact_form_leads (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),

  -- Identity
  full_name          text not null,
  work_email         text not null,
  phone              text,
  company            text,
  job_title          text,
  company_size       text,                    -- '1-10', '11-50', '51-200', '201-1000', '1000+'

  -- Inquiry
  interests          text[] not null default '{}',
  budget_range       text,                    -- '<$25k', '$25-100k', '$100-250k', '$250k+', 'Not sure'
  timeline           text,                    -- 'asap', '1-3m', '3-6m', '6m+', 'exploring'
  message            text not null,

  -- Preferences
  preferred_contact  text,                    -- 'email' | 'phone'
  nda_required       boolean not null default false,
  newsletter_opt_in  boolean not null default false,
  consent_to_contact boolean not null default true,
  consent_version    text,
  consent_given_at   timestamptz,

  -- Tracking
  source_path        text,                    -- referring page on intrastack.com
  utm_source         text,
  utm_medium         text,
  utm_campaign       text,
  user_agent         text,

  -- Workflow (server-managed; clients cannot set these)
  status             text not null default 'new',  -- 'new' | 'contacted' | 'qualified' | 'won' | 'archived'
  assigned_to        text,
  internal_notes     text,

  constraint contact_form_leads_work_email_format
    check (work_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint contact_form_leads_message_length
    check (char_length(message) between 10 and 5000),
  constraint contact_form_leads_full_name_length
    check (char_length(full_name) between 1 and 200),
  constraint contact_form_leads_status_values
    check (status in ('new', 'contacted', 'qualified', 'won', 'archived')),
  constraint contact_form_leads_preferred_contact_values
    check (preferred_contact is null or preferred_contact in ('email', 'phone'))
);

create index if not exists contact_form_leads_created_at_idx
  on public.contact_form_leads (created_at desc);

create index if not exists contact_form_leads_status_idx
  on public.contact_form_leads (status);

create index if not exists contact_form_leads_work_email_idx
  on public.contact_form_leads (lower(work_email));

drop trigger if exists contact_form_leads_set_updated_at on public.contact_form_leads;
create trigger contact_form_leads_set_updated_at
  before update on public.contact_form_leads
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Row-level security
-- ----------------------------------------------------------------------------
alter table public.contact_form_leads enable row level security;

-- Public submissions: anon can INSERT only, and may not set workflow fields.
drop policy if exists "anon insert lead" on public.contact_form_leads;
create policy "anon insert lead"
  on public.contact_form_leads
  for insert
  to anon
  with check (
    status = 'new'
    and assigned_to is null
    and internal_notes is null
  );

-- Authenticated dashboard users can read and update.
drop policy if exists "authenticated read leads" on public.contact_form_leads;
create policy "authenticated read leads"
  on public.contact_form_leads
  for select
  to authenticated
  using (true);

drop policy if exists "authenticated update leads" on public.contact_form_leads;
create policy "authenticated update leads"
  on public.contact_form_leads
  for update
  to authenticated
  using (true)
  with check (true);
