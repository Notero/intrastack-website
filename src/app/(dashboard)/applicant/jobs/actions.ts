"use server";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { createAdminSupabaseClient } from "@/lib/supabase/adminClient";
import { requireRole } from "@/lib/auth/session";
import { saveJob, unsaveJob } from "@/lib/db/savedJobs";
import { insertApplication } from "@/lib/db/applications";
import { insertNotifications } from "@/lib/db/notifications";

export async function saveJobAction(jobPostId: string) {
  const user = await requireRole("applicant");
  const supabase = await createSupabaseServerClient();

  const { error } = await saveJob(supabase, user.id, jobPostId);

  if (error && error.code !== "23505") {
    console.error("[jobs] save failed:", error.message);
  }
}

export async function unsaveJobAction(jobPostId: string) {
  const user = await requireRole("applicant");
  const supabase = await createSupabaseServerClient();

  const { error } = await unsaveJob(supabase, user.id, jobPostId);

  if (error) console.error("[jobs] unsave failed:", error.message);
}

export async function applyAction(args: {
  jobPostId: string;
  coverLetter?: string;
  coverLetterUrl?: string;
}): Promise<{ ok: boolean; alreadyApplied?: boolean; error?: string }> {
  const user = await requireRole("applicant");
  const supabase = await createSupabaseServerClient();

  const { data: ap } = await supabase
    .from("applicant_profiles")
    .select("resume_url")
    .eq("id", user.id)
    .single();

  const { error } = await insertApplication(supabase, {
    applicant_id: user.id,
    job_post_id: args.jobPostId,
    status: "submitted",
    cover_letter: args.coverLetter ?? null,
    cover_letter_url: args.coverLetterUrl ?? null,
    resume_url: ap?.resume_url ?? null,
  });

  if (error?.code === "23505") return { ok: false, alreadyApplied: true };
  if (error) {
    console.error("[jobs] apply failed:", error.message);
    return { ok: false, error: error.message };
  }

  const { data: job } = await supabase
    .from("job_posts")
    .select("title, recruiter_id")
    .eq("id", args.jobPostId)
    .maybeSingle();

  if (job) {
    const admin = createAdminSupabaseClient();
    await insertNotifications(admin, [
      {
        user_id: user.id,
        kind: "application",
        title: `Your application for ${job.title} is under review`,
        body: "We'll notify you as soon as there's an update.",
      },
      ...(job.recruiter_id
        ? [{
            user_id: job.recruiter_id,
            kind: "application" as const,
            title: `A new candidate applied for ${job.title}`,
            body: "Review the application from your talent board.",
          }]
        : []),
    ]);
  }

  return { ok: true };
}
