import { cn } from "@/lib/utils";

export function NewsByline({
  author = "By Staff Reporter",
  meta,
  size = "sm",
}: {
  author?: string;
  meta?: string;
  size?: "sm" | "lg";
}) {
  const avatarSize = size === "lg" ? "w-12 h-12" : "w-8 h-8";
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "rounded-full bg-ink-100 border border-dashed border-ink-300 flex items-center justify-center text-ink-400 shrink-0",
          avatarSize,
        )}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 opacity-60" fill="currentColor">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
        </svg>
      </div>
      <div className="leading-tight">
        <div className={cn("font-sans font-bold text-ink-900", size === "lg" ? "text-[15px]" : "text-[13px]")}>
          {author}
        </div>
        {meta && <div className="font-sans text-[12px] text-ink-500">{meta}</div>}
      </div>
    </div>
  );
}
