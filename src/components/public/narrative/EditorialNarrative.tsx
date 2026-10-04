import Reveal, { RevealGroup } from "@/components/public/reveal";
import { renderAccent } from "@/lib/text/accent";

export type EditorialNarrativeProps = {
  eyebrow: string;
  title: string;
  kicker?: string;
  lede: string;
  pillars: Array<{ title: string; body: string }>;
  closing?: string;
  accentClass?: string;
  bg?: string;
};

export default function EditorialNarrative({
  eyebrow,
  title,
  kicker,
  lede,
  pillars,
  closing,
  accentClass = "italic font-serif text-secondary",
  bg = "bg-paper-2",
}: EditorialNarrativeProps) {
  return (
    <section className={`w-full ${bg} py-24 px-6`}>
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 lg:gap-16">
        {/* Left rail */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal direction="up">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">
              {eyebrow}
            </div>
          </Reveal>
          <Reveal direction="right" delay={120}>
            <h2 className="mt-5 text-4xl md:text-5xl font-bold text-foreground leading-[1.05] tracking-tight">
              {renderAccent(title, accentClass)}
            </h2>
          </Reveal>
          <Reveal direction="up" delay={220}>
            <div className="mt-7 h-px w-16 bg-secondary/60" />
          </Reveal>
          {kicker && (
            <Reveal direction="up" delay={300}>
              <p className="mt-6 text-sm text-muted-foreground leading-relaxed max-w-sm">
                {renderAccent(kicker, accentClass)}
              </p>
            </Reveal>
          )}
        </div>

        {/* Right column */}
        <div>
          <Reveal direction="up">
            <p className="text-foreground/90 leading-relaxed font-serif max-w-[60ch]">
              {renderAccent(lede, accentClass)}
            </p>
          </Reveal>

          <div className="mt-10 h-px w-full bg-base-300" />

          <RevealGroup
            direction="up"
            stagger={70}
            className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8"
            itemClassName="h-full"
          >
            {pillars.map((p) => (
              <div key={p.title} className="bg-paper shadow-xl rounded-2xl p-5 w-full h-full flex flex-col">
                <h3 className="text-sm font-bold uppercase tracking-wider text-ink">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-ink/80 leading-relaxed flex-1">
                  {renderAccent(p.body, accentClass)}
                </p>
              </div>
            ))}
          </RevealGroup>

          {closing && (
            <>
              <div className="mt-12 h-px w-full bg-base-300" />
              <Reveal direction="fade">
                <p className="mt-8 text-lg text-foreground/80 leading-relaxed italic font-serif max-w-[55ch]">
                  {renderAccent(closing, accentClass)}
                </p>
              </Reveal>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
