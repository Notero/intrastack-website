import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { createAdminSupabaseClient } from "@/lib/supabase/adminClient";
import { PageHeader } from "../../../_components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText, Users } from "lucide-react";
import { TalentActions } from "./TalentActions";
import { UploadDocumentForm } from "./UploadDocumentForm";
import { OfferLetterPanel } from "./OfferLetterPanel";
import { OnboardingDocumentRow } from "./OnboardingDocumentRow";
import { selectOnboardingDocumentsByApplicationIds } from "@/lib/db/onboardingDocuments";
import { selectOfferLettersByApplicationIds } from "@/lib/db/offerLetters";
import type { Enums } from "@/lib/supabase/database.types";

export const metadata = { title: "Talent · Customer" };

const STATUS_META: Record<Enums<"application_status">, { label: string; className: string }> = {
  submitted: { label: "Submitted", className: "bg-zinc-100 text-zinc-600" },
  reviewing: { label: "Reviewing", className: "bg-blue-50 text-blue-600" },
  interview: { label: "Interview", className: "bg-violet-50 text-violet-600" },
  offer:     { label: "Offer",     className: "bg-green-50 text-green-600" },
  accepted:  { label: "Accepted",  className: "bg-emerald-50 text-emerald-600" },
  rejected:  { label: "Rejected",  className: "bg-red-50 text-red-500" },
  withdrawn: { label: "Withdrawn", className: "bg-zinc-100 text-zinc-500" },
};

type PageProps = { params: Promise<{ id: string }> };

