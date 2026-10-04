import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Enums, TablesInsert } from "@/lib/supabase/database.types";

type DB = SupabaseClient<Database>;

export function insertNotification(db: DB, row: TablesInsert<"notifications">) {
  return db.from("notifications").insert(row);
}

export function insertNotifications(db: DB, rows: TablesInsert<"notifications">[]) {
  return db.from("notifications").insert(rows);
}

// Fans out to every admin profile — used where there's no single owning
// recipient (a new job listing or ticket reply is everyone admin's to see).
export async function notifyAllAdmins(db: DB, kind: Enums<"notification_kind">, title: string, body: string) {
  const { data: admins } = await db.from("profiles").select("id").eq("role", "admin");
  if (!admins?.length) return;
  return insertNotifications(db, admins.map((a) => ({ user_id: a.id, kind, title, body })));
}

export async function countUnreadNotifications(db: DB, userId: string) {
  const { count } = await db
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("read", false);
  return count ?? 0;
}

export function markNotificationRead(db: DB, notificationId: string, userId: string) {
  return db
    .from("notifications")
    .update({ read: true, read_at: new Date().toISOString() })
    .eq("id", notificationId)
    .eq("user_id", userId);
}

export function markAllNotificationsRead(db: DB, userId: string) {
  return db
    .from("notifications")
    .update({ read: true, read_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("read", false);
}
