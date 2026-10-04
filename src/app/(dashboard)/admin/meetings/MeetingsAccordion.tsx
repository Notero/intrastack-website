"use client";

import { useState, useTransition } from "react";
import { CalendarClock, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { updateMeetingStatusAction } from "../../customer/meetings/actions";
import type { JobGroup, MeetingStatus } from "./page";

const STATUS_STYLES: Record<MeetingStatus, { label: string; className: string }> = {
  requested: { label: "Requested", className: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Confirmed", className: "bg-emerald-100 text-emerald-700" },
  completed: { label: "Completed", className: "bg-blue-100 text-blue-700" },
  cancelled: { label: "Cancelled", className: "bg-zinc-100 text-zinc-500" },
  onboarding: { label: "Onboarding", className: "bg-purple-100 text-purple-700" },
};

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function CancelButton({ meetingId }: { meetingId: string }) {
  const [pending, start] = useTransition();
  const [failed, setFailed] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setFailed(false);
          start(async () => {
            const res = await updateMeetingStatusAction({ meetingId, status: "cancelled" });
            if (!res.ok) setFailed(true);
          });
        }}
        className="inline-flex items-center gap-1.5 rounded-md bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-500/20 disabled:opacity-50"
      >
        <X className="h-3.5 w-3.5" />
        {pending ? "Cancelling…" : "Cancel"}
      </button>
      {failed && <span className="text-[10px] text-red-500">Failed</span>}
    </div>
  );
}

export function MeetingsAccordion({ jobGroups }: { jobGroups: JobGroup[] }) {
  if (jobGroups.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 py-16 text-center">
        <CalendarClock className="mx-auto h-8 w-8 text-zinc-300" />
        <p className="mt-2 text-sm text-zinc-400">No meetings yet.</p>
      </div>
    );
  }

  return (
    <Accordion type="multiple" className="rounded-2xl border-zinc-200 bg-white shadow-sm">
      {jobGroups.map((group) => (
        <AccordionItem key={group.jobPostId} value={group.jobPostId}>
          <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline">
            <span className="flex flex-1 items-center gap-3 text-left">
              <span className="font-semibold text-zinc-900">{group.jobTitle}</span>
              <span className="text-xs text-zinc-500">{group.customerName}</span>
            </span>
            <Badge variant="secondary" className="mr-2">
              {group.meetings.length}
            </Badge>
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <div className="space-y-2 pt-1">
              {group.meetings.map((m) => (
                <div
                  key={m.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-100 bg-zinc-50/60 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-900">{m.applicantName}</p>
                    <p className="text-xs text-zinc-500">
                      {formatDateTime(m.scheduledAt ?? m.requestedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={STATUS_STYLES[m.status].className}>
                      {STATUS_STYLES[m.status].label}
                    </Badge>
                    {(m.status === "requested" || m.status === "confirmed") && (
                      <CancelButton meetingId={m.id} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
