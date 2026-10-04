"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { createAdminSupabaseClient } from "@/lib/supabase/adminClient";
import { deleteLeadsByEmail } from "@/lib/gdpr/deleteLeadsByEmail";
import { logDataSubjectEvent } from "@/lib/audit/logDataSubjectEvent";
import { EMAIL_RE } from "@/lib/validation";

export async function deleteLeadsAction(
  email: string,
): Promise<{ error?: string; success?: string }> {
  const actor = await requireRole("admin");

  const cleaned = email.trim().toLowerCase();
  if (!EMAIL_RE.test(cleaned)) return { error: "Enter a valid email address." };

  const admin = createAdminSupabaseClient();
  const { deleted, error } = await deleteLeadsByEmail(admin, cleaned);
  if (error) return { error: error.message };

  const total = deleted.contact_form_leads + deleted.whitepaper_leads + deleted.chat_leads;
  if (total === 0) return { error: "No leads found for that email." };

  await logDataSubjectEvent("gdpr_delete_leads", actor, cleaned, {
    fulfilled_at: new Date().toISOString(),
    deleted,
  });

  revalidatePath("/admin/leads");
  return { success: `Deleted ${total} lead${total === 1 ? "" : "s"} for ${cleaned}.` };
}
