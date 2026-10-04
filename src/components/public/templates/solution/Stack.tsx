import Reveal from "@/components/public/reveal";
import { accentClasses, type SolutionContent } from "./_shared";

export default function Stack({ c }: { c: SolutionContent }) {
  const a = accentClasses[c.accent];
  return (
    <section className="w-full bg-paper-5 py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-12 items-end">
          <Reveal direction="down">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Tools we <span className={`italic font-serif ${a.emph}`}>bring.</span>
            </h2>
          </Reveal>
          <Reveal direction="up" delay={150}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              An opinionated default stack — swap any of it for what your team already runs.
            </p>
          </Reveal>
        </div>
        <div className="flex flex-wrap gap-3">
          {c.stack.map((s, i) => (
            <Reveal as="span" key={s} direction="scale" delay={i * 40} className="inline-flex items-center gap-2 rounded-lg border border-base-300 bg-base-200/60 px-4 py-2 text-sm font-medium text-foreground">
              <span className="size-2 rounded-sm bg-primary" />
              {s}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
