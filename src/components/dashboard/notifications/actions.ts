"use server";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { requireRole } from "@/lib/auth/session";
import { markNotificationRead, markAllNotificationsRead } from "@/lib/db/notifications";

export async function markNotificationReadAction(notificationId: string) {
  const user = await requireRole(["applicant", "customer", "admin"]);
  const supabase = await createSupabaseServerClient();

  await markNotificationRead(supabase, notificationId, user.id); // prevent marking another user's notification
}

export async function markAllNotificationsReadAction() {
  const user = await requireRole(["applicant", "customer", "admin"]);
  const supabase = await createSupabaseServerClient();

  await markAllNotificationsRead(supabase, user.id);
}
