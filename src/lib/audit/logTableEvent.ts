"use server";

import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import type { Json } from "@/lib/supabase/database.types";

// For tables mutated via the service-role client (applications, tickets),
// where a DB trigger can't resolve auth.uid(). Actor is already known at
// every call site via requireRole(), so log it explicitly here instead.
export async function logTableEvent(args: {
  actorId: string;
  actorRole: string;
  action: string;
  tableName: string;
  rowId: string;
  before: Json | null;
  after: Json;
}) {
  const supabase = await createSupabaseServerClient();
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    null;

  const { error } = await supabase.rpc("log_audit_event", {
    p_actor_id: args.actorId,
    p_actor_role: args.actorRole,
    p_action: args.action,
    p_after: args.after,
    p_ip_address: ip ?? "",
    p_table_name: args.tableName,
    p_row_id: args.rowId,
    p_before: args.before,
  });
  if (error) console.error(`[audit] log_audit_event failed for ${args.action}:`, error.message);
}
