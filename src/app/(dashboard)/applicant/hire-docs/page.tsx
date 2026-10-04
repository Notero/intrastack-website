import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { selectOnboardingDocumentsByApplicationIds } from "@/lib/db/onboardingDocuments";
import { DownloadButton } from "./DownloadButton";
import { UploadSignedDocumentForm } from "./UploadSignedDocumentForm";
import type { Enums } from "@/lib/supabase/database.types";

export const metadata = { title: "Hire Documents · Applicant" };

const STATUS_BADGE: Record<Enums<"onboarding_document_status">, { label: string; className: string }> = {
  sent: { label: "Needs your signature", className: "bg-amber-100 text-amber-700" },
  signed: { label: "Submitted — awaiting review", className: "bg-blue-100 text-blue-700" },
  accepted: { label: "Accepted", className: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "Rejected — please resend", className: "bg-red-100 text-red-600" },
};

export default async function HireDocsPage() {
  const user = await requireRole(["applicant", "admin"]);
  const supabase = await createSupabaseServerClient();

  const { data: applications } = await supabase
    .from("applications")
    .select("id, status")
    .eq("applicant_id", user.id)
    .eq("status", "accepted")
    .order("created_at", { ascending: false });

  const applicationIds = (applications ?? []).map((a) => a.id);

  const { data: documents } = await selectOnboardingDocumentsByApplicationIds(supabase, applicationIds);

  return (
    <div className="w-full space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Onboarding</p>
        <h1 className="text-2xl font-bold text-foreground">Hire Documents</h1>
        <p className="text-sm text-muted-foreground">
          Documents shared with you as part of your onboarding.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white">
        <ul className="divide-y divide-zinc-100">
          {(documents ?? []).map((doc) => {
            const badge = STATUS_BADGE[doc.status];
            return (
              <li key={doc.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-zinc-800">{doc.label}</div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="text-xs text-zinc-400">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${badge.className}`}>
                        {badge.label}
                      </span>
                    </div>
                  </div>
                  <DownloadButton filePath={doc.file_path} />
                </div>
                {(doc.status === "sent" || doc.status === "rejected") && (
                  <UploadSignedDocumentForm documentId={doc.id} />
                )}
              </li>
            );
          })}
          {(documents ?? []).length === 0 && (
            <li className="px-6 py-10 text-center text-sm text-zinc-400">
              No documents available yet.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}