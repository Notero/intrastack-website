import { Check, X } from "lucide-react";
import Reveal from "@/components/public/reveal";
import { accentClasses, type SolutionContent } from "./_shared";

export default function Compare({ c }: { c: SolutionContent }) {
  const a = accentClasses[c.accent];
  return (
    <section className="w-full bg-paper-3 py-28 px-6">
      <div className="mx-auto max-w-7xl">
        <Reveal direction="down" className="mb-12">
          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-foreground leading-tight">
            What you actually get on <span className={`italic font-serif ${a.emph}`}>day 90.</span>
          </h2>
        </Reveal>

        <Reveal direction="up" delay={150} className="overflow-hidden rounded-2xl border border-base-300 bg-base-100">
          <div className="grid grid-cols-[1.4fr_1fr_1fr] bg-base-200 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <div className="px-6 py-4">Capability</div>
            <div className="px-6 py-4 text-primary">With us</div>
            <div className="px-6 py-4">Do It Yourself</div>
          </div>
          {c.compare.map((row, i) => (
            <div
              key={row.capability}
              className={`grid grid-cols-[1.4fr_1fr_1fr] text-sm ${
                i % 2 === 0 ? "bg-base-100" : "bg-base-200/40"
              } border-t border-base-300`}
            >
              <div className="px-6 py-5">{row.capability}</div>
              <div className="px-6 py-5 flex items-center gap-2 text-foreground">
                <Check className="size-4 text-primary shrink-0" strokeWidth={2.5} /> {row.us}
              </div>
              <div className="px-6 py-5 flex items-center gap-2 text-muted-foreground">
                <X className="size-4 text-destructive shrink-0" strokeWidth={2.5} /> {row.diy}
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
