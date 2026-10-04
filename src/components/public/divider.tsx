import { cn } from "@/lib/utils";

type DividerVariant = "line" | "gradient" | "ornament" | "dashed";
type DividerTone = "default" | "muted" | "cyan" | "amber" | "onDark";

type DividerProps = {
  /**
   * - `line`: solid hairline rule (default)
   * - `gradient`: hairline that fades transparent → tone → transparent at the edges
   * - `ornament`: hairline broken in the middle by a small diamond/dot ornament
   * - `dashed`: dashed hairline
   */
  variant?: DividerVariant;
  /**
   * Color token for the rule. Defaults to `border` (the global theme border).
   * Use `cyan` / `amber` for accent dividers, `onDark` for dark sections.
   */
  tone?: DividerTone;
  /** Optional max-width — pass `"prose"`, `"sm"`, `"md"`, `"lg"`, or any Tailwind width class. */
  width?: string;
  /** Extra classes (margin, alignment, etc.). */
  className?: string;
};

const TONE_LINE: Record<DividerTone, string> = {
  default: "bg-border",
  muted: "bg-ink-100",
  cyan: "bg-brand-500/40",
  amber: "bg-brand-500/40",
  onDark: "bg-white/15",
};

const TONE_GRADIENT: Record<DividerTone, string> = {
  default: "bg-gradient-to-r from-transparent via-border to-transparent",
  muted: "bg-gradient-to-r from-transparent via-ink-200 to-transparent",
  cyan: "bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent",
  amber: "bg-gradient-to-r from-transparent via-amber-500/50 to-transparent",
  onDark: "bg-gradient-to-r from-transparent via-white/25 to-transparent",
};

const TONE_DOT: Record<DividerTone, string> = {
  default: "bg-foreground",
  muted: "bg-ink-400",
  cyan: "bg-brand-500",
  amber: "bg-brand-500",
  onDark: "bg-white",
};

const TONE_DASHED: Record<DividerTone, string> = {
  default: "border-border",
  muted: "border-ink-100",
  cyan: "border-brand-500/40",
  amber: "border-brand-500/40",
  onDark: "border-white/15",
};

export default function Divider({
  variant = "line",
  tone = "default",
  width,
  className,
}: DividerProps) {
  const widthCls = width ?? "w-full";

  if (variant === "ornament") {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={cn("flex items-center gap-4", widthCls, className)}
      >
        <span className={cn("h-px flex-1", TONE_LINE[tone])} />
        <span
          aria-hidden
          className={cn("size-1.5 rotate-45 shrink-0", TONE_DOT[tone])}
        />
        <span className={cn("h-px flex-1", TONE_LINE[tone])} />
      </div>
    );
  }

  if (variant === "dashed") {
    return (
      <hr
        role="separator"
        aria-orientation="horizontal"
        className={cn("border-t border-dashed", TONE_DASHED[tone], widthCls, className)}
      />
    );
  }

  if (variant === "gradient") {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={cn("h-px", TONE_GRADIENT[tone], widthCls, className)}
      />
    );
  }

  // default: solid line
  return (
    <hr
      role="separator"
      aria-orientation="horizontal"
      className={cn("h-px border-0", TONE_LINE[tone], widthCls, className)}
    />
  );
}
