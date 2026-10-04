import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert, TablesUpdate } from "@/lib/supabase/database.types";

type DB = SupabaseClient<Database>;

export function insertLeadershipPerson(db: DB, row: TablesInsert<"leadership_people">) {
  return db.from("leadership_people").insert(row);
}

export function updateLeadershipPerson(db: DB, id: string, patch: TablesUpdate<"leadership_people">) {
  return db.from("leadership_people").update(patch).eq("id", id);
}

export function deleteLeadershipPerson(db: DB, id: string) {
  return db.from("leadership_people").delete().eq("id", id);
}
