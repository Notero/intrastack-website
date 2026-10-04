import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

export type SolutionAccent = "cyan" | "yellow" | "mixed";

export type SolutionContent = {
  slug: string;
  name: string;
  heroImage: string;
  accent: SolutionAccent;
  headline: { lead: string; emph: string; tail: string };
  lede: string;
  accentPills: string[];
  pills: string[];
  narrative: {
    tagline: string;
    intro: string;
    sectionTitle: string;
    sectionLede: string;
    pillars: { title: string; body: string }[];
    closing?: string;
  };
  why: { icon: string; title: string; body: string }[];
  capabilities: { title: string; items: string[] }[];
  stack: string[];
  compare: { capability: string; us: string; diy: string }[];
};

export const accentClasses = {
  cyan: { emph: "text-secondary", glow: "bg-primary/20", chip: "border-primary/40 bg-primary/15 text-primary" },
  yellow: { emph: "text-primary", glow: "bg-secondary/20", chip: "border-secondary/40 bg-secondary/15 text-secondary" },
  mixed: { emph: "text-secondary", glow: "bg-primary/15", chip: "border-primary/40 bg-primary/15 text-primary" },
} as const;

export function Crumbs({ name }: { name: string }) {
  return (
    <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
      <Link href="/" className="hover:text-primary">Home</Link>
      <ChevronRight className="inline size-3 mx-1" />
      <Link href="/solutions" className="hover:text-primary">Solutions</Link>
      <ChevronRight className="inline size-3 mx-1" />
      <span className="text-primary">{name}</span>
    </div>
  );
}

export function HeroHeadline({ c }: { c: SolutionContent }) {
  const a = accentClasses[c.accent];
  return (
    <h1 className="mt-5 text-4xl md:text-6xl font-bold text-foreground leading-[1.05] tracking-tight">
      {c.headline.lead}{" "}
      <span className={`italic font-serif ${a.emph}`}>{c.headline.emph}</span>{" "}
      {c.headline.tail}
    </h1>
  );
}

export function HeroCTAs() {
  return (
    <div className="mt-9 flex flex-wrap gap-3">
      <Link
        href="/contact"
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-content hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
      >
        Book discovery <ArrowRight className="size-4" />
      </Link>
      <Link
        href="/contact"
        className="inline-flex items-center gap-2 rounded-lg border border-base-300 bg-base-100/50 px-5 py-3 text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
      >
        Talk to an engineer
      </Link>
    </div>
  );
}

export function PillRow({ c }: { c: SolutionContent }) {
  const a = accentClasses[c.accent];
  return (
    <div className="mt-7 flex flex-wrap gap-2">
      {c.accentPills.map((p) => (
        <span
          key={p}
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${a.chip}`}
        >
          {p}
        </span>
      ))}
      {c.pills.map((p) => (
        <span
          key={p}
          className="inline-flex items-center rounded-full border border-base-300 bg-base-200/70 px-3 py-1 text-xs font-medium text-foreground"
        >
          {p}
        </span>
      ))}
    </div>
  );
}
