import { RevealGroup } from "@/components/public/reveal";
import { type SolutionContent } from "./_shared";

export default function Why({ c }: { c: SolutionContent }) {
  return (
    <section className="w-full bg-paper-3 py-20 px-6">
      <RevealGroup direction="scale" stagger={90} className="mx-auto max-w-7xl grid grid-cols-2 lg:grid-cols-4 gap-6" itemClassName="h-full">
        {c.why.map((w) => (
          <div key={w.title} className="h-full flex flex-col rounded-2xl border border-base-300 bg-base-100 p-6">
            <div className="grid place-items-center size-10 rounded-lg bg-primary/15 text-primary text-xl font-bold shrink-0">
              {w.icon}
            </div>
            <h3 className="mt-5 text-base font-bold text-foreground">{w.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{w.body}</p>
          </div>
        ))}
      </RevealGroup>
    </section>
  );
}
