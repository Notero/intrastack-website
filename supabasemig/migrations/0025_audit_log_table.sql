-- 0035_audit_log_table.sql
-- Immutable audit log: table, the generic per-row trigger, the
-- log_audit_event() RPC for app-level (non-trigger) writes, retention, and
-- cleanup of a legacy hand-made trigger set that predated this feature and
-- was producing duplicate, actor-less rows alongside it.

create table if not exists public.audit_log (
  id         uuid        primary key default gen_random_uuid(),
  actor_id   uuid,        -- no FK: row must survive the actor being deleted later
  actor_role text,
  action     text        not null,
  table_name text,
  row_id     uuid,
  before     jsonb,
  after      jsonb,
  ip_address text,
  created_at timestamptz not null default now()
);

create index if not exists audit_log_created_at_idx on public.audit_log (created_at desc);
create index if not exists audit_log_actor_id_idx   on public.audit_log (actor_id);
create index if not exists audit_log_table_name_idx on public.audit_log (table_name);

-- ─── RLS ────────────────────────────────────────────────────────────────────
-- Admin-only read. No insert/update/delete policy for ANY role, including
-- admin — the only sanctioned write paths are the SECURITY DEFINER
-- log_audit_event() RPC and the audit_table_change() trigger below, both of
-- which run as their owner and bypass RLS by nature. purge_old_audit_log()
-- below is the one deliberate, documented DELETE exception — also SECURITY
-- DEFINER, not a client-facing path.

alter table public.audit_log enable row level security;

drop policy if exists "audit_log_select_admin" on public.audit_log;
create policy "audit_log_select_admin"
  on public.audit_log for select
  using (public.auth_is_admin());

-- ─── audit_table_change() ──────────────────────────────────────────────────
-- Generic audit trigger, reused across the 3 tables that are mutated
-- exclusively through the cookie-aware Supabase client (so auth.uid() is
-- reliable inside the trigger): profiles, job_posts, onboarding_documents.
--
-- `applications` and `tickets`/`ticket_replies` are NOT covered here — both
-- are mutated through the service-role client at their real call sites
-- (customer/my_job_listings/[id]/talent/actions.ts, admin/tickets/[id]/
-- actions.ts), which has no user JWT context, so auth.uid() would be NULL
-- inside a trigger fired by those mutations. Those two are logged via an
-- explicit app-level call to log_audit_event() instead, reusing the actor
-- already resolved by requireRole() at the call site.

create or replace function public.audit_table_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor_role text;
  v_row_id     uuid;
begin
  -- Always re-resolve the actor via auth.uid(), never read it off NEW/OLD —
  -- for profiles specifically, NEW.role is the *target* user's new role,
  -- not the actor's own role.
  select role into v_actor_role from public.profiles where id = auth.uid();

  -- NEW is unassigned on DELETE and OLD is unassigned on INSERT — referencing
  -- the unassigned side raises "record is not assigned yet", so branch on
  -- tg_op explicitly rather than COALESCE-ing both (COALESCE still has to
  -- evaluate to_jsonb(new) first, which blows up on DELETE before it can
  -- fall through to OLD).
  v_row_id := case tg_op
    when 'DELETE' then (to_jsonb(old)->>'id')::uuid
    else (to_jsonb(new)->>'id')::uuid
  end;

  insert into public.audit_log (
    actor_id, actor_role, action, table_name, row_id, before, after, ip_address
  )
  values (
    auth.uid(),
    v_actor_role,
    lower(tg_op) || '_' || tg_table_name,
    tg_table_name,
    v_row_id,
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) else null end,
    case when tg_op in ('UPDATE', 'INSERT') then to_jsonb(new) else null end,
    null -- ponytail: no reliable IP inside a plain trigger (would need to
         -- parse current_setting('request.headers', true)); the app-level
         -- call sites for log_audit_event() below already get IP for free
         -- via headers(). Add GUC parsing here only if trigger-row IP
         -- becomes a real need.
  );

  return coalesce(new, old);
end;
$$;

-- profiles: UPDATE only. Row creation already fires handle_new_user (0009)
-- and isn't an admin mutation — logging every signup would just be noise.
drop trigger if exists profiles_audit on public.profiles;
create trigger profiles_audit
  after update on public.profiles
  for each row execute function public.audit_table_change();

