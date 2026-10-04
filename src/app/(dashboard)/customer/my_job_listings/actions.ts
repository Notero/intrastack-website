"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { deleteJobPost } from "@/lib/db/jobPosts";
import {
  JOB_POST_SNAPSHOT_COLUMNS,
  recordJobPostOutcome,
} from "@/lib/db/jobPostHistory";

export async function withdrawJobListing(jobId: string): Promise<void> {
  const user = await requireRole(["customer", "admin"]);
  const supabase = await createSupabaseServerClient();

  const { data: job } = await supabase
    .from("job_posts")
    .select(JOB_POST_SNAPSHOT_COLUMNS)
    .eq("id", jobId)
    .eq("recruiter_id", user.id)
    .eq("published", false)
    .single();

  if (job) {
    await recordJobPostOutcome(supabase, job, "withdrawn", user.id);
    await deleteJobPost(supabase, jobId, { recruiterId: user.id, published: false });
  }

  revalidatePath("/customer/my_job_listings");
}
