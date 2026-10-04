import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert } from "@/lib/supabase/database.types";

type DB = SupabaseClient<Database>;

export function insertContactFormLead(db: DB, row: TablesInsert<"contact_form_leads">) {
  return db.from("contact_form_leads").insert(row);
}
