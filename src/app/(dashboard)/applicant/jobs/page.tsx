import { requireRole } from "@/lib/auth/session";
import { fetchJobs } from "@/lib/content/jobs";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { JobBoardClient } from "./_components/JobBoardClient";

export const metadata = { title: "Browse Jobs · Applicant" };

export default async function JobsPage() {
  const user = await requireRole("applicant");
  const supabase = await createSupabaseServerClient();

  const [jobs, savedRows, appliedRows, profileRow] = await Promise.all([
    fetchJobs(),
    supabase.from("saved_jobs").select("job_post_id").eq("applicant_id", user.id),
    supabase.from("applications").select("job_post_id").eq("applicant_id", user.id),
    supabase.from("applicant_profiles").select("resume_url").eq("id", user.id).single(),
  ]);

  const savedIds = (savedRows.data ?? []).map((r) => r.job_post_id as string);
  const appliedIds = (appliedRows.data ?? []).map((r) => r.job_post_id as string);
  const resumeUrl = profileRow.data?.resume_url ?? null;

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Browse Jobs</h1>
        <p className="mt-1 text-sm text-zinc-500">Find your next opportunity at Intrastack.</p>
      </div>
      <JobBoardClient
        jobs={jobs}
        initialSavedIds={savedIds}
        initialAppliedIds={appliedIds}
        resumeUrl={resumeUrl}
      />
    </div>
  );
}
