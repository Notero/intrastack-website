import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ApplicantSidebar } from "@/components/dashboard/ApplicantSidebar";
import { countUnreadNotifications } from "@/lib/db/notifications";

export default async function ApplicantLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireRole(["applicant", "admin"]);
  const supabase = await createSupabaseServerClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, signed_for_representation")
    .eq("id", user.id)
    .single();

  const reqHeaders = await headers();
  const pathname = reqHeaders.get("x-pathname") ?? "";
  const isOnboarding = pathname.startsWith("/applicant/onboarding");

  // Gate applicants who haven't signed the RTR agreement.
  // Admins bypass; onboarding route excluded to prevent redirect loops.
  if (user.role === "applicant" && !profile?.signed_for_representation && !isOnboarding) {
    redirect("/applicant/onboarding");
  }

  // Onboarding is a standalone full-page experience — no sidebar shell.
  if (isOnboarding) {
    return (
      <>
        {children}
        <Toaster richColors position="bottom-right" />
      </>
    );
  }

  const unreadCount = await countUnreadNotifications(supabase, user.id);

  return (
    <SidebarProvider className="h-screen overflow-hidden">
      <ApplicantSidebar
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
