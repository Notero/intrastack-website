import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { PageHeader } from "../../_components/PageHeader";
import { UserEditForm } from "./UserEditForm";
import { updateUserProfile } from "../actions";
import type { UserFormState } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import { DeleteUserDataButton } from "./DeleteUserDataButton";

export const metadata = { title: "Edit user · Admin" };

// "recruiter" was collapsed into "customer" by migration 0026 — recruiter_profiles
// no longer exists, its columns now live on customer_profiles.
const ROLE_PROFILE_TABLE = {
  admin: "admin_profiles",
  customer: "customer_profiles",
  recruiter: "customer_profiles",
  applicant: "applicant_profiles",
} as const;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: PageProps) {
  const { id } = await params;
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, display_name, phone, timezone, locale, role, status, created_at, last_sign_in_at, metadata")
    .eq("id", id)
    .single();

  if (error || !profile) notFound();

  // Fetch the role-specific detail row
  const roleTable = ROLE_PROFILE_TABLE[profile.role];
  const { data: roleProfile } = await supabase
    .from(roleTable)
    .select("*")
    .eq("id", id)
    .single();

  const boundAction = async (state: UserFormState, formData: FormData) => {
    "use server";
    return updateUserProfile(id, state, formData);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Users"
        title={profile.full_name ?? profile.email ?? "User"}
        description={`ID: ${profile.id}`}
        actions={
          <div className="flex items-end gap-2">
            <form
              method="GET"
              action="/api/admin/gdpr-export"
              className="flex items-end gap-2"
            >
              <input type="hidden" name="userId" value={profile.id} />
              <div>
                <label htmlFor="requestedAt" className="mb-1 block text-[11px] font-medium text-zinc-500">
                  Request received
                </label>
                <Input
                  id="requestedAt"
                  type="date"
                  name="requestedAt"
                  defaultValue={new Date().toISOString().slice(0, 10)}
                  className="h-9 w-40"
                />
              </div>
              <Button type="submit" variant="outline">
                <Download className="mr-1.5 h-4 w-4" />
                Export data (GDPR)
              </Button>
            </form>
            <DeleteUserDataButton userId={profile.id} email={profile.email} />
          </div>
        }
      />
      <UserEditForm
        profile={profile}
        roleProfile={roleProfile}
        action={boundAction}
      />
    </div>
  );
}
