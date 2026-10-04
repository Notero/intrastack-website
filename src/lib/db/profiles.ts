import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesUpdate } from "@/lib/supabase/database.types";

type DB = SupabaseClient<Database>;

export function updateProfile(db: DB, id: string, patch: TablesUpdate<"profiles">) {
  return db.from("profiles").update(patch).eq("id", id);
}
