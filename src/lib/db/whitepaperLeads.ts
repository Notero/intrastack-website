import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert } from "@/lib/supabase/database.types";

type DB = SupabaseClient<Database>;

export function insertWhitepaperLead(db: DB, row: TablesInsert<"whitepaper_leads">) {
  return db.from("whitepaper_leads").insert(row);
}
