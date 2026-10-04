import { requireRole } from "@/lib/auth/session";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireRole("admin");

  return (
    <SidebarProvider className="h-screen overflow-hidden">
      <AdminSidebar email={user.email} />
      <SidebarInset className="overflow-y-auto bg-white px-10 py-10">
        {children}
      </SidebarInset>
      <Toaster richColors position="bottom-right" />
    </SidebarProvider>
  );
}
