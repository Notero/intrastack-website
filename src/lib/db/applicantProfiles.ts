import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert } from "@/lib/supabase/database.types";

type DB = SupabaseClient<Database>;

export function upsertApplicantProfile(db: DB, row: TablesInsert<"applicant_profiles">) {
  return db.from("applicant_profiles").upsert(row, { onConflict: "id" });
}
