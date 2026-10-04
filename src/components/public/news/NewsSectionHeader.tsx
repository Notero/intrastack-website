import Link from "next/link";
import { cn } from "@/lib/utils";

export function NewsSectionHeader({
  title,
  kicker,
  moreHref,
  moreLabel = "View all",
  accent = false,
}: {
  title: string;
  kicker?: string;
  moreHref?: string;
  moreLabel?: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-end justify-between border-b-2 border-ink-900 pb-2 mb-5">
      <div className="flex items-center gap-3">
        <span className={cn("inline-block w-1.5 h-6", accent ? "bg-accent-400" : "bg-brand-600")} />
        <div>
          {kicker && (
            <div className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-brand-600">
              {kicker}
            </div>
          )}
          <h2 className="font-serif font-extrabold text-2xl text-ink-900 leading-none">{title}</h2>
        </div>
      </div>
      {moreHref && (
        <Link
          href={moreHref}
          className="font-sans text-[12px] font-bold uppercase tracking-wide text-brand-600 hover:text-brand-600 flex items-center gap-1"
        >
          {moreLabel}
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      )}
    </div>
  );
}
