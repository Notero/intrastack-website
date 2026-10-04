"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { Check, Download, Loader2, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  acceptSignedOfferAction,
  sendOfferLetterAction,
  updateTalentStatusAction,
  type UploadState,
} from "./actions";
import type { Enums } from "@/lib/supabase/database.types";

const initialState: UploadState = {};

type OfferLetterInfo = {
  status: Enums<"offer_letter_status">;
  signedFileUrl: string | null;
} | null;

interface Props {
  jobId: string;
  applicationId: string;
  applicationStatus: Enums<"application_status">;
  hasCompletedMeeting: boolean;
  offerLetter: OfferLetterInfo;
}

export function OfferLetterPanel({
  jobId,
  applicationId,
  applicationStatus,
  hasCompletedMeeting,
  offerLetter,
}: Props) {
  // Post-interview decision: not sent yet, meeting done, still in interview.
  if (!offerLetter && hasCompletedMeeting && applicationStatus === "interview") {
    return (
      <DecisionPanel jobId={jobId} applicationId={applicationId} />
    );
  }

  if (offerLetter?.status === "sent") {
    return (
      <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50/50 p-4">
        <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-500">Offer letter</h3>
        <p className="mt-2 text-sm text-zinc-600">Sent — waiting for the applicant to sign and return it.</p>
      </div>
    );
  }

  if (offerLetter?.status === "signed") {
    return (
      <ReviewSignedOfferPanel
        jobId={jobId}
        applicationId={applicationId}
        signedFileUrl={offerLetter.signedFileUrl}
      />
    );
  }

  return null;
}

function DecisionPanel({ jobId, applicationId }: { jobId: string; applicationId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(sendOfferLetterAction, initialState);
  const [rejectPending, startReject] = useTransition();
  const [rejectFailed, setRejectFailed] = useState(false);

  useEffect(() => {
    if (state.success && !state.error) {
      formRef.current?.reset();
    }
  }, [state]);

  function reject() {
    if (pending || rejectPending) return;
    setRejectFailed(false);
    startReject(async () => {
      try {
        await updateTalentStatusAction(jobId, applicationId, "rejected");
      } catch {
        setRejectFailed(true);
      }
    });
  }

  return (
    <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50/50 p-4">
      <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-500">Interview complete</h3>
      <p className="mt-1 text-sm text-zinc-600">Send an offer letter to move this applicant to Offer, or reject.</p>

      <form ref={formRef} action={formAction} className="mt-3 flex flex-wrap items-center gap-2">
        <input type="hidden" name="jobId" value={jobId} />
        <input type="hidden" name="applicationId" value={applicationId} />
        <Input
          type="file"
          name="file"
          accept=".pdf,.doc,.docx"
          required
          disabled={pending || rejectPending}
          className="h-9 w-64 cursor-pointer text-xs file:font-medium file:text-primary file:hover:cursor-pointer"
        />
        <Button type="submit" size="sm" disabled={pending || rejectPending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          Send offer
        </Button>
        <button
          type="button"
          onClick={reject}
          disabled={pending || rejectPending}
          className="inline-flex items-center gap-1.5 rounded-md bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-500/20 disabled:opacity-50"
        >
          <X className="size-3.5" />
          Reject
        </button>
      </form>

      {state.error && <p className="mt-2 text-sm text-destructive">{state.error}</p>}
      {rejectFailed && <p className="mt-2 text-sm text-destructive">Reject failed, try again.</p>}
    </div>
  );
}

function ReviewSignedOfferPanel({
  jobId,
  applicationId,
  signedFileUrl,
}: {
  jobId: string;
  applicationId: string;
  signedFileUrl: string | null;
}) {
  const [pending, start] = useTransition();
  const [failed, setFailed] = useState(false);

  function accept() {
    if (pending) return;
    setFailed(false);
    start(async () => {
      try {
        await acceptSignedOfferAction(jobId, applicationId);
      } catch {
        setFailed(true);
      }
    });
  }

  return (
    <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50/50 p-4">
      <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-500">Signed offer</h3>
      <p className="mt-1 text-sm text-zinc-600">The applicant signed and returned the offer letter.</p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {signedFileUrl && (
          <a
            href={signedFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md bg-brand-500/10 px-3 py-1.5 text-xs font-medium text-brand-600 transition hover:bg-brand-500/20"
          >
            <Download className="size-3.5" />
            Download signed offer
          </a>
        )}
        <button
          type="button"
          onClick={accept}
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-500/20 disabled:opacity-50"
        >
          {pending ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
          Accept signed offer
        </button>
      </div>

      {failed && <p className="mt-2 text-sm text-destructive">Accept failed, try again.</p>}
    </div>
  );
}
