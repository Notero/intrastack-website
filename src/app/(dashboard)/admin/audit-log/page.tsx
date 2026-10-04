import { requireRole } from "@/lib/auth/session";
import { createAdminSupabaseClient } from "@/lib/supabase/adminClient";
import { PageHeader } from "../_components/PageHeader";
import { AuditLogTable } from "./AuditLogTable";

export const metadata = { title: "Audit Log · Admin" };

export type AuditLogRow = {
  id: string;
  actor_id: string | null;
  actor_role: string | null;
  action: string;
  table_name: string | null;
  row_id: string | null;
  before: unknown;
  after: unknown;
  ip_address: string | null;
  created_at: string;
};

export default async function AuditLogPage() {
  await requireRole("admin");
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) console.error("[audit-log] fetch failed:", error.message);

  const rows = (data ?? []) as AuditLogRow[];

  // Actor emails aren't stored directly on audit_log; resolve them from
  // profiles for display purposes (best-effort — actor may be null for
  // system/anonymous events).
  const actorIds = [...new Set(rows.map((r) => r.actor_id).filter(Boolean))] as string[];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .in("id", actorIds.length > 0 ? actorIds : [""]);

  const actorMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  const enriched = rows.map((r) => ({
    ...r,
    actor_name: r.actor_id ? actorMap.get(r.actor_id)?.full_name ?? actorMap.get(r.actor_id)?.email ?? null : null,
  }));

  return (
    <div className="w-full">
      <PageHeader
        eyebrow="Platform"
        title="Audit log"
        description="Immutable record of who touched what, when — across profiles, applications, job posts, onboarding documents, tickets, and auth events."
      />
      <AuditLogTable rows={enriched} />
    </div>
  );
}