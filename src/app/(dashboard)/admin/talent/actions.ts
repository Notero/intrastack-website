"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { createAdminSupabaseClient } from "@/lib/supabase/adminClient";
import { updateApplicationStatus } from "@/lib/db/applications";
import type { Enums } from "@/lib/supabase/database.types";

const ALL_STATUSES: readonly Enums<"application_status">[] = [
  "submitted",
  "reviewing",
  "interview",
  "offer",
  "accepted",
  "rejected",
  "withdrawn",
];

// Admins can set any status on any application, including overriding what the
// customer who owns the listing already decided.
export async function updateApplicationStatusAsAdmin(
  applicationId: string,
  jobPostId: string,
  newStatus: Enums<"application_status">,
): Promise<void> {
  await requireRole("admin");

  if (!ALL_STATUSES.includes(newStatus)) {
    throw new Error("Unknown application status");
  }

  const admin = createAdminSupabaseClient();
  const { error } = await updateApplicationStatus(admin, applicationId, newStatus, jobPostId);
  if (error) throw new Error(error.message);

  // Keep the three places this row shows up in sync.
  revalidatePath("/admin/talent");
  revalidatePath(`/customer/my_job_listings/${jobPostId}/talent`);
  revalidatePath("/applicant/applications");
}
