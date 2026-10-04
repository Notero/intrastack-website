import Reveal, { RevealGroup } from "@/components/public/reveal";
import { renderAccent } from "@/lib/text/accent";
import { accentClasses, type ServiceContent } from "./_shared";

const STEP_COLORS = ["var(--color-brand-400)", "var(--color-brand-500)", "var(--color-brand-600)", "var(--color-brand-600)", "var(--color-brand-600)"];

const GRID_COLS: Record<number, string> = {
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
};

function buildHeading(c: ServiceContent): string {
  if (c.processHeading) {
    const tail = c.processHeading.tail ? ` ${c.processHeading.tail}` : "";
    return `${c.processHeading.lead} [[${c.processHeading.emph}]]${tail}`.trim();
  }
  return `${c.name} delivery, [[step by step.]]`;
}

export default function Process({ c }: { c: ServiceContent }) {
  const a = accentClasses[c.accent];
  const steps = c.process;
  const heading = buildHeading(c);

  return (
    <section className="w-full bg-background py-28 px-6">
      <div className="mx-auto max-w-7xl">
        <Reveal direction="up" className="mx-auto max-w-3xl text-center mb-16">
          <div className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] ${a.emph}`}>
            <span className={`h-px w-6 ${a.emph.replace("text-", "bg-")}`} />
            Delivery methodology · {c.name}
          </div>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-foreground leading-tight">
            {renderAccent(heading, `italic font-serif ${a.emph}`)}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            {renderAccent("A sequenced engagement from first call to production hand-over — [[transparent, measured, accountable.]]", `italic font-serif ${a.emph}`)}
          </p>
        </Reveal>

        <div className="relative">
          <div
            aria-hidden
            className="hidden md:block absolute left-[10%] right-[10%] top-10 h-px"
            style={{
              background:
                "linear-gradient(to right, #FF9933 0%, #FF6200 25%, #E55500 50%, #CC4400 75%, #A33500 100%)",
            }}
          />
          <RevealGroup
            direction="up"
            stagger={120}
            className={`relative grid grid-cols-1 ${GRID_COLS[steps.length] ?? "md:grid-cols-5"} gap-10 md:gap-6`}
            itemClassName="h-full"
          >
            {steps.map((s, i) => {
              const color = STEP_COLORS[i % STEP_COLORS.length];
              return (
                <div key={`${s.title}-${i}`} className="flex flex-col items-center text-center px-2">
                  <div
                    className="grid place-items-center size-20 rounded-full bg-background border-2 font-bold text-lg"
                    style={{ borderColor: color, color }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="mt-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {s.weeks}
                  </div>
                  <h3 className="mt-2 text-base font-bold text-foreground">{s.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-[16rem]">
                    {s.body}
                  </p>
                </div>
              );
            })}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
