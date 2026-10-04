import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { NotificationsFeed } from "@/components/dashboard/notifications/NotificationsFeed";

export const metadata = { title: "Notifications · Customer" };

export default async function CustomerNotificationsPage() {
  const user = await requireRole(["customer", "admin"]);
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("notifications")
    .select("id, kind, title, body, created_at, read")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) console.error("[notifications] fetch failed:", error.message);

  const notifications = (data ?? []).map((row) => ({
    id: row.id as string,
    kind: row.kind as "info" | "job" | "alert" | "application",
    title: row.title as string,
    body: row.body as string,
    createdAt: row.created_at as string,
    read: row.read as boolean,
  }));

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Notifications</h1>
      </div>
      <NotificationsFeed initialNotifications={notifications} />
    </div>
  );
}
