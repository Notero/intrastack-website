import Image from "next/image";
import Reveal from "@/components/public/reveal";
import { Crumbs, HeroCTAs, HeroHeadline, PillRow, type SolutionContent } from "./_shared";

export default function Hero({ c }: { c: SolutionContent }) {
  return (
    <section className="w-full bg-paper">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-16 lg:py-24 lg:items-end">
          <div className="w-full lg:max-w-[40rem] lg:pr-14">
            <Reveal direction="right" delay={120}><HeroHeadline c={c} /></Reveal>
            <Reveal direction="up" delay={260}>
              <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">{c.lede}</p>
            </Reveal>
            <Reveal direction="fade" delay={400}><PillRow c={c} /></Reveal>
            <Reveal direction="up" delay={520}><HeroCTAs /></Reveal>
          </div>
        </div>
        <Reveal direction="right" delay={150} className="relative min-h-[420px] lg:min-h-[600px] overflow-hidden">
          <Image src={c.heroImage} alt={c.name} fill sizes="(min-width: 1024px) 50vw, 100vw" priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </Reveal>
      </div>
    </section>
  );
}