-- job_posts: create / edit / publish-toggle / approve / reject(delete) are
-- all admin mutations in scope per the task's "every admin mutation" DoD.
drop trigger if exists job_posts_audit on public.job_posts;
create trigger job_posts_audit
  after insert or update or delete on public.job_posts
  for each row execute function public.audit_table_change();

-- onboarding_documents: upload = insert, download = update (downloaded_at
-- stamp via the mark_onboarding_document_downloaded RPC — SECURITY DEFINER
-- only changes execution privilege, not which JWT auth.uid() reads, so the
-- applicant remains the correctly-resolved actor). No delete path exists
-- anywhere in src/ today — not wired, add a trigger clause if one appears
-- later.
drop trigger if exists onboarding_documents_audit on public.onboarding_documents;
create trigger onboarding_documents_audit
  after insert or update on public.onboarding_documents
  for each row execute function public.audit_table_change();

-- ─── log_audit_event() ─────────────────────────────────────────────────────
-- SECURITY DEFINER function for app-level audit writes: auth events not tied
-- to a table row (no trigger to catch them, e.g. login/password-reset), plus
-- applications.status changes and tickets/ticket_replies admin actions —
-- the tables whose real mutation call sites use the service-role client (see
-- audit_table_change()'s header comment for why those can't rely on a
-- trigger). Bypasses audit_log's RLS intentionally — this is the only other
-- sanctioned insert path besides the table triggers above.
--
-- p_actor_id/p_actor_role are text, not uuid — Postgres text params without
-- an explicit default get typed as required, non-nullable strings in the
-- generated TypeScript types. Rather than fight the generator, empty string
-- is accepted as "no value" at the SQL boundary and converted to NULL before
-- insert. p_table_name/p_row_id/p_before are trailing and defaulted so the
-- auth-event call sites (which don't have a row) can omit them.

create or replace function public.log_audit_event(
  p_actor_id   text,
  p_actor_role text,
  p_action     text,
  p_after      jsonb,
  p_ip_address text,
  p_table_name text default null,
  p_row_id     text default null,
  p_before     jsonb default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.audit_log (
    actor_id, actor_role, action, table_name, row_id, before, after, ip_address
  )
  values (
    nullif(p_actor_id, '')::uuid,
    nullif(p_actor_role, ''),
    p_action,
    nullif(p_table_name, ''),
    nullif(p_row_id, '')::uuid,
    p_before,
    p_after,
    nullif(p_ip_address, '')
  );
end;
$$;

-- ─── Retention ──────────────────────────────────────────────────────────────
-- audit_log rows older than 12 months are purged. This is a deliberate,
-- explicit exception to "append-only, no deletes" — it's a scheduled
-- system-level purge, not an ad-hoc admin/client delete path (which remains
-- fully blocked by RLS). Runs monthly via pg_cron.

create or replace function public.purge_old_audit_log()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.audit_log
  where created_at < now() - interval '12 months';
end;
$$;

-- Schedule via pg_cron, if the extension is available on this project.
-- Runs on the 1st of every month at 03:00 UTC.
do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.schedule(
      'purge-old-audit-log',
      '0 3 1 * *',
      $cron$select public.purge_old_audit_log();$cron$
    );
  end if;
end $$;

-- ─── Legacy trigger cleanup ─────────────────────────────────────────────────
-- A separate, hand-made audit trigger set predated this feature entirely —
-- 6 triggers named audit_log_<table>, all calling public.audit_log_trigger(),
-- on profiles/applications/job_posts/onboarding_documents/tickets/
-- ticket_replies. Never migrated, and each one produced a duplicate,
-- actor-less row alongside this feature's real triggers/app-level calls
-- above. Drop them explicitly by name.
--
-- NOT touched: trg_application_talent_pool on applications (calls
-- attach_application_to_talent_pool) — a real, unrelated talent-pool
-- auto-matching trigger, not part of this legacy set.

drop trigger if exists audit_log_profiles              on public.profiles;
drop trigger if exists audit_log_applications           on public.applications;
drop trigger if exists audit_log_job_posts              on public.job_posts;
drop trigger if exists audit_log_onboarding_documents   on public.onboarding_documents;
drop trigger if exists audit_log_tickets                on public.tickets;
drop trigger if exists audit_log_ticket_replies         on public.ticket_replies;

drop function if exists public.audit_log_trigger();
