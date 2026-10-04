-- 0034_chat_leads.sql
-- Leads captured by the website chatbot (ChatWidget -> /api/chat-leads).
-- Anon insert-only, same posture as contact_form_leads / whitepaper_leads.

alter type lead_source add value if not exists 'chatbot';

create table if not exists public.chat_leads (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),

  name         text not null,
  company      text,
  email        text,
  phone        text,
  service      text,          -- service/problem the visitor needs help with
  timeline     text,          -- free-text timeline given in the chat
  message      text,          -- transcript / free-text context from the conversation

  -- Workflow (server-managed; clients cannot set these)
  status       text not null default 'new',   -- 'new' | 'contacted' | 'qualified' | 'won' | 'archived'
  assigned_to  text,
  internal_notes text,

  -- Tracking
  source_path  text,          -- page the chat widget was opened from
  user_agent   text,

  constraint chat_leads_name_length
    check (char_length(name) between 1 and 200),
  constraint chat_leads_email_format
    check (email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint chat_leads_contact_present
    check (email is not null or phone is not null),
  constraint chat_leads_status_values
    check (status in ('new', 'contacted', 'qualified', 'won', 'archived'))
);

alter table public.chat_leads enable row level security;

drop policy if exists "chat_leads anon insert" on public.chat_leads;
create policy "chat_leads anon insert"
  on public.chat_leads for insert
  with check (true);

drop policy if exists "chat_leads admin read" on public.chat_leads;
create policy "chat_leads admin read"
  on public.chat_leads for select
  using (public.auth_is_admin());

drop policy if exists "chat_leads admin update" on public.chat_leads;
create policy "chat_leads admin update"
  on public.chat_leads for update
  using (public.auth_is_admin());

create index if not exists chat_leads_created_at_idx on public.chat_leads (created_at desc);
create index if not exists chat_leads_status_idx on public.chat_leads (status);

-- ─── Fold chatbot leads into the unified leads pool ────────────────────────
drop view if exists public.leads_pool;

create view public.leads_pool as
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
  from public.whitepaper_leads

  union all

  select
    id,
    created_at,
    'chatbot'::lead_source as source,
    email,
    name,
    service               as intent,
    null::text            as resource_slug,
    null::text            as resource_title,
    coalesce(message, '') || case when timeline is not null then E'\nTimeline: ' || timeline else '' end
                          as notes,
    status
  from public.chat_leads;

grant select on public.leads_pool to authenticated;
