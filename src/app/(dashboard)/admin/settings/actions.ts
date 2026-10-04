"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { requireRole } from "@/lib/auth/session";
import { updateProfile as updateProfileRow } from "@/lib/db/profiles";

export interface ProfileFormState {
  error?: string;
  ok?: boolean;
}

function strOrNull(v: FormDataEntryValue | null): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s ? s : null;
}

export async function updateProfile(
  _prev: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const user = await requireRole("admin");

  const supabase = await createSupabaseServerClient();

  const profileUpdate = {
    full_name: strOrNull(formData.get("full_name")),
    display_name: strOrNull(formData.get("display_name")),
    phone: strOrNull(formData.get("phone")),
    timezone: strOrNull(formData.get("timezone")) ?? "UTC",
    locale: strOrNull(formData.get("locale")) ?? "en",
    avatar_url: strOrNull(formData.get("avatar_url")),
  };

  const { error: profileErr } = await supabase
    .from("profiles")
    .update(profileUpdate)
    .eq("id", user.id);
  if (profileErr) return { error: profileErr.message };

  const { error: adminErr } = await supabase
    .from("admin_profiles")
    .update({
      department: strOrNull(formData.get("department")),
    })
    .eq("id", user.id);
  if (adminErr) return { error: adminErr.message };

  revalidatePath("/admin/settings");
  return { ok: true };
}

export async function updateFlags(flags: Record<string, boolean>) {
  const user = await requireRole("admin");
  const supabase = await createSupabaseServerClient();

  // Store flags in profiles.metadata under the "feature_flags" key.
  const { data: existing } = await supabase
    .from("profiles")
    .select("metadata")
    .eq("id", user.id)
    .single();

  const metadata = { ...(existing?.metadata as Record<string, unknown> ?? {}), feature_flags: flags };

  await updateProfileRow(supabase, user.id, { metadata });
}
