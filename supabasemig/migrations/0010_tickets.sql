-- 0016_tickets.sql
-- Support ticket system.
--
-- Two tables:
--   tickets        — one row per support request raised by any authenticated user
--   ticket_replies — threaded replies; both the requester and admins can post
--
-- Enums mirror the values used in the UI (status filter strip, priority badges).

-- ─── Enums ─────────────────────────────────────────────────────────────────

do $$ begin
  create type public.ticket_status as enum ('open', 'in_progress', 'resolved', 'closed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.ticket_priority as enum ('low', 'normal', 'high', 'urgent');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.ticket_category as enum (
    'billing',
    'technical',
    'job_listing',
    'account',
    'other'
  );
exception when duplicate_object then null; end $$;

-- ─── tickets ────────────────────────────────────────────────────────────────

create table if not exists public.tickets (
  id           uuid        primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  requester_id uuid        not null references auth.users(id) on delete cascade,

  subject      text        not null check (char_length(subject) between 3 and 200),
  description  text        not null check (char_length(description) between 1 and 10000),
  category     public.ticket_category not null default 'other',
  priority     public.ticket_priority not null default 'normal',

  status       public.ticket_status   not null default 'open',
  assigned_to  uuid        references public.profiles(id) on delete set null,
  resolved_at  timestamptz,
  closed_at    timestamptz,

  constraint tickets_resolved_at_requires_status
    check (resolved_at is null or status in ('resolved', 'closed')),
  constraint tickets_closed_at_requires_status
    check (closed_at is null or status = 'closed')
);

create index if not exists tickets_requester_idx   on public.tickets (requester_id);
create index if not exists tickets_status_idx      on public.tickets (status);
create index if not exists tickets_created_at_idx  on public.tickets (created_at asc);
create index if not exists tickets_assigned_to_idx on public.tickets (assigned_to);

drop trigger if exists tickets_set_updated_at on public.tickets;
create trigger tickets_set_updated_at
  before update on public.tickets
  for each row execute function public.set_updated_at();

-- ─── ticket_replies ─────────────────────────────────────────────────────────

create table if not exists public.ticket_replies (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),

  ticket_id   uuid        not null references public.tickets(id) on delete cascade,
  author_id   uuid        not null references auth.users(id) on delete cascade,
  body        text        not null check (char_length(body) between 1 and 10000),
  is_admin    boolean     not null default false
);

create index if not exists ticket_replies_ticket_idx on public.ticket_replies (ticket_id, created_at asc);

-- ─── Helper: check ticket ownership without RLS interference ────────────────
-- SECURITY DEFINER so sub-selects inside reply policies bypass RLS on tickets.

create or replace function public.ticket_owned_by(p_ticket_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.tickets
    where id = p_ticket_id and requester_id = p_user_id
  );
$$;

-- ─── RLS — tickets ──────────────────────────────────────────────────────────

alter table public.tickets enable row level security;

drop policy if exists "tickets_select_requester" on public.tickets;
create policy "tickets_select_requester"
  on public.tickets for select
  using (requester_id = auth.uid());

drop policy if exists "tickets_insert_requester" on public.tickets;
create policy "tickets_insert_requester"
  on public.tickets for insert
  with check (requester_id = auth.uid());

drop policy if exists "tickets_select_admin" on public.tickets;
create policy "tickets_select_admin"
  on public.tickets for select
  using (public.auth_is_admin());

drop policy if exists "tickets_update_admin" on public.tickets;
create policy "tickets_update_admin"
  on public.tickets for update
  using (public.auth_is_admin())
  with check (public.auth_is_admin());

drop policy if exists "tickets_delete_admin" on public.tickets;
create policy "tickets_delete_admin"
  on public.tickets for delete
  using (public.auth_is_admin());

-- ─── RLS — ticket_replies ───────────────────────────────────────────────────

alter table public.ticket_replies enable row level security;

drop policy if exists "ticket_replies_select_requester" on public.ticket_replies;
create policy "ticket_replies_select_requester"
  on public.ticket_replies for select
  using (public.ticket_owned_by(ticket_id, auth.uid()));

drop policy if exists "ticket_replies_insert_requester" on public.ticket_replies;
create policy "ticket_replies_insert_requester"
  on public.ticket_replies for insert
  with check (
    author_id = auth.uid()
    and is_admin = false
    and public.ticket_owned_by(ticket_id, auth.uid())
  );

drop policy if exists "ticket_replies_select_admin" on public.ticket_replies;
create policy "ticket_replies_select_admin"
  on public.ticket_replies for select
  using (public.auth_is_admin());

drop policy if exists "ticket_replies_insert_admin" on public.ticket_replies;
create policy "ticket_replies_insert_admin"
  on public.ticket_replies for insert
  with check (
    author_id = auth.uid()
    and public.auth_is_admin()
  );

drop policy if exists "ticket_replies_delete_admin" on public.ticket_replies;
create policy "ticket_replies_delete_admin"
  on public.ticket_replies for delete
  using (public.auth_is_admin());

-- ─── Seed data (dev only) ───────────────────────────────────────────────────
-- Change 'customer@test.com' to whichever customer email you use in dev.

do $$
declare
  customer_uid uuid;
begin
  select id into customer_uid from auth.users where email = 'customer@test.com' limit 1;

  if customer_uid is null then
    return;
  end if;

  insert into public.tickets (requester_id, subject, description, category, priority, status, created_at)
  values
    (
      customer_uid,
      'Cannot access job listings',
      'I have been unable to access the job listings section of the portal since yesterday. I get a blank screen after logging in.',
      'technical', 'high', 'open',
      now() - interval '10 days'
    ),
    (
      customer_uid,
      'Billing discrepancy on invoice #1042',
      'Invoice #1042 charged $350 but our agreed rate is $300/month. Please advise.',
      'billing', 'normal', 'in_progress',
      now() - interval '7 days'
    ),
    (
      customer_uid,
      'Need help listing a remote role',
      'I am trying to post a fully remote role but the form does not seem to save the remote toggle.',
      'job_listing', 'low', 'open',
      now() - interval '3 days'
    )
  on conflict do nothing;
end $$;
