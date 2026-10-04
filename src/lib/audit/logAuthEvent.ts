"use server";

import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";

export async function logAuthEvent(
  action: string,
  actorId?: string | null,
  actorEmail?: string | null,
) {
  const supabase = await createSupabaseServerClient();
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    null;

  let actorRole: string | null = null;
  if (actorId) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", actorId)
      .single();
    actorRole = profile?.role ?? null;
  }

  const { error } = await supabase.rpc("log_audit_event", {
    p_actor_id: actorId ?? "",
    p_actor_role: actorRole ?? "",
    p_action: action,
    p_after: actorEmail ? { email: actorEmail } : null,
    p_ip_address: ip ?? "",
  });
  if (error) console.error(`[audit] log_audit_event failed for ${action}:`, error.message);
}