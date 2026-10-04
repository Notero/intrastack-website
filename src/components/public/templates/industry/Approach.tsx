import Reveal from "@/components/public/reveal";
import { type IndustryContent } from "./_shared";

export default function Approach({ c }: { c: IndustryContent }) {
  return (
    <section className="w-full bg-paper-2 py-28 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16 items-end">
          <Reveal direction="right">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              How we <span className="italic font-serif text-secondary">play it.</span>
            </h2>
          </Reveal>
          <Reveal direction="left" delay={150}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our standard motion, tuned to the realities of {c.noun}.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10">
          <ol className="space-y-4">
            {c.approach.map((step, i) => (
              <Reveal as="li" key={step.title} direction="left" delay={i * 100} className="flex gap-5 rounded-2xl border border-base-300 bg-base-200/60 p-6 hover:border-primary/50 transition-colors">
                <span className="grid place-items-center size-10 shrink-0 rounded-lg bg-primary/15 text-primary font-bold">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-base font-bold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <Reveal direction="right" delay={150} className="rounded-2xl border border-base-300 bg-card p-8 flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Reference architecture
            </span>
            <p className="mt-3 text-sm text-muted-foreground">{c.diagramLabel}</p>
            <div className="mt-6 flex-1 rounded-xl border border-dashed border-base-300 bg-base-100/60 grid place-items-center min-h-[260px]">
              <svg viewBox="0 0 320 200" className="w-full max-w-sm" fill="none">
                <rect x="10" y="12" width="300" height="34" rx="6" stroke="#00D1FF" strokeWidth="1.5" />
                <text x="22" y="34" fontSize="12" fill="#D1D5DB">edge · identity · data plane</text>
                <rect x="10" y="62" width="92" height="74" rx="6" stroke="#FFC107" strokeWidth="1.5" />
                <rect x="114" y="62" width="92" height="74" rx="6" stroke="#FFC107" strokeWidth="1.5" />
                <rect x="218" y="62" width="92" height="74" rx="6" stroke="#FFC107" strokeWidth="1.5" />
                <rect x="10" y="152" width="300" height="34" rx="6" fill="#00D1FF" fillOpacity="0.12" stroke="#00D1FF" strokeWidth="1.5" />
                <text x="22" y="174" fontSize="12" fill="#00D1FF">observe · logs · metrics · cost</text>
              </svg>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
