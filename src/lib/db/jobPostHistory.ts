import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert } from "@/lib/supabase/database.types";

type DB = SupabaseClient<Database>;

/** Columns needed to snapshot a job_posts row into job_post_history. */
export const JOB_POST_SNAPSHOT_COLUMNS =
  "id,recruiter_id,title,team,location,remote,employment_type,seniority,salary_range,short_description,description,responsibilities,requirements,nice_to_have,tags";

export type JobPostSnapshot = Pick<
  Tables<"job_posts">,
  | "id"
  | "recruiter_id"
  | "title"
  | "team"
  | "location"
  | "remote"
  | "employment_type"
  | "seniority"
  | "salary_range"
  | "short_description"
  | "description"
  | "responsibilities"
  | "requirements"
  | "nice_to_have"
  | "tags"
>;

/** Records a job_posts snapshot + outcome into job_post_history (approve/reject/withdraw). */
export function recordJobPostOutcome(
  db: DB,
  job: JobPostSnapshot,
  outcome: TablesInsert<"job_post_history">["outcome"],
  outcomeBy: string,
) {
  return db.from("job_post_history").insert({
    job_post_id: job.id,
    recruiter_id: job.recruiter_id,
    title: job.title,
    team: job.team,
    location: job.location,
    remote: job.remote,
    employment_type: job.employment_type,
    seniority: job.seniority,
    salary_range: job.salary_range,
    short_description: job.short_description,
    description: job.description,
    responsibilities: job.responsibilities,
    requirements: job.requirements,
    nice_to_have: job.nice_to_have,
    tags: job.tags,
    outcome,
    outcome_by: outcomeBy,
  });
}
