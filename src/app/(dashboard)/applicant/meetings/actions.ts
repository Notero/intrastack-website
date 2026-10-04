"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { createAdminSupabaseClient } from "@/lib/supabase/adminClient";
import { requireRole } from "@/lib/auth/session";
import { insertMeeting } from "@/lib/db/meetings";
import { insertNotification } from "@/lib/db/notifications";

// ─── bookMeetingAction ──────────────────────────────────────────────────────

export async function bookMeetingAction(args: {
  applicationId: string;
  proposedAt: string;
  durationMinutes: number;
  notes?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const user = await requireRole("applicant");
  const supabase = await createSupabaseServerClient();

  // Validate the application belongs to this applicant and is in interview status
  const { data: application, error: appError } = await (supabase as unknown as import("@supabase/supabase-js").SupabaseClient)
    .from("applications")
    .select("id, status, applicant_id, job_post_id")
    .eq("id", args.applicationId)
    .single();

  if (appError || !application) {
    return { ok: false, error: "Application not found." };
  }

  if (application.applicant_id !== user.id) {
    return { ok: false, error: "You can only book meetings for your own applications." };
  }

  if (application.status !== "interview") {
    return { ok: false, error: "Application must be in interview status to book a meeting." };
  }

  // Derive job post / customer server-side rather than trusting client-supplied IDs
  const { data: jobPost, error: jobError } = await (supabase as unknown as import("@supabase/supabase-js").SupabaseClient)
    .from("job_posts")
    .select("id, recruiter_id, title")
    .eq("id", application.job_post_id)
    .single();

  if (jobError || !jobPost || !jobPost.recruiter_id) {
    return { ok: false, error: "This job listing is not assigned to a customer yet." };
  }

  const { error } = await insertMeeting(supabase, {
    application_id: args.applicationId,
    job_post_id: jobPost.id,
    applicant_id: user.id,
    customer_id: jobPost.recruiter_id,
    proposed_at: args.proposedAt,
    duration_minutes: args.durationMinutes,
    notes: args.notes ?? null,
    status: "requested",
  });

  if (error) {
    console.error("[meetings] insert failed:", error.message);
    return { ok: false, error: error.message };
  }

  const admin = createAdminSupabaseClient();
  await insertNotification(admin, {
    user_id: jobPost.recruiter_id,
    kind: "application",
    title: `A candidate has requested a meeting for ${jobPost.title}`,
    body: "Review and confirm the request from your Meetings page.",
  });

  redirect("/applicant/meetings");
}
