import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal, { RevealGroup } from "@/components/public/reveal";
import { type IndustryContent } from "./_shared";

export default function Related({ c }: { c: IndustryContent }) {
  return (
    <section className="w-full bg-paper-3 py-28 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16 items-end">
          <Reveal direction="down">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F1622] leading-tight">
              Goes well <span className="italic font-serif text-brand-600">with.</span>
            </h2>
          </Reveal>
          <Reveal direction="up" delay={150}>
            <p className="text-lg text-[#5C6473] leading-relaxed">
              Services and solutions most commonly paired with {c.name} engagements.
            </p>
          </Reveal>
        </div>
        <RevealGroup direction="scale" stagger={70} className="grid grid-cols-2 lg:grid-cols-4 gap-4" itemClassName="h-full">
          {c.related.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="group block h-full rounded-2xl border border-[#E2E6EE] bg-white p-6 hover:border-primary hover:shadow-md transition-all"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">
                {r.kind}
              </span>
              <div className="mt-3 text-base font-bold text-[#0F1622] leading-snug">{r.name}</div>
              <ArrowRight className="mt-5 size-4 text-[#5C6473] group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
