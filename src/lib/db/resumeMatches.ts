import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert } from "@/lib/supabase/database.types";

type DB = SupabaseClient<Database>;

export function deleteResumeMatchesForParse(db: DB, resumeParseId: string) {
  return db.from("resume_matches").delete().eq("resume_parse_id", resumeParseId);
}

export function insertResumeMatches(db: DB, rows: TablesInsert<"resume_matches">[]) {
  return db.from("resume_matches").insert(rows);
}
