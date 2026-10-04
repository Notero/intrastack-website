import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert, TablesUpdate } from "@/lib/supabase/database.types";

type DB = SupabaseClient<Database>;

export function insertTicket(db: DB, row: TablesInsert<"tickets">) {
  return db.from("tickets").insert(row);
}

export function updateTicket(db: DB, id: string, patch: TablesUpdate<"tickets">) {
  return db.from("tickets").update(patch).eq("id", id);
}
