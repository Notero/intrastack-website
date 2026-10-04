"use client";

import { useState, useTransition } from "react";
import { bookMeetingAction } from "../../actions";

const DURATION_OPTIONS = [
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "60 minutes" },
] as const;

interface Props {
  applicationId: string;
}

export function BookingForm({ applicationId }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [proposedAt, setProposedAt] = useState("");
  const [duration, setDuration] = useState(30);
  const [notes, setNotes] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!proposedAt) {
      setError("Please select a date and time for the meeting.");
      return;
    }

    startTransition(async () => {
      const result = await bookMeetingAction({
        applicationId,
        proposedAt: new Date(proposedAt).toISOString(),
        durationMinutes: duration,
        notes: notes.trim() || undefined,
      });

      if (!result.ok) {
        setError(result.error ?? "Failed to book meeting.");
      }
      // On success, the server action redirects to /applicant/meetings
    });
  }

  // Minimum datetime = now (rounded to next 15 min)
  const now = new Date();
  now.setMinutes(now.getMinutes() + 15 - (now.getMinutes() % 15), 0, 0);
  const minDateTime = now.toISOString().slice(0, 16);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Date / Time */}
      <div className="space-y-2">
        <label htmlFor="proposed-at" className="block text-sm font-medium text-zinc-700">
          Proposed Date &amp; Time <span className="text-red-500">*</span>
        </label>
        <input
          id="proposed-at"
          type="datetime-local"
          min={minDateTime}
          value={proposedAt}
          onChange={(e) => setProposedAt(e.target.value)}
          required
          className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <label htmlFor="duration" className="block text-sm font-medium text-zinc-700">
          Duration
        </label>
        <div className="flex gap-3">
          {DURATION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setDuration(opt.value)}
              className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                duration === opt.value
                  ? "border-brand-500 bg-brand-500/10 text-brand-600"
                  : "border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label htmlFor="notes" className="block text-sm font-medium text-zinc-700">
          Notes <span className="text-zinc-400">(optional)</span>
        </label>
        <textarea
          id="notes"
          rows={3}
          placeholder="Any additional details about the meeting..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Booking…" : "Book Meeting"}
      </button>
    </form>
  );
}
