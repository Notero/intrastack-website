"use client";

import { CalendarClock, Clock, ExternalLink, Video } from "lucide-react";

export interface Meeting {
  id: string;
  createdAt: string;
  proposedAt: string | null;
  scheduledAt: string | null;
  durationMinutes: number;
  meetingLink: string | null;
  notes: string | null;
  status: "requested" | "confirmed" | "completed" | "cancelled" | "onboarding";
  jobTitle: string;
}

const STATUS_STYLES: Record<Meeting["status"], { label: string; className: string }> = {
  requested:  { label: "Requested",  className: "bg-amber-100 text-amber-700" },
  confirmed:  { label: "Confirmed",  className: "bg-emerald-100 text-emerald-700" },
  completed:  { label: "Completed",  className: "bg-blue-100 text-blue-700" },
  cancelled:  { label: "Cancelled",  className: "bg-zinc-100 text-zinc-500" },
  onboarding: { label: "Onboarding", className: "bg-purple-100 text-purple-700" },
};

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function MeetingRow({ meeting }: { meeting: Meeting }) {
  const badge = STATUS_STYLES[meeting.status];
  const displayTime = meeting.scheduledAt ?? meeting.proposedAt;

  return (
    <div className="flex items-start gap-4 rounded-xl border border-zinc-200 bg-white p-5 transition hover:shadow-sm">
      {/* Icon */}
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-500/10 text-brand-500">
        <CalendarClock className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold text-zinc-900 truncate">{meeting.jobTitle}</h3>
          <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}>
            {badge.label}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <CalendarClock className="h-3.5 w-3.5" />
            {formatDateTime(displayTime)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {meeting.durationMinutes} min
          </span>
        </div>

        {meeting.meetingLink && meeting.status === "confirmed" && (
          <a
            href={meeting.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-brand-500/10 px-3 py-1.5 text-xs font-medium text-brand-600 transition hover:bg-brand-500/20"
          >
            <Video className="h-3.5 w-3.5" />
            Join Meeting
            <ExternalLink className="h-3 w-3" />
          </a>
        )}

        {meeting.notes && (
          <p className="mt-1 text-xs text-zinc-400 line-clamp-2">{meeting.notes}</p>
        )}
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-200 py-10 text-center">
      <CalendarClock className="mx-auto h-8 w-8 text-zinc-300" />
      <p className="mt-2 text-sm text-zinc-400">No {label} meetings</p>
    </div>
  );
}

interface Props {
  upcoming: Meeting[];
  past: Meeting[];
}

export function MeetingsList({ upcoming, past }: Props) {
  return (
    <div className="space-y-8">
      {/* Upcoming */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-800">Upcoming</h2>
        {upcoming.length === 0 ? (
          <EmptyState label="upcoming" />
        ) : (
          <div className="space-y-3">
            {upcoming.map((m) => (
              <MeetingRow key={m.id} meeting={m} />
            ))}
          </div>
        )}
      </section>

      {/* Past */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-800">Past</h2>
        {past.length === 0 ? (
          <EmptyState label="past" />
        ) : (
          <div className="space-y-3">
            {past.map((m) => (
              <MeetingRow key={m.id} meeting={m} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
