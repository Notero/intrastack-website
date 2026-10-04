import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { SavedJobsClient } from "./_components/SavedJobsClient";
import { type JobPost } from "@/lib/content/jobs";

export const metadata = { title: "Saved Jobs · Applicant" };

const JOB_COLUMNS =
  "id,slug,title,team,location,remote,employment_type,seniority,salary_range,short_description,description,responsibilities,requirements,nice_to_have,tags,posted_at";

export default async function SavedJobsPage() {
  const user = await requireRole("applicant");
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("saved_jobs")
    .select(`job_posts ( ${JOB_COLUMNS} )`)
    .eq("applicant_id", user.id)
    .order("created_at", { ascending: false });

  if (error) console.error("[saved-jobs] fetch failed:", error.message);

  const jobs: JobPost[] = (data ?? [])
    .map((row) => {
      const jp = row.job_posts;
      return (Array.isArray(jp) ? jp[0] : jp) as JobPost | null;
    })
    .filter((j): j is JobPost => j !== null);

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Saved Jobs</h1>
        <p className="mt-1 text-sm text-zinc-500">Jobs you&apos;ve bookmarked for later.</p>
      </div>
      <SavedJobsClient initialJobs={jobs} />
    </div>
  );
}
