"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { createAdminSupabaseClient } from "@/lib/supabase/adminClient";
import { updateMeetingStatus, type MeetingStatus } from "@/lib/db/meetings";
import { insertNotification } from "@/lib/db/notifications";

export async function updateMeetingStatusAction(args: {
  meetingId: string;
  status: "confirmed" | "cancelled" | "completed";
  meetingLink?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const user = await requireRole(["customer", "admin"]);
  const supabase = await createSupabaseServerClient();

  // Fetch the meeting to verify authorization and get the proposed time
  const { data: meeting, error: fetchError } = await (supabase as unknown as import("@supabase/supabase-js").SupabaseClient)
    .from("meetings")
    .select("id, customer_id, applicant_id, job_post_id, proposed_at")
    .eq("id", args.meetingId)
    .single();

  if (fetchError || !meeting) {
    return { ok: false, error: "Meeting not found." };
  }

  // Only the customer on the meeting or an admin can update
  if (user.role !== "admin" && meeting.customer_id !== user.id) {
    return { ok: false, error: "You are not authorized to update this meeting." };
  }

  const allowed: MeetingStatus[] = ["confirmed", "cancelled", "completed"];
  if (!allowed.includes(args.status)) {
    return { ok: false, error: "Invalid status." };
  }

  // Confirming locks in the proposed time as the scheduled time, and is the
  // only point at which the customer-supplied meeting link is written. A
  // link is required to confirm — validated here, not just in the form.
  const trimmedLink = args.meetingLink?.trim();
  if (args.status === "confirmed" && !trimmedLink) {
    return { ok: false, error: "A meeting link is required to confirm." };
  }

  const scheduledAt = args.status === "confirmed" ? meeting.proposed_at : undefined;
  const meetingLink = args.status === "confirmed" ? trimmedLink : undefined;
  const { error } = await updateMeetingStatus(supabase, args.meetingId, args.status, scheduledAt, meetingLink);

  if (error) {
    console.error("[meetings] status update failed:", error.message);
    return { ok: false, error: error.message };
  }

  if (args.status === "confirmed" || args.status === "cancelled") {
    const admin = createAdminSupabaseClient();
    const { data: job } = await admin.from("job_posts").select("title").eq("id", meeting.job_post_id).maybeSingle();
    const jobTitle = job?.title ?? "your role";
    await insertNotification(admin, {
      user_id: meeting.applicant_id,
      kind: "application",
      title: args.status === "confirmed"
        ? `Your meeting for ${jobTitle} has been confirmed`
        : `Your meeting for ${jobTitle} has been cancelled`,
      body: args.status === "confirmed"
        ? "Check your Meetings page for the details and link."
        : "Check your Meetings page for next steps.",
    });
  }

  revalidatePath("/customer/meetings");
  revalidatePath("/applicant/meetings");
  revalidatePath("/admin/meetings");
  return { ok: true };
}
