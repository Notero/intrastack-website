"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { requireRole } from "@/lib/auth/session";
import { ROLES, type Role } from "@/lib/auth/roles";
import { updateProfile } from "@/lib/db/profiles";

export interface UserFormState {
  error?: string;
  success?: string;
}

const STATUSES = ["active", "invited", "suspended", "deactivated"] as const;
type Status = (typeof STATUSES)[number];
function isStatus(value: string | null): value is Status {
  return value != null && (STATUSES as readonly string[]).includes(value);
}

function strOrNull(v: FormDataEntryValue | null): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s ? s : null;
}

export async function updateUserProfile(
  userId: string,
  _prev: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  await requireRole("admin");

  const roleRaw = strOrNull(formData.get("role")) as Role | null;
  const statusRaw = strOrNull(formData.get("status"));
  const full_name = strOrNull(formData.get("full_name"));
  const display_name = strOrNull(formData.get("display_name"));
  const phone = strOrNull(formData.get("phone"));
  const timezone = strOrNull(formData.get("timezone"));

  if (roleRaw && !ROLES.includes(roleRaw)) return { error: "Invalid role." };
  if (statusRaw && !isStatus(statusRaw)) return { error: "Invalid status." };

  const supabase = await createSupabaseServerClient();

  const { error } = await updateProfile(supabase, userId, {
    role: roleRaw ?? undefined,
    status: statusRaw && isStatus(statusRaw) ? statusRaw : undefined,
    full_name,
    display_name,
    phone,
    timezone: timezone ?? undefined,
    updated_at: new Date().toISOString(),
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}`);
  return { success: "Profile updated." };
}

export async function suspendUser(userId: string): Promise<void> {
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();
  await updateProfile(supabase, userId, { status: "suspended" });
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}`);
}

export async function activateUser(userId: string): Promise<void> {
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();
  await updateProfile(supabase, userId, { status: "active" });
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}`);
}

export async function changeUserRole(userId: string, role: Role): Promise<UserFormState> {
  await requireRole("admin");
  if (!ROLES.includes(role)) return { error: "Invalid role." };
  const supabase = await createSupabaseServerClient();
  const { error } = await updateProfile(supabase, userId, { role });
  if (error) return { error: error.message };
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}`);
  return { success: "Role updated." };
}
