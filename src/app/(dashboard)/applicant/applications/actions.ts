"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { createAdminSupabaseClient } from "@/lib/supabase/adminClient";
import { updateOfferLetterStatus } from "@/lib/db/offerLetters";
import { insertNotification } from "@/lib/db/notifications";

export interface SignedUrlState {
  url?: string;
  error?: string;
}

export async function getOfferLetterDownloadUrlAction(filePath: string): Promise<SignedUrlState> {
  await requireRole(["applicant", "admin"]);
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.storage
    .from("offer-letters")
    .createSignedUrl(filePath, 60);

  if (error || !data) {
    return { error: error?.message ?? "Could not generate download link." };
  }

  return { url: data.signedUrl };
}

export interface UploadSignedOfferState {
  error?: string;
  success?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function uploadSignedOfferAction(
  _prev: UploadSignedOfferState,
  formData: FormData,
): Promise<UploadSignedOfferState> {
  const applicationId = String(formData.get("applicationId") ?? "");
  const file = formData.get("file") as File | null;

  if (!applicationId || !file || file.size === 0) {
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

  const { data: offerLetter, error: fetchError } = await supabase
    .from("offer_letters")
    .select("id, applicant_id, status, customer_id, job_post_id")
    .eq("application_id", applicationId)
    .maybeSingle();

  if (fetchError || !offerLetter || offerLetter.applicant_id !== user.id) {
    return { error: "Offer letter not found." };
  }
  if (offerLetter.status !== "sent") {
    return { error: "This offer has already been signed." };
  }

  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filePath = `${applicationId}/signed/${Date.now()}-${sanitizedName}`;

  const { error: uploadError } = await supabase.storage
    .from("offer-letters")
    .upload(filePath, file, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return { error: `Storage Error: ${uploadError.message}` };
  }

  const { error: updateError } = await updateOfferLetterStatus(supabase, offerLetter.id, {
    signed_file_path: filePath,
    status: "signed",
    signed_at: new Date().toISOString(),
  });

  if (updateError) {
    await supabase.storage.from("offer-letters").remove([filePath]);
    return { error: `Database Error: ${updateError.message}` };
  }

  const admin = createAdminSupabaseClient();
  const { data: job } = await admin.from("job_posts").select("title").eq("id", offerLetter.job_post_id).maybeSingle();
  await insertNotification(admin, {
    user_id: offerLetter.customer_id,
    kind: "application",
    title: `The offer letter for ${job?.title ?? "your role"} has been signed and returned`,
    body: "Review it from the talent board to accept.",
  });

  revalidatePath("/applicant/applications");
  return { success: true };
}
