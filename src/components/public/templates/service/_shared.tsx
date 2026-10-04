import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

export type ServiceAccent = "cyan" | "yellow" | "mixed";

export type ServiceContent = {
  slug: string;
  name: string;
  heroImage: string;
  accent: ServiceAccent;
  headline: { lead: string; emph: string; tail: string };
  lede: string;
  pills: string[];
  narrative: {
    tagline: string;
    intro: string;
    sectionTitle: string;
    sectionLede: string;
    pillars: { title: string; body: string }[];
    closing?: string;
  };
  deliverables: { letter: string; title: string; body: string }[];
  process: { weeks: string; title: string; body: string }[];
  tiers: {
    name: string;
    price: string;
    tagline: string;
    items: string[];
    featured?: boolean;
  }[];
  processHeading?: { lead: string; emph: string; tail?: string };
};

export const accentClasses = {
  cyan: {
    chipBorder: "border-primary/40 bg-primary/15 text-primary",
    emph: "text-secondary",
    band: "from-primary/25 via-transparent to-secondary/10",
    glow: "bg-primary/25",
  },
  yellow: {
    chipBorder: "border-secondary/40 bg-secondary/15 text-secondary",
    emph: "text-primary",
    band: "from-secondary/25 via-transparent to-primary/10",
    glow: "bg-secondary/20",
  },
  mixed: {
    chipBorder: "border-primary/40 bg-primary/15 text-primary",
    emph: "text-secondary",
    band: "from-primary/20 via-transparent to-secondary/20",
    glow: "bg-primary/20",
  },
} as const;

export function Crumbs({ name }: { name: string }) {
  return (
    <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
      <Link href="/" className="hover:text-primary">Home</Link>
      <ChevronRight className="inline size-3 mx-1" />
      <Link href="/services" className="hover:text-primary">Services</Link>
      <ChevronRight className="inline size-3 mx-1" />
      <span className="text-primary">{name}</span>
    </div>
  );
}

export function HeroCTAs() {
  return (
    <div className="mt-9 flex flex-wrap gap-3">
      <Link
        href="/contact"
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-content hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
      >
        Book scoping call <ArrowRight className="size-4" />
      </Link>
      <Link
        href="/news/whitepaper"
        className="inline-flex items-center gap-2 rounded-lg border border-base-300 bg-base-100/50 px-5 py-3 text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
      >
        Download data sheet
      </Link>
    </div>
  );
}

export function PillRow({ c }: { c: ServiceContent }) {
  const a = accentClasses[c.accent];
  return (
    <div className="mt-7 flex flex-wrap gap-2">
      {c.pills.map((p) => (
        <span
          key={p}
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${a.chipBorder}`}
        >
          {p}
        </span>
      ))}
    </div>
  );
}
