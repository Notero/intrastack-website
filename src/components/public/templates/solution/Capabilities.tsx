import { Check } from "lucide-react";
import Reveal, { RevealGroup } from "@/components/public/reveal";
import { type SolutionContent } from "./_shared";

export default function Capabilities({ c }: { c: SolutionContent }) {
  return (
    <section className="w-full bg-paper py-28 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16 items-end">
          <Reveal direction="right">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F1622] leading-tight">
              What&apos;s in the <span className="italic font-serif text-brand-600">box.</span>
            </h2>
          </Reveal>
          <Reveal direction="left" delay={150}>
            <p className="text-lg text-[#5C6473] leading-relaxed">
              Capabilities included in the standard {c.name} rollout — modular, swappable.
            </p>
          </Reveal>
        </div>

        <RevealGroup direction="up" stagger={90} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" itemClassName="h-full">
          {c.capabilities.map((cap, i) => (
            <div
              key={cap.title}
              className="h-full flex flex-col rounded-2xl border border-[#E2E6EE] bg-white p-7 hover:border-primary hover:shadow-md transition-all"
            >
              <span className="inline-block rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-brand-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-lg font-bold text-[#0F1622]">{cap.title}</h3>
              <ul className="mt-4 space-y-2 flex-1">
                {cap.items.map((it) => (
                  <li key={it} className="flex items-start gap-2 text-sm text-[#5C6473]">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={2.5} />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
