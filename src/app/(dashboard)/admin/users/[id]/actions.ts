"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { createAdminSupabaseClient } from "@/lib/supabase/adminClient";
import { deleteUserData } from "@/lib/gdpr/deleteUserData";
import { logDataSubjectEvent } from "@/lib/audit/logDataSubjectEvent";

export async function deleteUserDataAction(subjectId: string): Promise<{ error?: string }> {
  const actor = await requireRole("admin");

  if (subjectId === actor.id) {
    return { error: "You can't delete your own account." };
  }

  const admin = createAdminSupabaseClient();
  const { error } = await deleteUserData(admin, subjectId);
  if (error) return { error: error.message };

  await logDataSubjectEvent("gdpr_delete", actor, subjectId, {
    fulfilled_at: new Date().toISOString(),
  });

  redirect("/admin/users");
}
