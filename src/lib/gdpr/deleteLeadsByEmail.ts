import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

type DB = SupabaseClient<Database>;

/**
 * Purges one email from every lead-capture table. Leads aren't accounts —
 * there's no single row id a verified request keys off, so this deletes by
 * email across all three sources in one action (task 10C). Column names
 * differ per table (work_email vs email), so this can't be a single query
 * against the leads_pool view.
 */
export async function deleteLeadsByEmail(admin: DB, email: string) {
  const { data: contactForm, error: contactFormError } = await admin
    .from("contact_form_leads")
    .delete()
    .eq("work_email", email)
    .select("id");

  const { data: whitepaper, error: whitepaperError } = await admin
    .from("whitepaper_leads")
    .delete()
    .eq("email", email)
    .select("id");

  const { data: chat, error: chatError } = await admin
    .from("chat_leads")
    .delete()
    .eq("email", email)
    .select("id");

  return {
    deleted: {
      contact_form_leads: contactForm?.length ?? 0,
      whitepaper_leads: whitepaper?.length ?? 0,
      chat_leads: chat?.length ?? 0,
    },
    error: contactFormError ?? whitepaperError ?? chatError ?? null,
  };
}
