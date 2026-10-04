import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert, TablesUpdate } from "@/lib/supabase/database.types";

type DB = SupabaseClient<Database>;

export function insertNewsItem(db: DB, row: TablesInsert<"news_items">) {
  return db.from("news_items").insert(row);
}

export function updateNewsItem(db: DB, id: string, patch: TablesUpdate<"news_items">) {
  return db.from("news_items").update(patch).eq("id", id);
}

export function deleteNewsItem(db: DB, id: string) {
  return db.from("news_items").delete().eq("id", id);
}
