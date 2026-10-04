import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CustomerSidebar } from "./_components/CustomerSidebar";
import { countUnreadNotifications } from "@/lib/db/notifications";

export default async function CustomerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireRole(["customer", "admin"]);
  const supabase = await createSupabaseServerClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const unreadCount = await countUnreadNotifications(supabase, user.id);

  return (
    <SidebarProvider className="h-screen overflow-hidden">
      <CustomerSidebar
        email={user.email}
        fullName={profile?.full_name ?? null}
        isAdmin={user.role === "admin"}
        unreadCount={unreadCount}
      />
      <SidebarInset className="overflow-y-auto bg-white px-10 py-10">
        {children}
      </SidebarInset>
      <Toaster richColors position="bottom-right" />
    </SidebarProvider>
  );
}
