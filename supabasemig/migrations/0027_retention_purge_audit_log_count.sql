-- 0027_retention_purge_audit_log_count.sql
-- Task 11 (Data Retention Automation). Scheduling for all retention purges —
-- including audit_log's own, previously-dormant one from 0025 — now happens
-- via Vercel Cron (web-app/vercel.json) hitting
-- /api/cron/purge-expired-data, not pg_cron. pg_cron is confirmed not
-- installed on this Supabase project, so 0025's `do $$ if exists ... $$`
-- schedule block has never actually registered a job; that block is left
-- as-is (migrations aren't edited after being applied) and stays
-- permanently inert by design now, not by oversight.
--
-- One purge target — rejected-application resumes — needs Supabase Storage
-- object deletion, which only works correctly through the Storage API, not
-- raw SQL against storage.objects. That ruled out a pure pg_cron/SQL
-- approach for the feature as a whole, so everything runs as one
-- TypeScript orchestrator (src/lib/retention/purgeExpiredData.ts) instead.
--
-- The only DB-side change needed: purge_old_audit_log() returned void, so
-- the cron route couldn't report/log how many rows it purged. Give it a
-- count instead. Nothing currently calls this function (it's been dormant
-- since 0025), so changing its return type is safe.

create or replace function public.purge_old_audit_log()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count integer;
begin
  delete from public.audit_log
  where created_at < now() - interval '12 months';

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;
