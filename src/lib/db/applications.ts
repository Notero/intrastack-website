import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Enums, TablesInsert } from "@/lib/supabase/database.types";
import { insertNotification } from "@/lib/db/notifications";

type DB = SupabaseClient<Database>;

export function insertApplication(db: DB, row: TablesInsert<"applications">) {
  return db.from("applications").insert(row);
}

// Notification copy for status transitions the applicant needs to know
// about. Statuses absent here (submitted, reviewing, withdrawn) get no
// notification from this choke point.
const STATUS_NOTIFICATIONS: Partial<Record<Enums<"application_status">, (jobTitle: string) => { title: string; body: string }>> = {
  interview: (jobTitle) => ({
    title: `You've been selected for an interview for ${jobTitle}`,
    body: "Please schedule a meeting from your Meetings page.",
  }),
  offer: (jobTitle) => ({
    title: `Congratulations — you've received an offer for ${jobTitle}`,
    body: "Review and sign your offer letter from your Applications page.",
  }),
  rejected: (jobTitle) => ({
    title: `Your application for ${jobTitle} was not selected at this time`,
    body: "Thank you for applying — we encourage you to apply to other open roles.",
  }),
  accepted: (jobTitle) => ({
    title: `You're officially hired for ${jobTitle} — welcome aboard!`,
    body: "Check your Hire Docs page for any remaining onboarding steps.",
  }),
};

// Every current call site passes an admin/service-role client, so the
// notification insert here needs no separate client — this is the single
// place all 4 status-changing actions converge, so it's also the single
// place that needs to know how to notify the applicant.
export async function updateApplicationStatus(
  db: DB,
  id: string,
  status: Enums<"application_status">,
  jobPostId: string,
) {
  const { data, error } = await db
    .from("applications")
    .update({ status })
    .eq("id", id)
    .eq("job_post_id", jobPostId)
    .select("applicant_id")
    .maybeSingle();

  const buildMessage = STATUS_NOTIFICATIONS[status];
  if (!error && data && buildMessage) {
    const { data: job } = await db.from("job_posts").select("title").eq("id", jobPostId).maybeSingle();
    const { title, body } = buildMessage(job?.title ?? "your role");
    await insertNotification(db, { user_id: data.applicant_id, kind: "application", title, body });
  }

  return { data, error };
}
