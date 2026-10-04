import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { selectOnboardingDocumentsByApplicationIds } from "@/lib/db/onboardingDocuments";
import { personStoragePaths } from "@/lib/gdpr/personStoragePaths";

async function signAll(admin: DB, bucket: string, paths: string[]) {
  if (!paths.length) return [];
  const { data } = await admin.storage.from(bucket).createSignedUrls(paths, 3600);
  return data ?? [];
}

type DB = SupabaseClient<Database>;

const ROLE_PROFILE_TABLE = {
  admin: "admin_profiles",
  customer: "customer_profiles",
  recruiter: "customer_profiles",
  applicant: "applicant_profiles",
} as const;

/**
 * Assembles every row tied to one person across the tables named in
 * GDPR/CCPA task 9A, plus signed URLs for their private-bucket files.
 * `admin` must be the service-role client (bypasses RLS by design — this
 * is the one place that needs to read across every table regardless of
 * ownership).
 */
export async function exportUserData(admin: DB, subjectId: string) {
  const { data: profile } = await admin
    .from("profiles")
    .select("*")
    .eq("id", subjectId)
    .maybeSingle();

  const roleTable = profile ? ROLE_PROFILE_TABLE[profile.role] : null;
  const { data: roleProfile } = roleTable
    ? await admin.from(roleTable).select("*").eq("id", subjectId).maybeSingle()
    : { data: null };

  const { data: applications } = await admin
    .from("applications")
    .select("*")
    .eq("applicant_id", subjectId);

  const { data: resumeParses } = await admin
    .from("resume_parses")
    .select("*")
    .eq("applicant_id", subjectId);

  const { data: resumeMatches } = await admin
    .from("resume_matches")
    .select("*")
    .eq("applicant_id", subjectId);

  const { data: savedJobs } = await admin
    .from("saved_jobs")
    .select("*")
    .eq("applicant_id", subjectId);

  const { data: notifications } = await admin
    .from("notifications")
    .select("*")
    .eq("user_id", subjectId);

  const { data: meetings } = await admin
    .from("meetings")
    .select("*")
    .or(`applicant_id.eq.${subjectId},customer_id.eq.${subjectId}`);

  const applicationIds = (applications ?? []).map((a) => a.id);
  const { data: onboardingByApplication } = await selectOnboardingDocumentsByApplicationIds(
    admin,
    applicationIds,
  );
  const { data: onboardingUploadedByUser } = await admin
    .from("onboarding_documents")
    .select("*")
    .eq("uploaded_by", subjectId);
  const onboardingDocuments = [
    ...(onboardingByApplication ?? []),
    ...(onboardingUploadedByUser ?? []).filter(
      (d) => !applicationIds.includes(d.application_id),
    ),
  ];

  const { data: tickets } = await admin
    .from("tickets")
    .select("*")
    .eq("requester_id", subjectId);

  const { data: ticketReplies } = await admin
    .from("ticket_replies")
    .select("*")
    .eq("author_id", subjectId);

  const { data: jobPosts } = await admin
    .from("job_posts")
    .select("*")
    .eq("recruiter_id", subjectId);

  // offer_letters isn't in 9A's original table list but holds the same
  // class of PII (a signed offer letter) tied to applicant/customer/
  // uploader — see 0023_offer_letters.sql.
  const { data: offerLetters } = await admin
    .from("offer_letters")
    .select("*")
    .or(`applicant_id.eq.${subjectId},customer_id.eq.${subjectId},uploaded_by.eq.${subjectId}`);

  const paths = await personStoragePaths(
    admin,
    subjectId,
    (roleProfile as { resume_url?: string | null } | null)?.resume_url,
    applications ?? [],
  );

  return {
    profile,
    role_profile: roleProfile,
    applications: applications ?? [],
    resume_parses: resumeParses ?? [],
    resume_matches: resumeMatches ?? [],
    saved_jobs: savedJobs ?? [],
    notifications: notifications ?? [],
    meetings: meetings ?? [],
    onboarding_documents: onboardingDocuments,
    tickets: tickets ?? [],
    ticket_replies: ticketReplies ?? [],
    job_posts: jobPosts ?? [],
    offer_letters: offerLetters ?? [],
    storage: {
      resumes: await signAll(admin, "resumes", paths.resumes),
      representation_agreements: await signAll(
        admin,
        "representation_agreements",
        paths.representation_agreements,
      ),
      onboarding_docs: await signAll(admin, "onboarding-docs", paths.onboarding_docs),
      offer_letters: await signAll(admin, "offer-letters", paths.offer_letters),
    },
  };
}
