import { cn } from "@/lib/utils";

type TagColor = "brand" | "brandSoft" | "accent" | "ink" | "outline";

const STYLES: Record<TagColor, string> = {
  brand:     "bg-brand-600 text-white",
  brandSoft: "bg-brand-400text-brand-600 ring-1 ring-brand-400",
  accent:    "bg-accent-400 text-ink-900",
  ink:       "bg-ink-800 text-white",
  outline:   "border border-ink-300 text-ink-600",
};

export function NewsTag({
  children,
  color = "brand",
  className,
}: {
  children: React.ReactNode;
  color?: TagColor;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-sans font-bold uppercase tracking-wider text-[10.5px] leading-none px-2.5 py-1",
        STYLES[color],
        className,
      )}
    >
      {children}
    </span>
  );
}
