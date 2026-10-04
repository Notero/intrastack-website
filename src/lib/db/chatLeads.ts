import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert } from "@/lib/supabase/database.types";

type DB = SupabaseClient<Database>;

export function insertChatLead(db: DB, row: TablesInsert<"chat_leads">) {
  return db.from("chat_leads").insert(row);
}
