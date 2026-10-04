"use server";

import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";

// For admin actions tied to a *person* rather than a single table row
// (GDPR export/delete) — audit_table_change() has no row to attach to, and
// logTableEvent's tableName/rowId are required, so neither fits.
export async function logDataSubjectEvent(
  action: string,
  actor: { id: string; role: string },
  subjectId: string,
  extra?: Record<string, unknown>,
) {
  const supabase = await createSupabaseServerClient();
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    null;

  const { error } = await supabase.rpc("log_audit_event", {
    p_actor_id: actor.id,
    p_actor_role: actor.role,
    p_action: action,
    p_after: { subject_id: subjectId, ...extra },
    p_ip_address: ip ?? "",
  });
  if (error) console.error(`[audit] log_audit_event failed for ${action}:`, error.message);
}
