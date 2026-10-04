"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { createAdminSupabaseClient } from "@/lib/supabase/adminClient";
import { updateOnboardingDocumentStatus } from "@/lib/db/onboardingDocuments";
import { insertNotification } from "@/lib/db/notifications";

export interface SignedUrlState {
  url?: string;
  error?: string;
}

export async function getSignedDownloadUrl(filePath: string): Promise<SignedUrlState> {
  await requireRole(["applicant", "admin"]);
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.storage
    .from("onboarding-docs")
    .createSignedUrl(filePath, 60);

  if (error || !data) {
    return { error: error?.message ?? "Could not generate download link." };
  }

  await supabase.rpc("mark_onboarding_document_downloaded", { doc_file_path: filePath });

  return { url: data.signedUrl };
}

export interface UploadSignedDocumentState {
  error?: string;
  success?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function uploadSignedOnboardingDocumentAction(
  _prev: UploadSignedDocumentState,
  formData: FormData,
): Promise<UploadSignedDocumentState> {
  const documentId = String(formData.get("documentId") ?? "");
  const file = formData.get("file") as File | null;

  if (!documentId || !file || file.size === 0) {
    return { error: "A file is required." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { error: "File size must be less than 5MB." };
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { error: "Invalid file type. Only PDF, DOC, and DOCX are allowed." };
  }

  const user = await requireRole("applicant");
  const supabase = await createSupabaseServerClient();

  const { data: doc, error: fetchError } = await supabase
    .from("onboarding_documents")
    .select("id, application_id, status, label")
    .eq("id", documentId)
    .maybeSingle();

  if (fetchError || !doc) {
    return { error: "Document not found." };
  }
  if (doc.status !== "sent" && doc.status !== "rejected") {
    return { error: "This document has already been signed." };
  }

  const { data: application } = await supabase
    .from("applications")
    .select("applicant_id, job_post_id")
    .eq("id", doc.application_id)
    .maybeSingle();

  if (!application || application.applicant_id !== user.id) {
    return { error: "Document not found." };
  }

  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filePath = `${doc.application_id}/${Date.now()}-${sanitizedName}`;

  const { error: uploadError } = await supabase.storage
    .from("onboarding-docs")
    .upload(filePath, file, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return { error: `Storage Error: ${uploadError.message}` };
  }

  const { error: updateError } = await updateOnboardingDocumentStatus(supabase, doc.id, {
    signed_file_path: filePath,
    status: "signed",
    signed_at: new Date().toISOString(),
  });

  if (updateError) {
    await supabase.storage.from("onboarding-docs").remove([filePath]);
    return { error: `Database Error: ${updateError.message}` };
  }

  const admin = createAdminSupabaseClient();
  const { data: jobPost } = await admin
    .from("job_posts")
    .select("recruiter_id, title")
    .eq("id", application.job_post_id)
    .maybeSingle();

  if (jobPost?.recruiter_id) {
    await insertNotification(admin, {
      user_id: jobPost.recruiter_id,
      kind: "application",
      title: `${doc.label} has been signed and returned for ${jobPost.title}`,
      body: "Review it from the talent board to accept.",
    });
  }

  revalidatePath("/applicant/hire-docs");
  return { success: true };
}