import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { INDUSTRIES } from "@/lib/content/industries";
import SchemaScript from "@/components/seo/SchemaScript";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/seo/schemas";
import Reveal, { RevealGroup } from "@/components/public/reveal";
import { renderAccent } from "@/lib/text/accent";

export const metadata = {
  title: "Industries · Intrastack",
  description:
    "Sector expertise across regulated public sector, financial services, telecom, and high-velocity industries.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesHub() {
  const industries = Object.values(INDUSTRIES);

  return (
    <main className="flex flex-col flex-1 pt-26">
      <SchemaScript
        data={[
          collectionPageSchema({
            path: "/industries",
            name: "Industries",
            description:
              "Sector expertise across regulated public sector, financial services, telecom, and high-velocity industries.",
            items: industries.map((ind) => ({
              name: ind.name,
              url: `/industries/${ind.slug}`,
              description: ind.lede,
              image: ind.heroImage,
            })),
          }),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Industries", url: "/industries" },
          ]),
        ]}
      />
      {/* HERO */}
      <section className="relative w-full bg-background overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-40 -left-32 size-[520px] rounded-full bg-primary/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-40 -right-32 size-[520px] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <Reveal direction="down">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <Link href="/" className="hover:text-primary">Home</Link>
              <ChevronRight className="inline size-3 mx-1" />
              <span className="text-primary">Industries</span>
            </div>
          </Reveal>
          <Reveal direction="left" delay={100}>
            <h1 className="mt-6 max-w-4xl text-5xl md:text-7xl font-bold text-foreground leading-[1.02] tracking-tight">
              {renderAccent("Enterprise transformation is not [[industry-agnostic.]]", "italic font-serif text-secondary")}
            </h1>
          </Reveal>
          <Reveal direction="right" delay={250}>
            <p className="mt-7 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              {renderAccent("Every sector operates under distinct regulatory pressure, data sensitivity, and operational architecture. IntraStack engineers against those constraints — [[before recommending a single technology.]]", "italic font-serif text-secondary")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* GRID */}
      <section className="w-full bg-accent py-24 px-6" aria-labelledby="industries-grid-heading">
        <h2 id="industries-grid-heading" className="sr-only">All industries</h2>
        <RevealGroup direction="scale" stagger={90} className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" itemClassName="h-full">
          {industries.map((ind, i) => (
            <Link
              key={ind.slug}
              href={`/industries/${ind.slug}`}
              className="group relative h-full rounded-2xl overflow-hidden border border-base-300 bg-base-100 hover:border-primary transition-all flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={ind.heroImage}
                  alt={ind.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  {...(i === 0 ? { preload: true, fetchPriority: "high" as const } : { loading: "lazy" as const })}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-base-100/30 to-transparent" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-foreground">{ind.name}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">{ind.lede}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                  View industry <ArrowRight className="size-4" />
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
                {renderAccent("Sector not [[listed?]]", "italic font-serif text-secondary")}
              </h2>
              <p className="mt-3 text-muted-foreground">
                {renderAccent("Adjacent verticals share more constraints than they appear to. Bring the problem — [[we’ll bring the precedent.]]", "italic font-serif text-secondary")}
              </p>
            </div>
          </Reveal>
          <Reveal direction="right" delay={150} className="shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-sm font-semibold text-primary-content hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
            >
              Start a conversation <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
