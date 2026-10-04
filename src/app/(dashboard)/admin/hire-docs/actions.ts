"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { createAdminSupabaseClient } from "@/lib/supabase/adminClient";
import { insertOnboardingDocument } from "@/lib/db/onboardingDocuments";
import { insertNotification } from "@/lib/db/notifications";

export interface UploadState {
  error?: string;
  success?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function uploadOnboardingDocument(
  _prev: UploadState,
  formData: FormData,
): Promise<UploadState> {
  const applicationId = String(formData.get("applicationId") ?? "");
  const label = String(formData.get("label") ?? "").trim();
  const file = formData.get("file") as File | null;

  if (!applicationId || !label || !file || file.size === 0) {
    return { error: "Label and file are required." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { error: "File size must be less than 5MB." };
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { error: "Invalid file type. Only PDF, DOC, and DOCX are allowed." };
  }

  const user = await requireRole("admin");
  const supabase = await createSupabaseServerClient();

  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filePath = `${applicationId}/${Date.now()}-${sanitizedName}`;

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

  const { error: insertError } = await insertOnboardingDocument(supabase, {
    application_id: applicationId,
    uploaded_by: user.id,
    file_path: filePath,
    label,
  });

  if (insertError) {
    await supabase.storage.from("onboarding-docs").remove([filePath]);
    return { error: `Database Error: ${insertError.message}` };
  }

  const admin = createAdminSupabaseClient();
  const { data: application } = await admin
    .from("applications")
    .select("applicant_id, job_post_id")
    .eq("id", applicationId)
    .maybeSingle();

  if (application) {
    const { data: job } = await admin.from("job_posts").select("title").eq("id", application.job_post_id).maybeSingle();
    await insertNotification(admin, {
      user_id: application.applicant_id,
      kind: "application",
      title: `Onboarding documents are ready for ${job?.title ?? "your role"}`,
      body: "Review and sign them from your Hire Docs page.",
    });
  }

  revalidatePath("/admin/hire-docs");
  return { success: true };
}
