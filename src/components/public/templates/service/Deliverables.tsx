import Reveal, { RevealGroup } from "@/components/public/reveal";
import { type ServiceContent } from "./_shared";

export default function Deliverables({ c }: { c: ServiceContent }) {
  return (
    <section className="w-full bg-paper-3 py-28 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16 items-end">
          <Reveal direction="right">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F1622] leading-tight">
              What you <span className="italic font-serif text-brand-600">walk away with.</span>
            </h2>
          </Reveal>
          <Reveal direction="left" delay={150}>
            <p className="text-lg text-[#5C6473] leading-relaxed">
              Concrete deliverables — everything is yours at the end of the engagement.
            </p>
          </Reveal>
        </div>

        <RevealGroup direction="up" stagger={70} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" itemClassName="h-full">
          {c.deliverables.map((d) => (
            <div
              key={d.title}
              className="h-full flex flex-col rounded-2xl border border-[#E2E6EE] bg-white p-7 hover:border-primary hover:shadow-md transition-all"
            >
              <div className="grid place-items-center size-11 rounded-lg bg-primary/10 text-brand-600 font-bold shrink-0">
                {d.letter}
              </div>
              <h3 className="mt-5 text-base font-bold text-[#0F1622]">{d.title}</h3>
              <p className="mt-3 text-sm text-[#5C6473] leading-relaxed flex-1">{d.body}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
