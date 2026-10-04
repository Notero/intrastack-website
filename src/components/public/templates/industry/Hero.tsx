import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/public/reveal";
import { renderAccent } from "@/lib/text/accent";
import { type IndustryContent } from "./_shared";

export default function Hero({ c }: { c: IndustryContent }) {
  return (
    <section className="w-full bg-paper">
      <div className="grid grid-cols-1 lg:grid-cols-2">


        <div className="flex flex-col justify-center px-6 py-16 lg:py-20 lg:items-start">
          <div className="w-full lg:max-w-[40rem] lg:pl-14">
            <Reveal direction="down">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Industries · {c.name}
              </span>
            </Reveal>
            <Reveal direction="right" delay={120}>
              <h1 className="mt-4 text-4xl md:text-5xl font-bold text-foreground leading-[1.08] tracking-tight">
                {renderAccent(c.headline, "italic font-serif text-secondary")}
              </h1>
            </Reveal>
            <Reveal direction="up" delay={260}>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">{renderAccent(c.lede, "italic font-serif text-secondary")}</p>
            </Reveal>

            <div className="mt-7 flex flex-wrap gap-2">
              {c.pills.map((p, i) => (
                <Reveal as="span" key={p} direction="scale" delay={350 + i * 50} className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200/70 px-3 py-1 text-xs font-medium text-foreground">
                  <span className="size-1.5 rounded-full bg-primary" />
                  {p}
                </Reveal>
              ))}
            </div>

            <Reveal direction="up" delay={500}>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-content hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  Book a discovery call <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/news/client_stories"
                  className="inline-flex items-center gap-2 rounded-lg border border-base-300 bg-base-100/50 px-5 py-3 text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  See case study
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
        <div className="relative overflow-hidden">
          <Image
            src={c.heroImage}
            alt={c.name}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </div>
      </div>
    </section>
  );
}
