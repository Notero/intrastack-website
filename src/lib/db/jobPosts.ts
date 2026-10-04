import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert, TablesUpdate } from "@/lib/supabase/database.types";

type DB = SupabaseClient<Database>;

export function insertJobPost(db: DB, row: TablesInsert<"job_posts">) {
  return db.from("job_posts").insert(row);
}

export function updateJobPost(db: DB, id: string, patch: TablesUpdate<"job_posts">) {
  return db.from("job_posts").update(patch).eq("id", id);
}

/** `match` narrows the delete to the caller's own unpublished listing (see withdrawJobListing). */
export function deleteJobPost(
  db: DB,
  id: string,
  match?: { recruiterId?: string; published?: boolean },
) {
  let q = db.from("job_posts").delete().eq("id", id);
  if (match?.recruiterId !== undefined) q = q.eq("recruiter_id", match.recruiterId);
  if (match?.published !== undefined) q = q.eq("published", match.published);
  return q;
}
