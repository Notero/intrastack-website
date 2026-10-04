import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { personStoragePaths } from "@/lib/gdpr/personStoragePaths";

type DB = SupabaseClient<Database>;

/**
 * Permanently deletes one person's account and every row/file tied to it.
 * Row deletion happens via supabase.auth.admin.deleteUser(), which cascades
 * through the FK graph fixed in 0026_gdpr_erasure_fk_fixes.sql — that
 * migration must be applied first, or cross-party rows (another person's
 * ticket replies, onboarding docs, offer letters, meetings) will be
 * destroyed along with this account instead of surviving with a null FK.
 *
 * `admin` must be the service-role client (bypasses RLS by design).
 */
export async function deleteUserData(admin: DB, subjectId: string) {
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", subjectId)
    .maybeSingle();

  const roleTable =
    profile?.role === "admin"
      ? "admin_profiles"
      : profile?.role === "applicant"
        ? "applicant_profiles"
        : "customer_profiles";
  const { data: roleProfile } = await admin
    .from(roleTable)
    .select("*")
    .eq("id", subjectId)
    .maybeSingle();

  const { data: applications } = await admin
    .from("applications")
    .select("id, resume_url, cover_letter_url")
    .eq("applicant_id", subjectId);

  const paths = await personStoragePaths(
    admin,
    subjectId,
    (roleProfile as { resume_url?: string | null } | null)?.resume_url,
    applications ?? [],
  );

  if (paths.resumes.length) await admin.storage.from("resumes").remove(paths.resumes);
  if (paths.representation_agreements.length)
    await admin.storage.from("representation_agreements").remove(paths.representation_agreements);
  if (paths.onboarding_docs.length)
    await admin.storage.from("onboarding-docs").remove(paths.onboarding_docs);
  if (paths.offer_letters.length)
    await admin.storage.from("offer-letters").remove(paths.offer_letters);

  const { error } = await admin.auth.admin.deleteUser(subjectId);
  return { error };
}