export default async function TalentPage({ params }: PageProps) {
  const { id } = await params;
  const user = await requireRole(["customer", "admin"]);
  const supabase = await createSupabaseServerClient();

  // Confirm the caller owns this listing before showing anyone (admins may view any).
  let jobQuery = supabase
    .from("job_posts")
    .select("id,title,team,location,employment_type,seniority")
    .eq("id", id);
  if (user.role !== "admin") jobQuery = jobQuery.eq("recruiter_id", user.id);
  const { data: job } = await jobQuery.maybeSingle();
  if (!job) notFound();

  // Session client, so the applications customer-select policy gates what's visible.
  const { data: apps } = await supabase
    .from("applications")
    .select("id,created_at,status,cover_letter,cover_letter_url,resume_url,applicant_id")
    .eq("job_post_id", job.id)
    .order("created_at", { ascending: false });

  const rows = apps ?? [];

  // Names too. The profiles customer-select policy exposes an applicant's
  // profile to whoever owns the job they applied to.
  const applicantIds = [...new Set(rows.map((r) => r.applicant_id))];
  const nameById = new Map<string, string>();
  if (applicantIds.length) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id,full_name,display_name,email")
      .in("id", applicantIds);
    for (const p of profiles ?? []) {
      nameById.set(p.id, p.full_name || p.display_name || p.email || "Applicant");
    }
  }

  // Resume + cover-letter files sit in a private bucket with no customer read
  // policy, so sign those with the service-role client.
  const paths = [
    ...new Set(rows.flatMap((r) => [r.resume_url, r.cover_letter_url]).filter((p): p is string => !!p)),
  ];
  const urlByPath = new Map<string, string>();
  if (paths.length) {
    const admin = createAdminSupabaseClient();
    const { data: signed } = await admin.storage.from("resumes").createSignedUrls(paths, 3600);
    for (const s of signed ?? []) {
      if (s.path && s.signedUrl) urlByPath.set(s.path, s.signedUrl);
    }
  }

  const appIds = rows.map((r) => r.id);

  // Onboarding-doc upload is gated on the applicant's interview meeting
  // having been marked completed — see customer/meetings.
  const completedAppIds = new Set<string>();
  if (appIds.length) {
    const { data: meetingRows } = await supabase
      .from("meetings")
      .select("application_id,status")
      .in("application_id", appIds);
    for (const m of meetingRows ?? []) {
      if (m.status === "completed") completedAppIds.add(m.application_id);
    }
  }

  const { data: docs } = await selectOnboardingDocumentsByApplicationIds(supabase, appIds);
  const docsByApp = new Map<string, NonNullable<typeof docs>[number][]>();
  for (const d of docs ?? []) {
    const list = docsByApp.get(d.application_id) ?? [];
    list.push(d);
    docsByApp.set(d.application_id, list);
  }

  // Signed URLs for onboarding documents the applicant has sent back for review.
  const signedDocPaths = (docs ?? [])
    .filter((d) => d.status === "signed" && d.signed_file_path)
    .map((d) => d.signed_file_path as string);
  const signedDocUrlByPath = new Map<string, string>();
  if (signedDocPaths.length) {
    const admin = createAdminSupabaseClient();
    const { data: signed } = await admin.storage.from("onboarding-docs").createSignedUrls(signedDocPaths, 3600);
    for (const s of signed ?? []) {
      if (s.path && s.signedUrl) signedDocUrlByPath.set(s.path, s.signedUrl);
    }
  }

  // Offer letters: gate both the post-interview send-or-reject panel and,
  // once accepted, the onboarding-documents panel below.
  const { data: offerLetterRows } = await selectOfferLettersByApplicationIds(supabase, appIds);
  const offerLetterByApp = new Map<string, NonNullable<typeof offerLetterRows>[number]>();
  for (const ol of offerLetterRows ?? []) {
    offerLetterByApp.set(ol.application_id, ol);
  }

  const signedOfferPaths = (offerLetterRows ?? [])
    .filter((ol) => ol.status === "signed" && ol.signed_file_path)
    .map((ol) => ol.signed_file_path as string);
  const signedOfferUrlByPath = new Map<string, string>();
  if (signedOfferPaths.length) {
    const admin = createAdminSupabaseClient();
    const { data: signed } = await admin.storage.from("offer-letters").createSignedUrls(signedOfferPaths, 3600);
    for (const s of signed ?? []) {
      if (s.path && s.signedUrl) signedOfferUrlByPath.set(s.path, s.signedUrl);
    }
  }

  const applicants = rows.map((r) => {
    const offerLetterRow = offerLetterByApp.get(r.id);
    return {
      id: r.id,
      name: nameById.get(r.applicant_id) ?? "Applicant",
      appliedAt: r.created_at,
      status: r.status,
      coverLetter: r.cover_letter,
      resumeUrl: r.resume_url ? urlByPath.get(r.resume_url) ?? null : null,
      coverLetterUrl: r.cover_letter_url ? urlByPath.get(r.cover_letter_url) ?? null : null,
      hasCompletedMeeting: completedAppIds.has(r.id),
      documents: docsByApp.get(r.id) ?? [],
      offerLetter: offerLetterRow
        ? {
            status: offerLetterRow.status,
            signedFileUrl: offerLetterRow.signed_file_path
              ? signedOfferUrlByPath.get(offerLetterRow.signed_file_path) ?? null
              : null,
          }
        : null,
    };
  });

  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="Talent"
        title={job.title}
        description={`${applicants.length} applicant${applicants.length === 1 ? "" : "s"} for this listing.`}
        actions={
          <Button asChild variant="outline">
            <Link href="/customer/my_job_listings">
              <ArrowLeft className="mr-1.5 size-4" />Back to listings
            </Link>
          </Button>
        }
      />

      {applicants.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-zinc-300 py-20 text-center">
          <Users className="size-10 text-zinc-300" />
          <p className="text-sm text-zinc-500">No applicants yet for this listing.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applicants.map((a) => {
            const meta = STATUS_META[a.status];
            return (
              <div key={a.id} className="rounded-xl border border-zinc-200 bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-zinc-900">{a.name}</span>
                      <Badge className={`inline-flex items-center gap-1 ${meta.className}`}>{meta.label}</Badge>
                    </div>
                    <div className="mt-0.5 text-xs text-zinc-400">
                      Applied {new Date(a.appliedAt).toLocaleDateString()}
                    </div>

                    {a.coverLetter && (
                      <p className="mt-2 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-zinc-600">
                        {a.coverLetter}
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                      {a.resumeUrl && (
                        <a
                          href={a.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-medium text-brand-500 hover:underline"
                        >
                          <Download className="size-3.5" />Resume
                        </a>
                      )}
                      {a.coverLetterUrl && (
                        <a
                          href={a.coverLetterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-medium text-brand-500 hover:underline"
                        >
                          <FileText className="size-3.5" />Cover letter file
                        </a>
                      )}
                    </div>
                  </div>

                  <TalentActions jobId={job.id} applicationId={a.id} status={a.status} />
                </div>

                <OfferLetterPanel
                  jobId={job.id}
                  applicationId={a.id}
                  applicationStatus={a.status}
                  hasCompletedMeeting={a.hasCompletedMeeting}
                  offerLetter={a.offerLetter}
                />

                {a.offerLetter?.status === "accepted" && (
                  <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50/50 p-4">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                      Onboarding documents
                    </h3>
                    {a.documents.length > 0 && (
                      <ul className="mt-2 divide-y divide-zinc-100">
                        {a.documents.map((doc) => (
                          <OnboardingDocumentRow
                            key={doc.id}
                            jobId={job.id}
                            documentId={doc.id}
                            label={doc.label}
                            createdAt={doc.created_at}
                            status={doc.status}
                            signedFileUrl={
                              doc.signed_file_path ? signedDocUrlByPath.get(doc.signed_file_path) ?? null : null
                            }
                          />
                        ))}
                      </ul>
                    )}
                    <UploadDocumentForm jobId={job.id} applicationId={a.id} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
