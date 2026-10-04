import Link from "next/link";
import { ArrowRight, ChevronRight, Cpu, BarChart3, ShieldCheck, Cloud, Users, MapPin } from "lucide-react";
import SchemaScript from "@/components/seo/SchemaScript";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import Reveal, { RevealGroup } from "@/components/public/reveal";
import SectionSeam from "@/components/public/sectionSeam";
import EditorialNarrative from "@/components/public/narrative/EditorialNarrative";
import { renderAccent } from "@/lib/text/accent";

export const metadata = {
  title: "Company Overview · Intrastack",
  description:
    "Intrastack Solutions — a premier multi-cloud consulting and IT services firm founded by Stefan Nguyen in 2019, headquartered in the United States with delivery centers across Vietnam, Japan, and India.",
  alternates: { canonical: "/about" },
};

const DELIVERY_CENTERS = [
  { city: "Las Vegas", country: "United States · HQ", note: "Founded 2019" },
  { city: "Ho Chi Minh City", country: "Vietnam", note: "APAC delivery" },
  { city: "Tokyo", country: "Japan", note: "APAC delivery" },
  { city: "Bengaluru", country: "India", note: "Follow-the-sun" },
];

const SPECIALIZATIONS = [
  { icon: Cpu, title: "AI & Machine Learning", body: "Production-grade models, training pipelines, and inference at scale — for the workflows that move the number." },
  { icon: BarChart3, title: "Data Analytics", body: "Comprehensive analytics — unified pipelines, trusted metrics, and the dashboards leaders actually open." },
  { icon: Cloud, title: "Cloud Transformation", body: "Strategy, migration, and operations as one motion across AWS, Azure, and GCP." },
  { icon: ShieldCheck, title: "Security & Compliance", body: "Audit-ready controls aligned to SOC, HIPAA, GDPR, PCI DSS, and FedRAMP — codified, not documented." },
];

