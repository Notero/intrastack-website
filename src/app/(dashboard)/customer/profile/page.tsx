import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { PageHeader } from "../_components/PageHeader";
import { ProfileForm } from "./ProfileForm";

export const metadata = { title: "Profile · Customer" };

export default async function CustomerProfilePage() {
  const user = await requireRole(["customer", "admin"]);
  const supabase = await createSupabaseServerClient();

  const [{ data: profile }, { data: customerProfile }] = await Promise.all([
    supabase
      .from("profiles")
      .select("email, full_name, display_name, phone, timezone, locale")
      .eq("id", user.id)
      .single(),
    supabase
      .from("customer_profiles")
      .select("company_name, title, linkedin_url, verified, verified_at")
      .eq("id", user.id)
      .single(),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        eyebrow="Account"
        title="My profile"
        description="Manage your customer profile and contact details."
      />
      <ProfileForm
        profile={{
          full_name:    profile?.full_name    ?? null,
          display_name: profile?.display_name ?? null,
          phone:        profile?.phone        ?? null,
          timezone:     profile?.timezone     ?? null,
          email:        profile?.email        ?? user.email ?? null,
          locale:       profile?.locale       ?? null,
        }}
        customerProfile={customerProfile ?? null}
        userId={user.id}
      />
    </div>
  );
}
