import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert, TablesUpdate } from "@/lib/supabase/database.types";

type DB = SupabaseClient<Database>;

export function insertOnboardingDocument(db: DB, row: TablesInsert<"onboarding_documents">) {
  return db.from("onboarding_documents").insert(row);
}

export function selectOnboardingDocumentsByApplicationIds(db: DB, applicationIds: string[]) {
  return db
    .from("onboarding_documents")
    .select(
      "id, application_id, label, file_path, required, downloaded_at, created_at, status, signed_file_path, signed_at, accepted_at, rejected_at"
    )
    .in("application_id", applicationIds.length > 0 ? applicationIds : [""])
    .order("created_at", { ascending: false });
}

export function updateOnboardingDocumentStatus(db: DB, id: string, patch: TablesUpdate<"onboarding_documents">) {
  return db.from("onboarding_documents").update(patch).eq("id", id);
}