export default function AboutPage() {
  return (
    <main className="flex flex-col flex-1 pt-26">
      <SchemaScript
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
        ])}
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
              <span className="text-primary">Company Overview</span>
            </div>
          </Reveal>
          <Reveal direction="left" delay={120}>
            <h1 className="mt-6 max-w-4xl text-5xl md:text-7xl font-bold text-foreground leading-[1.02] tracking-tight">
              {renderAccent("Executive-grade advisory. Production-grade [[engineering.]]", "italic font-serif text-secondary")}
            </h1>
          </Reveal>
          <Reveal direction="up" delay={260}>
            <p className="mt-7 max-w-3xl text-lg text-muted-foreground leading-relaxed">
              {renderAccent("IntraStack Solutions was established to address a structural gap in enterprise technology — the absence of a partner that delivers strategy and engineering under [[a single accountable model.]]", "italic font-serif text-secondary")}
            </p>
          </Reveal>
          <Reveal direction="up" delay={400}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-content hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
              >
                Partner with us <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/about/mission_vision"
                className="inline-flex items-center gap-2 rounded-lg border border-base-300 bg-base-100/50 px-5 py-3 text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                Mission & vision
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <SectionSeam variant="wave" topColor="var(--paper)" bottomColor="var(--paper-3)" />

      {/* STORY */}
      <EditorialNarrative
        bg="bg-paper-3"
        eyebrow="Our company"
        title="One partner across strategy [[and engineering.]]"
        kicker="Founded in 2019 by Stefan Nguyen — 30+ years in enterprise technology delivery."
        lede="Enterprise transformation fails at the handoff — between the strategy deck and the engineering team, between the consultant and the client, between the roadmap and the result. IntraStack [[eliminates that handoff entirely.]]"
        pillars={[
          { title: "Founded 2019", body: "Las Vegas headquarters, established to deliver advisory and execution under [[one accountable model.]]" },
          { title: "Global delivery", body: "Ho Chi Minh City, Tokyo, and Bengaluru — engineers covering the work [[around the clock.]]" },
          { title: "30+ years of leadership", body: "Founded by an operator who has shipped enterprise transformation — not [[sold the deck.]]" },
          { title: "Multi-cloud depth", body: "Certified architects across AWS, Azure, and GCP — platform chosen against the workload, [[not the quota.]]" },
        ]}
        closing="We do not modernize technology for its own sake — we modernize it for [[the next decade of the business.]]"
      />

      {/* STATS STRIP */}
      <section className="w-full bg-accent py-16 px-6 border-y border-base-300">
        <RevealGroup direction="scale" stagger={120} className="mx-auto max-w-7xl grid grid-cols-2 lg:grid-cols-4 gap-8 text-center lg:text-left">
          <div>
            <div className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">2019</span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">Founded in the US</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">30+</span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">Years of leadership experience</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">3 + HQ</span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">Delivery centers + Las Vegas HQ</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">24/7</span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">Follow-the-sun delivery</div>
          </div>
        </RevealGroup>
      </section>

      {/* DELIVERY CENTERS */}
      <section className="w-full bg-background py-28 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16 items-end">
            <Reveal direction="right">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                {renderAccent("Three centers + HQ, [[one team.]]", "italic font-serif text-secondary")}
              </h2>
            </Reveal>
            <Reveal direction="left" delay={150}>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {renderAccent("US, Vietnam, Japan, India — work handed cleanly across time zones, so progress does not stop at [[the end of your business day.]]", "italic font-serif text-secondary")}
              </p>
            </Reveal>
          </div>

          <RevealGroup direction="up" stagger={90} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" itemClassName="h-full">
            {DELIVERY_CENTERS.map((d) => (
              <div
                key={d.city}
                className="h-full rounded-2xl border border-base-300 bg-base-200/60 p-6 hover:border-primary/60 transition-colors"
              >
                <MapPin className="size-5 text-secondary" />
                <h3 className="mt-4 text-lg font-bold text-foreground">{d.city}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{d.country}</p>
                <span className="mt-4 inline-flex rounded-full bg-primary/10 border border-primary/30 px-3 py-1 text-xs font-semibold text-primary">
                  {d.note}
                </span>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>

      <SectionSeam variant="wave" topColor="var(--paper)" bottomColor="var(--paper-3)" />

      {/* SPECIALIZATIONS */}
      <section className="w-full bg-paper-3 py-28 px-6">
        <div className="mx-auto max-w-7xl">
          <Reveal direction="down" className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">Specializations</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-[#0F1622] leading-tight">
              {renderAccent("What we are [[deep on.]]", "italic font-serif text-brand-600")}
            </h2>
          </Reveal>

          <RevealGroup direction="scale" stagger={80} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" itemClassName="h-full">
            {SPECIALIZATIONS.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="h-full rounded-2xl border border-[#E2E6EE] bg-white p-7 hover:border-primary hover:shadow-md transition-all"
              >
                <div className="grid place-items-center size-12 rounded-lg bg-primary/10 text-brand-600">
                  <Icon className="size-6" strokeWidth={1.75} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-[#0F1622]">{title}</h3>
                <p className="mt-3 text-sm text-[#5C6473] leading-relaxed">{body}</p>
              </div>
            ))}
          </RevealGroup>

          <Reveal direction="up" delay={200}>
            <div className="mt-12 flex justify-center">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-lg border border-[#0F1622] bg-white px-5 py-3 text-sm font-semibold text-[#0F1622] hover:bg-[#0F1622] hover:text-white transition-colors"
              >
                See more services <ArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <SectionSeam variant="slant" topColor="var(--paper-3)" bottomColor="var(--paper-4)" />

      {/* LEADERSHIP TEASER */}
      <section className="w-full bg-paper-4 py-28 px-6">
        <div className="mx-auto max-w-7xl rounded-3xl border border-base-300 bg-gradient-to-br from-base-200 to-base-100 p-10 md:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-10 items-center">
            <Reveal direction="left">
              <div className="grid place-items-center size-20 rounded-2xl bg-primary/10 text-primary">
                <Users className="size-10" strokeWidth={1.5} />
              </div>
            </Reveal>
            <Reveal direction="right" delay={120}>
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                  {renderAccent("A leadership team that has [[done the work.]]", "italic font-serif text-brand-600")}
                </h3>
                <p className="mt-4 text-muted-foreground">
                  {renderAccent("Operators with enterprise delivery scars — steering the firm toward outcomes the board can measure, [[not slideware.]]", "italic font-serif text-brand-600")}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/about/leadership"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-content hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
                  >
                    Meet leadership <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href="/careers"
                    className="inline-flex items-center gap-2 rounded-lg border border-base-300 bg-base-100/50 px-5 py-3 text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    Join the team
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
