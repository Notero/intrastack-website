import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/public/reveal";
import { accentClasses, type SolutionContent } from "./_shared";

export default function FinalCTA({ c }: { c: SolutionContent }) {
  const a = accentClasses[c.accent];
  return (
    <section className="w-full bg-paper py-24 px-6">
      <div className="mx-auto max-w-7xl rounded-3xl border border-base-300 bg-gradient-to-br from-base-200 to-base-100 p-10 md:p-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <Reveal direction="left">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              See how <span className={`italic font-serif ${a.emph}`}>{c.name}</span> fits your stack.
            </h3>
            <p className="mt-3 text-muted-foreground">
              30 minutes with a senior engineer — we&apos;ll tell you what we&apos;d do.
            </p>
          </div>
        </Reveal>
        <Reveal direction="right" delay={150} className="shrink-0">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-sm font-semibold text-primary-content hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
          >
            Book discovery <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
