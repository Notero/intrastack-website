import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert, TablesUpdate } from "@/lib/supabase/database.types";

type DB = SupabaseClient<Database>;

export function insertOfferLetter(db: DB, row: TablesInsert<"offer_letters">) {
  return db.from("offer_letters").insert(row);
}

export function selectOfferLettersByApplicationIds(db: DB, applicationIds: string[]) {
  return db
    .from("offer_letters")
    .select("*")
    .in("application_id", applicationIds.length > 0 ? applicationIds : [""]);
}

export function updateOfferLetterStatus(db: DB, id: string, patch: TablesUpdate<"offer_letters">) {
  return db.from("offer_letters").update(patch).eq("id", id);
}
