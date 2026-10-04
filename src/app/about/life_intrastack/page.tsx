import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Handshake, Globe2, MessageSquare, BookOpen, ArrowRight } from "lucide-react";
import SchemaScript from "@/components/seo/SchemaScript";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/public/reveal";

export const metadata: Metadata = {
  title: "Life at Intrastack · Intrastack",
  description:
    "Innovation, collaboration, and passion converge at Intrastack Solutions. A place to build, grow, and reach the forefront of technological excellence.",
  alternates: { canonical: "/about/life_intrastack" },
};

const VALUES = [
  {
    icon: Handshake,
    title: "Friendly Environment",
    body: "A team that picks up the phone, ships together, and shows up for each other. Hierarchy thin, respect thick.",
  },
  {
    icon: Globe2,
    title: "World-Class Challenges",
    body: "Real problems for real enterprises — across cloud, AI, security, and data. The work has weight; the outcomes are measurable.",
  },
  {
    icon: MessageSquare,
    title: "Open Communication",
    body: "Direct conversations, written reasoning, no closed-door decisions. Ideas win on substance, not seniority.",
  },
  {
    icon: BookOpen,
    title: "Learning Opportunity",
    body: "Certifications, conferences, internal guilds, and a budget that actually gets spent. You leave sharper than you arrived.",
  },
];

export default function Page() {
  return (
    <main className="flex flex-col flex-1 pt-26">
      <SchemaScript
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
          { name: "Life at Intrastack", url: "/about/life_intrastack" },
        ])}
      />

      {/* HERO */}
      <section className="w-full bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
          <div className="relative min-h-[420px] lg:min-h-[560px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/unsplash/photo-1522071820081-009f0129c71c-1600.webp"
              alt="Life at Intrastack"
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background lg:to-background/0" />
            <div className="absolute top-6 left-6 text-xs font-semibold uppercase tracking-widest text-white/80">
              <Link href="/" className="hover:text-primary">Home</Link>
              <ChevronRight className="inline size-3 mx-1" />
              <Link href="/about" className="hover:text-primary">About</Link>
              <ChevronRight className="inline size-3 mx-1" />
              <span className="text-primary">Life at Intrastack</span>
            </div>
          </div>

          <div className="flex flex-col justify-center px-6 lg:px-14 py-16 lg:py-20">
            <Reveal direction="right">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-[1.08] tracking-tight">
                Build your future with{" "}
                <span className="italic font-serif text-secondary">Intrastack</span>.
              </h1>
            </Reveal>
            <Reveal direction="up" delay={150}>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Welcome to Intrastack Solutions — where innovation, collaboration, and passion converge
                to shape the future of technology. If you&apos;re ready to embark on a journey that
                values creativity, fosters growth, and propels you toward the forefront of
                technological excellence, you&apos;ve come to the right place.
              </p>
            </Reveal>

            <Reveal direction="up" delay={300}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/careers">
                    Explore open roles <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/contact">Talk to us</Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="w-full bg-accent py-24 md:py-28 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16 items-end">
            <Reveal direction="left">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                What you&apos;ll{" "}
                <span className="italic font-serif text-secondary">find here.</span>
              </h2>
            </Reveal>
            <Reveal direction="right" delay={150}>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Four things we hold to, every release, every retrospective, every hire.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <Reveal
                key={v.title}
                direction="scale"
                delay={i * 90}
                className="hover-lift rounded-2xl border border-base-300 bg-base-100 p-8 flex flex-col"
              >
                <div className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <v.icon className="size-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-foreground">{v.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{v.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-background py-24 md:py-28 px-6 border-t border-base-300">
        <Reveal direction="scale" className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            Don&apos;t see a must?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We&apos;re always looking for talented people.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/careers">
                See open roles <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
