import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { SOLUTIONS } from "@/lib/content/solutions";
import SchemaScript from "@/components/seo/SchemaScript";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/seo/schemas";
import Reveal, { RevealGroup } from "@/components/public/reveal";

export const metadata = {
  title: "Solutions · Intrastack",
  description:
    "Packaged solution areas with opinionated defaults, reference architectures, and production-tested patterns.",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsHub() {
  const solutions = Object.values(SOLUTIONS);

  return (
    <main className="flex flex-col flex-1 pt-26">
      <SchemaScript
        data={[
          collectionPageSchema({
            path: "/solutions",
            name: "Solutions",
            description:
              "Packaged solution areas with opinionated defaults, reference architectures, and production-tested patterns.",
            items: solutions.map((s) => ({
              name: s.name,
              url: `/solutions/${s.slug}`,
              description: s.lede,
              image: s.heroImage,
            })),
          }),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Solutions", url: "/solutions" },
          ]),
        ]}
      />
      {/* HERO */}
      <section className="relative w-full bg-background overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-40 -right-32 size-[520px] rounded-full bg-primary/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-32 size-[520px] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <Reveal direction="down">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <Link href="/" className="hover:text-primary">Home</Link>
              <ChevronRight className="inline size-3 mx-1" />
              <span className="text-primary">Solutions</span>
            </div>
          </Reveal>
          <Reveal direction="scale" delay={100}>
            <h1 className="mt-6 max-w-4xl text-5xl md:text-7xl font-bold text-foreground leading-[1.02] tracking-tight">
              Outcomes you can <span className="italic font-serif text-secondary">ship.</span>
            </h1>
          </Reveal>
          <Reveal direction="up" delay={250}>
            <p className="mt-7 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Ten packaged solution areas — opinionated defaults, reference architectures, and the
              production patterns we&apos;ve sharpened across hundreds of engagements.
            </p>
          </Reveal>
        </div>
      </section>

      {/* GRID */}
      <section className="w-full bg-accent py-24 px-6" aria-labelledby="solutions-grid-heading">
        <h2 id="solutions-grid-heading" className="sr-only">All solutions</h2>
        <RevealGroup direction="scale" stagger={80} className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" itemClassName="h-full">
          {solutions.map((s, i) => (
            <Link
              key={s.slug}
              href={`/solutions/${s.slug}`}
              className="group relative h-full rounded-2xl overflow-hidden border border-base-300 bg-base-100 hover:border-primary transition-all flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={s.heroImage}
                  alt={s.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  {...(i === 0 ? { preload: true, fetchPriority: "high" as const } : { loading: "lazy" as const })}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-base-100/30 to-transparent" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-foreground">{s.name}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">{s.lede}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                  View solution <ArrowRight className="size-4" />
                </span>
              </div>
            </Link>
          ))}
        </RevealGroup>
      </section>

      {/* CTA */}
      <section className="w-full bg-background py-24 px-6">
        <div className="mx-auto max-w-7xl rounded-3xl border border-base-300 bg-gradient-to-br from-base-200 to-base-100 p-10 md:p-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <Reveal direction="left">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                Need a solution <span className="italic font-serif text-secondary">tailored?</span>
              </h2>
              <p className="mt-3 text-muted-foreground">
                Tell us the constraint · we&apos;ll send the reference architecture that fits.
              </p>
            </div>
          </Reveal>
          <Reveal direction="right" delay={150} className="shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-sm font-semibold text-primary-content hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
            >
              Talk to an engineer <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
