import { cn } from "@/lib/utils";

type SeamVariant = "slant" | "wave" | "glow";

type SectionSeamProps = {
  /**
   * - `slant`: diagonal wedge between the two sections (default)
   * - `wave`: gentle organic curve
   * - `glow`: soft cyan/amber blob bleeding across the seam (no shape change)
   */
  variant?: SeamVariant;
  /** CSS color/var for the section ABOVE the seam — defaults to white. */
  topColor?: string;
  /** CSS color/var for the section BELOW the seam — defaults to the paper-3 token. */
  bottomColor?: string;
  /** Flip the slant/wave horizontally. */
  flip?: boolean;
  /** Glow accent color when variant="glow". */
  tone?: "cyan" | "amber" | "ink";
  /** Extra height — slant/wave default to h-12 md:h-20. */
  className?: string;
};

const GLOW_TONE: Record<NonNullable<SectionSeamProps["tone"]>, string> = {
  cyan: "bg-brand-500/25",
  amber: "bg-brand-500/25",
  ink: "bg-ink/15",
};

export default function SectionSeam({
  variant = "slant",
  topColor = "var(--paper)",
  bottomColor = "var(--paper-3)",
  flip = false,
  tone = "cyan",
  className,
}: SectionSeamProps) {
  if (variant === "glow") {
    return (
      <div
        aria-hidden
        className={cn("relative h-0 w-full", className)}
      >
        <div
          className={cn(
            "pointer-events-none absolute left-1/2 -translate-x-1/2 -top-32 w-[70vw] h-64 rounded-full blur-3xl",
            GLOW_TONE[tone],
          )}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className={cn("relative w-full overflow-hidden leading-none", className)}
      style={{ background: topColor }}
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className={cn("block w-full h-12 md:h-20", flip && "-scale-x-100")}
      >
        {variant === "slant" ? (
          <polygon points="0,80 1440,0 1440,80" style={{ fill: bottomColor }} />
        ) : (
          <path
            d="M0,40 C360,100 1080,-20 1440,40 L1440,80 L0,80 Z"
            style={{ fill: bottomColor }}
          />
        )}
      </svg>
    </div>
  );
}
