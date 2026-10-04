import Link from "next/link";
import { ArrowRight, ChevronRight, Target, Compass, Sparkles, ShieldCheck, Globe2, Handshake } from "lucide-react";
import SchemaScript from "@/components/seo/SchemaScript";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import Reveal, { RevealGroup } from "@/components/public/reveal";
import SectionSeam from "@/components/public/sectionSeam";

export const metadata = {
  title: "Mission & Vision · Intrastack",
  description:
    "Intrastack's mission is to empower businesses with innovative, secure, and scalable multi-cloud solutions. Our vision: to be the trusted global leader in multi-cloud consulting.",
  alternates: { canonical: "/about/mission_vision" },
};

const VALUES = [
  {
    icon: Sparkles,
    title: "Innovation",
    body: "We bet on the technologies that move the number — not the ones that make a deck look good.",
  },
  {
    icon: ShieldCheck,
    title: "Security",
    body: "Hardened defaults from day one. Compliance evidence falls out of the pipeline, not out of a binder.",
  },
  {
    icon: Globe2,
    title: "Scale",
    body: "Architectures and operating models that hold from pilot to production to peak season.",
  },
  {
    icon: Handshake,
    title: "Partnership",
    body: "We don't sell hours. We build the kind of relationship clients renew without an RFP.",
  },
];

export default function MissionVisionPage() {
  return (
    <main className="flex flex-col flex-1 pt-26">
      <SchemaScript
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
          { name: "Mission & Vision", url: "/about/mission_vision" },
        ])}
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
              <Link href="/about" className="hover:text-primary">About</Link>
              <ChevronRight className="inline size-3 mx-1" />
              <span className="text-primary">Mission & Vision</span>
            </div>
          </Reveal>
          <Reveal direction="right" delay={120}>
            <h1 className="mt-6 max-w-4xl text-5xl md:text-7xl font-bold text-foreground leading-[1.02] tracking-tight">
              What we&apos;re here <span className="italic font-serif text-secondary">to do.</span>
            </h1>
          </Reveal>
          <Reveal direction="up" delay={260}>
            <p className="mt-7 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              The mission that drives the work, and the vision we&apos;re building toward — the two sentences
              every engagement at Intrastack has to live up to.
            </p>
          </Reveal>
        </div>
      </section>

      <SectionSeam variant="wave" topColor="var(--paper)" bottomColor="var(--paper-3)" />

      {/* MISSION + VISION cards */}
      <section className="w-full bg-paper-3 py-28 px-6">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mission */}
          <Reveal as="article" direction="left" className="relative rounded-3xl border border-[#E2E6EE] bg-white p-10 md:p-12 overflow-hidden">
            <div aria-hidden className="absolute -top-20 -right-20 size-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative">
              <div className="grid place-items-center size-14 rounded-2xl bg-primary/15 text-primary">
                <Target className="size-7" strokeWidth={1.75} />
              </div>
              <span className="mt-6 inline-block text-xs font-semibold uppercase tracking-widest text-brand-600">
                Mission statement
              </span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#0F1622] leading-tight">
                Empower businesses through{" "}
                <span className="italic font-serif text-brand-600">cloud.</span>
              </h2>
              <blockquote className="mt-8 border-l-4 border-primary pl-6 text-xl md:text-2xl font-medium text-[#0F1622] leading-snug italic">
                &ldquo;To empower businesses by delivering innovative, secure, and scalable multi-cloud
                solutions that drive growth, efficiency, and competitive advantage.&rdquo;
              </blockquote>
              <p className="mt-8 text-[#5C6473] leading-relaxed">
                Every engagement is measured against that single sentence. Innovative — we ship what works,
                not what&apos;s fashionable. Secure — controls hardened by default. Scalable — built to hold
                from day one to peak season. The outcome is growth, efficiency, and a durable competitive
                edge for the businesses we serve.
              </p>
            </div>
          </Reveal>

          {/* Vision */}
          <Reveal as="article" direction="right" delay={150} className="relative rounded-3xl border border-border bg-paper-2 text-foreground p-10 md:p-12 overflow-hidden">
            <div aria-hidden className="absolute -top-20 -left-20 size-72 rounded-full bg-brand-400/20 blur-3xl" />
            <div className="relative">
              <div className="grid place-items-center size-14 rounded-2xl bg-brand-500/10 text-brand-600">
                <Compass className="size-7" strokeWidth={1.75} />
              </div>
              <span className="mt-6 inline-block text-xs font-semibold uppercase tracking-widest text-brand-500">
                Vision statement
              </span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-foreground leading-tight">
                The trusted global <span className="italic font-serif text-brand-500">leader.</span>
              </h2>
              <blockquote className="mt-8 border-l-4 border-brand-500 pl-6 text-xl md:text-2xl font-medium text-foreground leading-snug italic">
                &ldquo;To be the trusted global leader in multi-cloud consulting, transforming businesses
                through expert solutions and strategic partnerships.&rdquo;
              </blockquote>
              <p className="mt-8 text-ink-600 leading-relaxed">
                Trusted — earned one engagement at a time. Global — because the best teams aren&apos;t in one
                time zone. Expert — depth across AWS, Azure, GCP, and the platforms enterprises actually
                run. Partnerships — not vendors, not order-takers; the engineering teammates clients keep
                close for the long run.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* VALUES */}
      <section className="w-full bg-background py-28 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16 items-end">
            <Reveal direction="left">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                The values that <span className="italic font-serif text-secondary">back it up.</span>
              </h2>
            </Reveal>
            <Reveal direction="right" delay={150}>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A mission and vision are only worth what the team behind them does on a Tuesday afternoon.
                These are the four we measure ourselves on.
              </p>
            </Reveal>
          </div>

          <RevealGroup direction="scale" stagger={90} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" itemClassName="h-full">
            {VALUES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="h-full rounded-2xl border border-base-300 bg-base-200/60 p-7 hover:border-primary/60 transition-colors"
              >
                <div className="grid place-items-center size-12 rounded-lg bg-primary/15 text-primary">
                  <Icon className="size-6" strokeWidth={1.75} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-foreground">{title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* COMMITMENT QUOTE */}
      <section className="w-full bg-accent py-28 px-6 border-y border-base-300">
        <Reveal direction="scale" className="mx-auto max-w-5xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Our commitment</span>
          <p className="mt-6 text-3xl md:text-4xl font-bold text-foreground leading-snug">
            Excellence, innovation, and{" "}
            <span className="italic font-serif text-secondary">customer satisfaction</span> — applied to
            every engagement, every quarter, every release.
          </p>
          <p className="mt-8 text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Stefan Nguyen founded Intrastack on the conviction that cloud transformation deserved a partner
            who would treat it as engineering, not theatre. That conviction shapes how we hire, how we
            architect, and how we hand over.
          </p>
        </Reveal>
      </section>

      {/* FINAL CTA */}
      <section className="w-full bg-background py-24 px-6">
        <div className="mx-auto max-w-7xl rounded-3xl border border-base-300 bg-gradient-to-br from-base-200 to-base-100 p-10 md:p-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <Reveal direction="left">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                Build with a team that <span className="italic font-serif text-secondary">means it.</span>
              </h3>
              <p className="mt-3 text-muted-foreground">
                A 30-min call with someone who&apos;s done this before — no SDRs, no decks.
              </p>
            </div>
          </Reveal>
          <Reveal direction="right" delay={150} className="shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-sm font-semibold text-primary-content hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
            >
              Partner with us <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
