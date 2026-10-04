"use server";

import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { requireRole } from "@/lib/auth/session";
import { unsaveJob } from "@/lib/db/savedJobs";

export async function unsaveJobAction(jobPostId: string) {
  const user = await requireRole("applicant");
  const supabase = await createSupabaseServerClient();

  const { error } = await unsaveJob(supabase, user.id, jobPostId);

  if (error) console.error("[saved-jobs] unsave failed:", error.message);
}
