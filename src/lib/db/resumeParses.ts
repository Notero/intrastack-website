import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert } from "@/lib/supabase/database.types";

type DB = SupabaseClient<Database>;

export function insertResumeParse(db: DB, row: TablesInsert<"resume_parses">) {
  return db.from("resume_parses").insert(row).select("id").single();
}
