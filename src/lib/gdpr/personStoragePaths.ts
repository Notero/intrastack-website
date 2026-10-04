import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

type DB = SupabaseClient<Database>;

export type PersonStoragePaths = {
  resumes: string[];
  representation_agreements: string[];
  onboarding_docs: string[];
  offer_letters: string[];
};

/**
 * Every private-bucket object path tied to one person, across the 4 buckets
 * that hold PII (resumes, representation_agreements, onboarding-docs,
 * offer-letters). Shared by exportUserData (signs these for download) and
 * deleteUserData (removes them) — same "which files belong to this person"
 * question, different thing done with the answer.
 *
 * `resumeUrl` and `applicationIds` are passed in rather than re-queried
 * here since both callers already have them from their own profile/
 * applications lookups.
 */
export async function personStoragePaths(
  admin: DB,
  subjectId: string,
  resumeUrl: string | null | undefined,
  applications: { id: string; resume_url: string | null; cover_letter_url: string | null }[],
): Promise<PersonStoragePaths> {
  const resumes = [
    ...new Set(
      [resumeUrl, ...applications.flatMap((a) => [a.resume_url, a.cover_letter_url])].filter(
        (p): p is string => !!p,
      ),
    ),
  ];

  // representation_agreements has no DB column tracking file paths (see
  // applicant/onboarding/actions.ts) — list the user's folder instead.
  const { data: rtrFiles } = await admin.storage.from("representation_agreements").list(subjectId);
  const representation_agreements = (rtrFiles ?? []).map((f) => `${subjectId}/${f.name}`);

  // onboarding-docs and offer-letters are keyed by application id, not
  // user id (see admin/hire-docs/actions.ts and 0023_offer_letters.sql).
  const applicationIds = applications.map((a) => a.id);

  const onboardingLists = await Promise.all(
    applicationIds.map((id) => admin.storage.from("onboarding-docs").list(id)),
  );
  const onboarding_docs = onboardingLists.flatMap(({ data }, i) =>
    (data ?? []).map((f) => `${applicationIds[i]}/${f.name}`),
  );

  const offerLetterLists = await Promise.all(
    applicationIds.flatMap((id) => [
      admin.storage.from("offer-letters").list(`${id}/original`),
      admin.storage.from("offer-letters").list(`${id}/signed`),
    ]),
  );
  const offer_letters = offerLetterLists.flatMap(({ data }, i) => {
    const appId = applicationIds[Math.floor(i / 2)];
    const sub = i % 2 === 0 ? "original" : "signed";
    return (data ?? []).map((f) => `${appId}/${sub}/${f.name}`);
  });

  return { resumes, representation_agreements, onboarding_docs, offer_letters };
}
