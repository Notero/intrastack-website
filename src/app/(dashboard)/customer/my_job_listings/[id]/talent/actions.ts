"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { createAdminSupabaseClient } from "@/lib/supabase/adminClient";
import { updateApplicationStatus } from "@/lib/db/applications";
import { insertOnboardingDocument, updateOnboardingDocumentStatus } from "@/lib/db/onboardingDocuments";
import { insertOfferLetter, updateOfferLetterStatus } from "@/lib/db/offerLetters";
import { updateProfile } from "@/lib/db/profiles";
import { logTableEvent } from "@/lib/audit/logTableEvent";
import { insertNotification } from "@/lib/db/notifications";
import type { Enums } from "@/lib/supabase/database.types";

// Statuses a customer can set. Not 'submitted', and not 'accepted'/'withdrawn'
// which are the applicant's to set.
const CUSTOMER_STATUSES: readonly Enums<"application_status">[] = [
  "reviewing",
  "interview",
  "offer",
  "rejected",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// Returns the service-role client (bypasses RLS) once ownership is verified,
// plus the job's actual owning customer id — NOT the caller's id, since an
// admin acting on a customer's behalf must still attribute writes (e.g.
// offer_letters.customer_id, profiles.employer_id) to that customer, not
// to the admin. Returns null if the caller doesn't own this job (admins
// always pass).
async function getOwnedJob(jobId: string, userId: string, userRole: string) {
  const admin = createAdminSupabaseClient();
  const { data: job } = await admin
    .from("job_posts")
    .select("recruiter_id, title")
    .eq("id", jobId)
    .maybeSingle();

  if (!job || (userRole !== "admin" && job.recruiter_id !== userId)) {
    return null;
  }
  return { admin, employerId: job.recruiter_id, title: job.title };
}

export async function updateTalentStatusAction(
  jobId: string,
  applicationId: string,
  newStatus: Enums<"application_status">,
): Promise<void> {
  const user = await requireRole(["customer", "admin"]);

  if (!CUSTOMER_STATUSES.includes(newStatus)) {
    throw new Error("Unauthorized: that status can't be set from the talent board");
  }

  const owned = await getOwnedJob(jobId, user.id, user.role);
  if (!owned) throw new Error("Unauthorized");

  const { data: before } = await owned.admin
    .from("applications")
    .select("status")
    .eq("id", applicationId)
    .maybeSingle();

  const { error } = await updateApplicationStatus(owned.admin, applicationId, newStatus, jobId);
  if (error) throw new Error(error.message);

  await logTableEvent({
    actorId: user.id,
    actorRole: user.role,
    action: "application_status_changed",
    tableName: "applications",
    rowId: applicationId,
    before: before ? { status: before.status } : null,
    after: { status: newStatus },
  });

  revalidatePath(`/customer/my_job_listings/${jobId}/talent`);
}

export interface UploadState {
  error?: string;
  success?: boolean;
}

export async function uploadOnboardingDocument(
  _prev: UploadState,
  formData: FormData,
): Promise<UploadState> {
  const jobId = String(formData.get("jobId") ?? "");
  const applicationId = String(formData.get("applicationId") ?? "");
  const label = String(formData.get("label") ?? "").trim();
  const file = formData.get("file") as File | null;

  if (!jobId || !applicationId || !label || !file || file.size === 0) {
    return { error: "Label and file are required." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { error: "File size must be less than 5MB." };
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { error: "Invalid file type. Only PDF, DOC, and DOCX are allowed." };
  }

  const user = await requireRole(["customer", "admin"]);

  const owned = await getOwnedJob(jobId, user.id, user.role);
  if (!owned) {
    return { error: "Unauthorized: you do not have permission to manage this applicant." };
  }
  const { admin, title } = owned;

  // Validate at the trust boundary: the talent board only shows this form
  // once the customer has accepted the applicant's signed offer, but the
  // action must enforce that too rather than trusting the client to have
  // hidden the form.
  const { data: offerLetter } = await admin
    .from("offer_letters")
    .select("status")
    .eq("application_id", applicationId)
    .maybeSingle();

  if (offerLetter?.status !== "accepted") {
    return { error: "The signed offer must be accepted before uploading onboarding documents." };
  }

  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filePath = `${applicationId}/${Date.now()}-${sanitizedName}`;

  const { error: uploadError } = await admin.storage
    .from("onboarding-docs")
    .upload(filePath, file, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return { error: `Storage Error: ${uploadError.message}` };
  }

  const { error: insertError } = await insertOnboardingDocument(admin, {
    application_id: applicationId,
    uploaded_by: user.id,
    file_path: filePath,
    label,
  });

  if (insertError) {
    await admin.storage.from("onboarding-docs").remove([filePath]);
    return { error: `Database Error: ${insertError.message}` };
  }

  const { data: application } = await admin
    .from("applications")
    .select("applicant_id")
    .eq("id", applicationId)
    .maybeSingle();

  if (application) {
    await insertNotification(admin, {
      user_id: application.applicant_id,
      kind: "application",
      title: `Onboarding documents are ready for ${title}`,
      body: "Review and sign them from your Hire Docs page.",
    });
  }

  revalidatePath(`/customer/my_job_listings/${jobId}/talent`);
  return { success: true };
}

// ─── Offer letter round trip ────────────────────────────────────────────────

export async function sendOfferLetterAction(
  _prev: UploadState,
  formData: FormData,
): Promise<UploadState> {
  const jobId = String(formData.get("jobId") ?? "");
  const applicationId = String(formData.get("applicationId") ?? "");
  const file = formData.get("file") as File | null;

  if (!jobId || !applicationId || !file || file.size === 0) {
    return { error: "A file is required." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { error: "File size must be less than 5MB." };
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { error: "Invalid file type. Only PDF, DOC, and DOCX are allowed." };
  }

  const user = await requireRole(["customer", "admin"]);

  const owned = await getOwnedJob(jobId, user.id, user.role);
  if (!owned) {
    return { error: "Unauthorized: you do not have permission to manage this applicant." };
  }
  const { admin, employerId } = owned;
  if (!employerId) {
    return { error: "This job listing has no assigned customer." };
  }

  const { data: application } = await admin
    .from("applications")
    .select("status, applicant_id")
    .eq("id", applicationId)
    .maybeSingle();

  if (!application || application.status !== "interview") {
    return { error: "This application isn't awaiting an offer decision." };
  }

  const { data: completedMeeting } = await admin
    .from("meetings")
    .select("id")
    .eq("application_id", applicationId)
    .eq("status", "completed")
    .limit(1)
    .maybeSingle();

  if (!completedMeeting) {
    return { error: "Interview must be completed before sending an offer." };
  }

  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filePath = `${applicationId}/original/${Date.now()}-${sanitizedName}`;

  const { error: uploadError } = await admin.storage
    .from("offer-letters")
    .upload(filePath, file, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return { error: `Storage Error: ${uploadError.message}` };
  }

  const { error: insertError } = await insertOfferLetter(admin, {
    application_id: applicationId,
    job_post_id: jobId,
    customer_id: employerId,
    applicant_id: application.applicant_id,
    uploaded_by: user.id,
    file_path: filePath,
  });

  if (insertError) {
    await admin.storage.from("offer-letters").remove([filePath]);
    return { error: `Database Error: ${insertError.message}` };
  }

  const { error: statusError } = await updateApplicationStatus(admin, applicationId, "offer", jobId);
  if (statusError) {
    return { error: `Status update failed: ${statusError.message}` };
  }

  revalidatePath(`/customer/my_job_listings/${jobId}/talent`);
  return { success: true };
}

export async function acceptSignedOfferAction(jobId: string, applicationId: string): Promise<void> {
  const user = await requireRole(["customer", "admin"]);

  const owned = await getOwnedJob(jobId, user.id, user.role);
  if (!owned) throw new Error("Unauthorized");
  const { admin } = owned;

  const { data: offerLetter } = await admin
    .from("offer_letters")
    .select("id, status")
    .eq("application_id", applicationId)
    .maybeSingle();

  if (!offerLetter || offerLetter.status !== "signed") {
    throw new Error("The applicant hasn't signed and returned the offer yet.");
  }

  const { error: offerError } = await updateOfferLetterStatus(admin, offerLetter.id, {
    status: "accepted",
    accepted_at: new Date().toISOString(),
  });
  if (offerError) throw new Error(offerError.message);

  // Direct call, not routed through updateTalentStatusAction/CUSTOMER_STATUSES
  // — the generic dropdown must never be able to set "accepted" on its own;
  // only this specific, guarded transition can.
  const { error: statusError } = await updateApplicationStatus(admin, applicationId, "accepted", jobId);
  if (statusError) throw new Error(statusError.message);

  revalidatePath(`/customer/my_job_listings/${jobId}/talent`);
}

// ─── Onboarding-document round trip ─────────────────────────────────────────

export async function acceptOnboardingDocumentAction(jobId: string, documentId: string): Promise<void> {
  const user = await requireRole(["customer", "admin"]);

  const owned = await getOwnedJob(jobId, user.id, user.role);
  if (!owned) throw new Error("Unauthorized");
  const { admin, employerId, title } = owned;
  if (!employerId) throw new Error("This job listing has no assigned customer.");

  const { data: doc } = await admin
    .from("onboarding_documents")
    .select("id, application_id, status, label")
    .eq("id", documentId)
    .maybeSingle();

  if (!doc || doc.status !== "signed") {
    throw new Error("This document hasn't been signed and returned yet.");
  }

  const { error: docError } = await updateOnboardingDocumentStatus(admin, doc.id, {
    status: "accepted",
    accepted_at: new Date().toISOString(),
  });
  if (docError) throw new Error(docError.message);

  const { data: application } = await admin
    .from("applications")
    .select("applicant_id")
    .eq("id", doc.application_id)
    .maybeSingle();

  if (application) {
    await insertNotification(admin, {
      user_id: application.applicant_id,
      kind: "application",
      title: `Your ${doc.label} document was accepted`,
      body: `Confirmed for ${title}.`,
    });
  }

  // If every required document for this application is now accepted,
  // attach the applicant to this customer as an employee.
  const { data: allDocs } = await admin
    .from("onboarding_documents")
    .select("required, status")
    .eq("application_id", doc.application_id);

  const requiredDocs = (allDocs ?? []).filter((d) => d.required);
  const allRequiredAccepted =
    requiredDocs.length > 0 && requiredDocs.every((d) => d.status === "accepted");

  if (allRequiredAccepted && application) {
    const { error: profileError } = await updateProfile(admin, application.applicant_id, {
      employer_id: employerId,
      employer_since: new Date().toISOString(),
    });
    if (profileError) throw new Error(profileError.message);
  }

  revalidatePath(`/customer/my_job_listings/${jobId}/talent`);
}

export async function rejectOnboardingDocumentAction(jobId: string, documentId: string): Promise<void> {
  const user = await requireRole(["customer", "admin"]);

  const owned = await getOwnedJob(jobId, user.id, user.role);
  if (!owned) throw new Error("Unauthorized");
  const { admin, title } = owned;

  const { data: doc } = await admin
    .from("onboarding_documents")
    .select("id, application_id, status, label")
    .eq("id", documentId)
    .maybeSingle();

  if (!doc || doc.status !== "signed") {
    throw new Error("This document hasn't been signed and returned yet.");
  }

  const { error } = await updateOnboardingDocumentStatus(admin, doc.id, {
    status: "rejected",
    rejected_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);

  const { data: application } = await admin
    .from("applications")
    .select("applicant_id")
    .eq("id", doc.application_id)
    .maybeSingle();

  if (application) {
    await insertNotification(admin, {
      user_id: application.applicant_id,
      kind: "application",
      title: `Your ${doc.label} document needs to be resubmitted`,
      body: `See the notes on your Hire Docs page for ${title}.`,
    });
  }

  revalidatePath(`/customer/my_job_listings/${jobId}/talent`);
}
