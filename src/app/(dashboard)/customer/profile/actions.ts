"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { requireRole } from "@/lib/auth/session";

export interface CustomerProfileState {
  error?: string;
  ok?: boolean;
}

function str(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s || null;
}

export async function updateCustomerProfile(
  _prev: CustomerProfileState,
  formData: FormData,
): Promise<CustomerProfileState> {
  const user = await requireRole(["customer", "admin"]);
  const supabase = await createSupabaseServerClient();

  const { error: profileErr } = await supabase
    .from("profiles")
    .update({
      full_name:    str(formData.get("full_name")),
      display_name: str(formData.get("display_name")),
      phone:        str(formData.get("phone")),
      timezone:     str(formData.get("timezone")) ?? "UTC",
    })
    .eq("id", user.id);

  if (profileErr) return { error: profileErr.message };

  const { error: rpErr } = await supabase
    .from("customer_profiles")
    .update({
      company_name: str(formData.get("company_name")),
      title:        str(formData.get("title")),
      linkedin_url: str(formData.get("linkedin_url")),
    })
    .eq("id", user.id);

  if (rpErr) return { error: rpErr.message };

  revalidatePath("/customer/profile");
  return { ok: true };
}
