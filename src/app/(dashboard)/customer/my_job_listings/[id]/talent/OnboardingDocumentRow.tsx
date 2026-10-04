"use client";

import { useState, useTransition } from "react";
import { Check, Download, Loader2, X } from "lucide-react";
import { acceptOnboardingDocumentAction, rejectOnboardingDocumentAction } from "./actions";
import type { Enums } from "@/lib/supabase/database.types";

interface Props {
  jobId: string;
  documentId: string;
  label: string;
  createdAt: string;
  status: Enums<"onboarding_document_status">;
  signedFileUrl: string | null;
}

export function OnboardingDocumentRow({ jobId, documentId, label, createdAt, status, signedFileUrl }: Props) {
  const [pending, start] = useTransition();
  const [failed, setFailed] = useState(false);

  function act(action: (jobId: string, documentId: string) => Promise<void>) {
    if (pending) return;
    setFailed(false);
    start(async () => {
      try {
        await action(jobId, documentId);
      } catch {
        setFailed(true);
      }
    });
  }

  return (
    <li className="py-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-700">{label}</span>
        <span className="text-xs text-zinc-400">{new Date(createdAt).toLocaleDateString()}</span>
      </div>

      <div className="mt-1 flex items-center gap-2">
        {status === "sent" && <span className="text-xs text-zinc-500">Awaiting applicant</span>}

        {status === "signed" && (
          <>
            {signedFileUrl && (
              <a
                href={signedFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-brand-500 hover:underline"
              >
                <Download className="size-3.5" />
                Download signed copy
              </a>
            )}
            <button
              type="button"
              onClick={() => act(acceptOnboardingDocumentAction)}
              disabled={pending}
              title="Accept"
              className="rounded p-1 text-zinc-400 transition-colors hover:bg-green-50 hover:text-green-600 disabled:opacity-50"
            >
              <Check className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => act(rejectOnboardingDocumentAction)}
              disabled={pending}
              title="Reject"
              className="rounded p-1 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
            >
              <X className="size-4" />
            </button>
            {pending && <Loader2 className="size-3.5 animate-spin text-zinc-400" />}
          </>
        )}

        {status === "accepted" && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
            <Check className="size-3.5" />
            Accepted
          </span>
        )}

        {status === "rejected" && (
          <span className="text-xs text-red-500">Rejected — waiting on applicant to resend</span>
        )}
      </div>

      {failed && <span className="text-[10px] text-red-500">Update failed, try again.</span>}
    </li>
  );
}
