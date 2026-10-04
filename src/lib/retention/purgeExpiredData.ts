import "server-only";
import { createAdminSupabaseClient } from "@/lib/supabase/adminClient";
import { logSystemEvent } from "@/lib/audit/logSystemEvent";
import { monthsAgo } from "@/lib/retention/monthsAgo";

export type PurgeSummary = {
  contact_form_leads: number;
  whitepaper_leads: number;
  chat_leads: number;
  tickets: number;
  application_resumes: number;
  onboarding_documents: number;
  audit_log: number;
};

/**
 * Task 11 — automatic, time-based purge of stale data per the windows
 * stated on /privacy. Everything runs through one TypeScript orchestrator
 * (not pg_cron) because the applications/onboarding_documents steps have to
 * remove Supabase Storage objects, which only works correctly through the
 * Storage API — see the header comment on migration 0027 for why.
 *
 * Uses the admin client throughout: this runs from a cron-triggered route
 * with no user session to scope RLS against.
 */
export async function purgeExpiredData(): Promise<PurgeSummary> {
  const admin = createAdminSupabaseClient();

  const { data: contactFormLeads } = await admin
    .from("contact_form_leads")
    .delete()
    .lt("created_at", monthsAgo(24))
    .select("id");

  const { data: whitepaperLeads } = await admin
    .from("whitepaper_leads")
    .delete()
    .lt("created_at", monthsAgo(24))
    .select("id");

  // chat_leads carries the raw transcript (message column) — matches
  // /privacy's separate "chat transcripts — 12 months" line, not the
  // 24-month generic-leads line the other two tables follow.
  const { data: chatLeads } = await admin
    .from("chat_leads")
    .delete()
    .lt("created_at", monthsAgo(12))
    .select("id");

  // Only ever set for status = 'closed' (enforced by a check constraint),
  // so no extra status filter is needed beyond the closed_at cutoff.
  const { data: tickets } = await admin
    .from("tickets")
    .delete()
    .lt("closed_at", monthsAgo(36))
    .select("id");

  // Rejected-application resumes only (Task 11A's literal scope) — accepted/
  // withdrawn applications are left alone since an accepted application
  // implies an ongoing relationship a blind timer shouldn't sever. The
  // applications row itself is kept for hiring-funnel history; only the
  // resume/cover-letter files (and the columns pointing at them) are purged.
  const { data: staleApplications } = await admin
    .from("applications")
    .select("id, resume_url, cover_letter_url")
    .eq("status", "rejected")
    .lt("updated_at", monthsAgo(12));

  const applicationsToPurge = (staleApplications ?? []).filter(
    (a) => a.resume_url || a.cover_letter_url,
  );
  const resumePaths = applicationsToPurge.flatMap((a) =>
    [a.resume_url, a.cover_letter_url].filter((p): p is string => !!p),
  );
  if (resumePaths.length) {
    await admin.storage.from("resumes").remove(resumePaths);
  }
  if (applicationsToPurge.length) {
    await admin
      .from("applications")
      .update({ resume_url: null, cover_letter_url: null })
      .in(
        "id",
        applicationsToPurge.map((a) => a.id),
      );
  }

  // Same reasoning as applications: rejected only, accepted implies an
  // active engagement. Two storage paths per row (original + signed copy).
  const { data: staleDocs } = await admin
    .from("onboarding_documents")
    .select("id, file_path, signed_file_path")
    .eq("status", "rejected")
    .lt("rejected_at", monthsAgo(36));

  const docPaths = (staleDocs ?? []).flatMap((d) =>
    [d.file_path, d.signed_file_path].filter((p): p is string => !!p),
  );
  if (docPaths.length) {
    await admin.storage.from("onboarding-docs").remove(docPaths);
  }
  if (staleDocs?.length) {
    await admin
      .from("onboarding_documents")
      .delete()
      .in(
        "id",
        staleDocs.map((d) => d.id),
      );
  }

  const { data: auditLogPurgedRaw } = await admin.rpc("purge_old_audit_log");
  const auditLogPurged = typeof auditLogPurgedRaw === "number" ? auditLogPurgedRaw : 0;

  const summary: PurgeSummary = {
    contact_form_leads: contactFormLeads?.length ?? 0,
    whitepaper_leads: whitepaperLeads?.length ?? 0,
    chat_leads: chatLeads?.length ?? 0,
    tickets: tickets?.length ?? 0,
    application_resumes: applicationsToPurge.length,
    onboarding_documents: staleDocs?.length ?? 0,
    audit_log: auditLogPurged,
  };

  await logSystemEvent(admin, "retention_purge", summary);

  return summary;
}
