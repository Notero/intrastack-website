import { CalendarClock, Check, Clock, ExternalLink, Video, X } from "lucide-react";
import { updateMeetingStatusAction } from "../actions";

export interface CustomerMeeting {
  id: string;
  createdAt: string;
  proposedAt: string | null;
  scheduledAt: string | null;
  durationMinutes: number;
  meetingLink: string | null;
  notes: string | null;
  status: "requested" | "confirmed" | "completed" | "cancelled" | "onboarding";
  jobTitle: string;
  applicantName: string;
}

const STATUS_STYLES: Record<CustomerMeeting["status"], { label: string; className: string }> = {
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

function MeetingRow({ meeting }: { meeting: CustomerMeeting }) {
  const badge = STATUS_STYLES[meeting.status];
  const displayTime = meeting.scheduledAt ?? meeting.proposedAt;

  return (
    <div className="flex items-start gap-4 rounded-xl border border-zinc-200 bg-white p-5 transition hover:shadow-sm">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-500/10 text-brand-500">
        <CalendarClock className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-zinc-900 truncate">{meeting.applicantName}</h3>
            <p className="text-xs text-zinc-500 truncate">{meeting.jobTitle}</p>
          </div>
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

        {meeting.notes && (
          <p className="mt-1 text-xs text-zinc-400 line-clamp-2">{meeting.notes}</p>
        )}

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

        {(meeting.status === "requested" || meeting.status === "confirmed") && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {meeting.status === "requested" && (
              <form
                action={async (formData: FormData) => {
                  "use server";
                  const meetingLink = String(formData.get("meetingLink") ?? "").trim() || undefined;
                  await updateMeetingStatusAction({ meetingId: meeting.id, status: "confirmed", meetingLink });
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="url"
                  name="meetingLink"
                  placeholder="Meeting link"
                  required
                  className="h-8 w-48 rounded-md border border-zinc-200 px-2 text-xs text-zinc-700 outline-none focus:border-brand-500"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-500/20"
                >
                  <Check className="h-3.5 w-3.5" />
                  Confirm
                </button>
              </form>
            )}
            {meeting.status === "confirmed" && (
              <form
                action={async () => {
                  "use server";
                  await updateMeetingStatusAction({ meetingId: meeting.id, status: "completed" });
                }}
              >
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-md bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-500/20"
                >
                  <Check className="h-3.5 w-3.5" />
                  Mark completed
                </button>
              </form>
            )}
            <form
              action={async () => {
                "use server";
                await updateMeetingStatusAction({ meetingId: meeting.id, status: "cancelled" });
              }}
            >
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-md bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-500/20"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </button>
            </form>
          </div>
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
  upcoming: CustomerMeeting[];
  past: CustomerMeeting[];
}

export function CustomerMeetingsList({ upcoming, past }: Props) {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-800">Needs Action / Upcoming</h2>
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
