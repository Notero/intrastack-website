import Image from "next/image";
import Reveal from "@/components/public/reveal";
import { accentClasses, Crumbs, HeroCTAs, PillRow, type ServiceContent } from "./_shared";

export default function Hero({ c }: { c: ServiceContent }) {
  const a = accentClasses[c.accent];
  return (
    <section className="w-full bg-paper">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-16 lg:py-24 lg:items-end">
          <div className="w-full lg:max-w-[40rem] lg:pr-14">
            <Reveal direction="left" delay={120}>
              <h1 className="mt-5 text-4xl md:text-6xl font-bold text-foreground leading-[1.04] tracking-tight">
                {c.headline.lead}{" "}
                <span className={`italic font-serif ${a.emph}`}>{c.headline.emph}</span>{" "}
                {c.headline.tail}
              </h1>
            </Reveal>
            <Reveal direction="up" delay={260}>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">{c.lede}</p>
            </Reveal>
            <Reveal direction="fade" delay={400}><PillRow c={c} /></Reveal>
            <Reveal direction="up" delay={520}><HeroCTAs /></Reveal>
          </div>
        </div>
        <Reveal direction="right" delay={150} className="relative min-h-[420px] lg:min-h-[600px] overflow-hidden">
          <Image src={c.heroImage} alt={c.name} fill sizes="(min-width: 1024px) 50vw, 100vw" priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </Reveal>
      </div>
    </section>
  );
}
