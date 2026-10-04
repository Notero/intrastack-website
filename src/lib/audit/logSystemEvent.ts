import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/lib/supabase/database.types";

type DB = SupabaseClient<Database>;

/**
 * Audit log entry for actions with no human actor (scheduled jobs, not a
 * request from a logged-in user) — e.g. the retention purge cron. Uses the
 * admin client since there's no session/cookies to read in that context.
 * `p_actor_id` is left as "" (log_audit_event's NULL sentinel, same as
 * logAuthEvent's unauthenticated-event calls) with actor_role = "system".
 */
export async function logSystemEvent(
  db: DB,
  action: string,
  after?: Record<string, unknown>,
) {
  const { error } = await db.rpc("log_audit_event", {
    p_actor_id: "",
    p_actor_role: "system",
    p_action: action,
    p_after: (after ?? {}) as Json,
    p_ip_address: "",
  });
  if (error) console.error(`[audit] log_audit_event failed for ${action}:`, error.message);
}
