"use client";

import { useState, useTransition } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { updateTalentStatusAction } from "./actions";
import type { Enums } from "@/lib/supabase/database.types";

type Status = Enums<"application_status">;

// Accept/reject only make sense before an interview decision has been made.
// Past that point, the offer-letter panel (post-meeting) takes over.
const PRE_INTERVIEW_STATUSES: readonly Status[] = ["submitted", "reviewing"];

export function TalentActions({
  jobId,
  applicationId,
  status,
}: {
  jobId: string;
  applicationId: string;
  status: Status;
}) {
  const [pending, start] = useTransition();
  const [failed, setFailed] = useState(false);

  if (!PRE_INTERVIEW_STATUSES.includes(status)) {
    return null;
  }

  function set(next: Status) {
    if (next === status || pending) return;
    setFailed(false);
    start(async () => {
      try {
        await updateTalentStatusAction(jobId, applicationId, next);
      } catch {
        setFailed(true);
      }
    });
  }

  return (
    <div className="flex shrink-0 flex-col items-end gap-1">
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => set("interview")}
          disabled={pending}
          title="Accept → Interview"
          className="rounded p-1 text-zinc-400 transition-colors hover:bg-green-50 hover:text-green-600 disabled:opacity-50"
        >
          <Check className="size-4" />
        </button>
        <button
          onClick={() => set("rejected")}
          disabled={pending}
          title="Reject"
          className="rounded p-1 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
        >
          <X className="size-4" />
        </button>
        {pending && <Loader2 className="size-3.5 animate-spin text-zinc-400" />}
      </div>
      {failed && <span className="text-[10px] text-red-500">Update failed, try again.</span>}
    </div>
  );
}
