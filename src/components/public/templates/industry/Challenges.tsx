import Reveal, { RevealGroup } from "@/components/public/reveal";
import { type IndustryContent } from "./_shared";

export default function Challenges({ c }: { c: IndustryContent }) {
  return (
    <section className="w-full bg-paper-3 py-28 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16 items-end">
          <Reveal direction="left">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F1622] leading-tight">
              What&apos;s <span className="italic font-serif text-brand-600">hard</span> here.
            </h2>
          </Reveal>
          <Reveal direction="right" delay={150}>
            <p className="text-lg text-[#5C6473] leading-relaxed">
              Three challenges teams in {c.noun} keep telling us about — and what we do about them.
            </p>
          </Reveal>
        </div>

        <RevealGroup direction="up" stagger={100} className="grid grid-cols-1 md:grid-cols-3 gap-6" itemClassName="h-full">
          {c.challenges.map((ch) => (
            <div
              key={ch.title}
              className="group h-full flex flex-col rounded-2xl border border-[#E2E6EE] bg-white p-8 hover:border-primary hover:shadow-md transition-all"
            >
              <div className="grid place-items-center size-12 rounded-lg bg-primary/10 text-brand-600 font-bold shrink-0">
                {ch.letter}
              </div>
              <h3 className="mt-6 text-lg font-bold text-[#0F1622]">{ch.title}</h3>
              <p className="mt-3 text-sm text-[#5C6473] leading-relaxed flex-1">{ch.body}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
