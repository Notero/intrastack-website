import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

type DB = SupabaseClient<Database>;

export function saveJob(db: DB, applicantId: string, jobPostId: string) {
  return db.from("saved_jobs").insert({ applicant_id: applicantId, job_post_id: jobPostId });
}

export function unsaveJob(db: DB, applicantId: string, jobPostId: string) {
  return db
    .from("saved_jobs")
    .delete()
    .eq("applicant_id", applicantId)
    .eq("job_post_id", jobPostId);
}
