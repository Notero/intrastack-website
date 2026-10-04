import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight, Check, Star, Handshake } from "lucide-react";
import SchemaScript from "@/components/seo/SchemaScript";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import Reveal from "@/components/public/reveal";
import SectionSeam from "@/components/public/sectionSeam";

export const metadata = {
  title: "Partners · Intrastack",
  description:
    "Intrastack's trusted technology partnerships — Microsoft Azure, Google Cloud Platform, and AWS. Strategic alliances that power scalable, secure, and innovative cloud solutions.",
  alternates: { canonical: "/about/partners" },
};

type Partner = {
  name: string;
  tier: string;
  rating: number;
  body: string;
  highlights: string[];
  accent: "primary" | "secondary";
  logoSlug: string;
  /** Local override for brands Simple Icons no longer serves (dropped trademarked-brand slugs). */
  logoSrc?: string;
};

const PARTNERS: Partner[] = [
  {
    name: "Microsoft Azure",
    tier: "Certified Microsoft Azure Partner",
    rating: 4.5,
    body:
      "As a certified Microsoft Azure partner, we harness the full potential of Azure's cloud services to deliver transformative solutions. From fundamental cloud infrastructure to advanced analytics and AI capabilities, our partnership with Azure empowers us to craft scalable and secure solutions tailored to your unique business needs.",
    highlights: ["Azure landing zones", "Entra ID & PIM", "Defender for Cloud", "Azure AI & analytics"],
    accent: "primary",
    logoSlug: "microsoftazure",
    logoSrc: "/images/expertise/Azure.webp",
  },
  {
    name: "Google Cloud Platform",
    tier: "GCP Service Partner",
    rating: 5,
    body:
      "Our collaboration with Google Cloud Platform extends the boundaries of what's possible. Leveraging GCP's robust infrastructure and cutting-edge technologies, we create dynamic and scalable solutions. From data analytics to machine learning, our partnership with GCP ensures that your organization stays at the forefront of innovation.",
    highlights: ["GKE & Anthos", "BigQuery & Looker", "Vertex AI", "Workspace & identity"],
    accent: "secondary",
    logoSlug: "googlecloud",
  },
  {
    name: "Amazon Web Services",
    tier: "AWS Advanced Consulting Partner",
    rating: 5,
    body:
      "Intrastack Solutions is an AWS Advanced Consulting Partner, bringing the power of AWS's cloud offerings to your doorstep. Our AWS-certified professionals leverage the extensive AWS ecosystem to design and implement solutions that drive efficiency, scalability, and agility for your business.",
    highlights: ["Control Tower & EKS", "Well-Architected reviews", "FinOps & savings plans", "GuardDuty & Security Hub"],
    accent: "primary",
    logoSlug: "amazonwebservices",
    logoSrc: "/images/Amazon_Web_Services_2025.svg",
  },
  {
    name: "Palo Alto Networks",
    tier: "Cybersecurity Partner",
    rating: 4.5,
    body:
      "In the realm of cybersecurity, our partnership with Palo Alto Networks stands as a testament to our commitment to safeguarding your digital assets. Palo Alto's cutting-edge security solutions, coupled with our expertise, provide a robust defense against evolving cyber threats, ensuring the integrity and confidentiality of your data.",
    highlights: ["Next-gen firewalls", "Prisma Cloud", "Cortex XDR & XSOAR", "Zero Trust architecture"],
    accent: "secondary",
    logoSlug: "paloaltonetworks",
  },
  {
    name: "CrowdStrike",
    tier: "Endpoint Security Partner",
    rating: 4.5,
    body:
      "Collaborating with CrowdStrike, a leader in cloud-delivered endpoint protection, we elevate your organization's security posture. Our partnership ensures that your endpoints are fortified against sophisticated threats, providing real-time protection and visibility across your digital landscape.",
    highlights: ["Falcon endpoint protection", "Threat intelligence", "Managed detection & response", "Identity protection"],
    accent: "primary",
    logoSlug: "crowdstrike",
  },
  {
    name: "Tenable",
    tier: "Vulnerability Management Partner",
    rating: 5,
    body:
      "Intrastack Solutions, in partnership with Tenable, strengthens your cybersecurity posture through advanced vulnerability management. Tenable's solutions, combined with our expertise, enable proactive identification and mitigation of vulnerabilities, reducing your risk exposure and enhancing overall security resilience.",
    highlights: ["Tenable.io & Nessus", "Continuous monitoring", "Risk-based prioritization", "Compliance reporting"],
    accent: "secondary",
    logoSlug: "tenable",
  },
  {
    name: "Hewlett Packard Enterprise",
    tier: "HPE Solution Partner",
    rating: 5,
    body:
      "Our partnership with Hewlett Packard Enterprise brings enterprise-grade compute, storage, and edge-to-cloud platforms to every engagement. Together with HPE's GreenLake portfolio, we deliver hybrid infrastructure that flexes with your workloads — without the lock-in or capital strain of traditional ownership.",
    highlights: ["HPE GreenLake", "ProLiant & Synergy compute", "Aruba networking", "Hybrid cloud & edge"],
    accent: "primary",
    logoSlug: "hp",
  },
  {
    name: "Nutanix",
    tier: "Nutanix Channel Partner",
    rating: 5,
    body:
      "Through our partnership with Nutanix, we deliver hyperconverged infrastructure and hybrid multicloud platforms that simplify operations without sacrificing performance. Nutanix's software-defined approach, combined with our deployment expertise, lets your teams run any app on any cloud with a single, consistent operating model.",
    highlights: ["AHV & AOS", "Nutanix Cloud Clusters", "Files, Objects & Volumes", "Database & Kubernetes services"],
    accent: "secondary",
    logoSlug: "nutanix",
  },
];

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div role="img" className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f${i}`} className="size-4 fill-secondary text-secondary" strokeWidth={1.5} />
      ))}
      {half && (
        <div className="relative size-4" aria-hidden>
          <Star className="absolute inset-0 size-4 text-secondary" strokeWidth={1.5} />
          <div className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
            <Star className="size-4 fill-secondary text-secondary" strokeWidth={1.5} />
          </div>
        </div>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e${i}`} className="size-4 text-secondary/40" strokeWidth={1.5} />
      ))}
    </div>
  );
}

export default function PartnersPage() {
  return (
    <main className="flex flex-col flex-1 pt-26">
      <SchemaScript
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
          { name: "Partners", url: "/about/partners" },
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
              <span className="text-primary">Partners</span>
            </div>
          </Reveal>
          <Reveal direction="scale" delay={120}>
            <span className="mt-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              <Handshake className="size-3.5" strokeWidth={2} />
              Pioneering excellence together
            </span>
          </Reveal>
          <Reveal direction="right" delay={240}>
            <h1 className="mt-5 max-w-4xl text-5xl md:text-7xl font-bold text-foreground leading-[1.02] tracking-tight">
              Our trusted <span className="italic font-serif text-secondary">technology</span> partnerships.
            </h1>
          </Reveal>
          <Reveal direction="up" delay={380}>
            <p className="mt-7 max-w-3xl text-lg text-muted-foreground leading-relaxed">
              At Intrastack Solutions, we believe in the power of collaboration and strategic alliances. Our
              commitment to delivering cutting-edge solutions is fortified by strong partnerships with industry
              leaders — driving innovation and excellence across the digital landscape.
            </p>
          </Reveal>
        </div>
      </section>

      <SectionSeam variant="wave" topColor="var(--paper)" bottomColor="var(--paper-3)" />

      {/* PARTNER LIST */}
      <section className="w-full bg-paper-3 py-28 px-6">
        <div className="mx-auto max-w-7xl space-y-10">
          {PARTNERS.map((p, i) => (
            <Reveal
              as="article"
              key={p.name}
              direction={i % 2 === 0 ? "left" : "right"}
              className="rounded-3xl border border-[#E2E6EE] bg-white overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr]">
                {/* Brand panel */}
                <div
                  className={`relative p-10 md:p-12 flex flex-col items-start justify-between gap-8 ${
                    p.accent === "primary"
                      ? "bg-gradient-to-br from-primary/15 via-primary/5 to-transparent"
                      : "bg-gradient-to-br from-secondary/20 via-secondary/5 to-transparent"
                  }`}
                >
                  <div className="text-xs font-bold uppercase tracking-widest text-[#5C6473]">
                    Partner · {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <div className="flex h-20 w-full items-center justify-start rounded-xl bg-white/80 px-5 py-3 ring-1 ring-black/5 backdrop-blur-sm">
                      <Image
                        src={p.logoSrc ?? `https://cdn.simpleicons.org/${p.logoSlug}`}
                        alt={`${p.name} logo`}
                        width={160}
                        height={48}
                        loading="lazy"
                        unoptimized={!p.logoSrc}
                        style={{ width: "auto", height: "100%" }}
                        className="max-h-12 object-contain"
                      />
                    </div>
                    <div
                      className={`mt-5 text-3xl md:text-4xl font-bold leading-tight ${
                        p.accent === "primary" ? "text-primary" : "text-[#0F1622]"
                      }`}
                    >
                      {p.name}
                    </div>
                    <div className="mt-3">
                      <Stars rating={p.rating} />
                    </div>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      p.accent === "primary"
                        ? "bg-brand-500 text-white"
                        : "bg-brand-500 text-brand-500"
                    }`}
                  >
                    {p.tier}
                  </span>
                </div>

                {/* Copy panel */}
                <div className="p-10 md:p-12">
                  <p className="text-[#5C6473] leading-relaxed text-lg">{p.body}</p>
                  <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                    {p.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm text-[#0F1622]">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={2.5} />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CLOSING STATEMENT */}
      <section className="w-full bg-accent py-28 px-6 border-y border-base-300">
        <Reveal direction="scale" className="mx-auto max-w-5xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Why these partnerships
          </span>
          <p className="mt-6 text-2xl md:text-3xl font-semibold text-foreground leading-snug">
            At Intrastack, we choose our partners carefully to ensure that our clients receive the highest
            quality solutions and services. These collaborations empower us to deliver{" "}
            <span className="italic font-serif text-secondary">comprehensive and innovative</span> technology
            solutions that drive your business forward.
          </p>
          <p className="mt-10 text-xl md:text-2xl italic font-serif text-secondary">
            &ldquo;Intrastack Solutions: Where Collaboration Drives Innovation, and Excellence is a Collective Pursuit.&rdquo;
          </p>
        </Reveal>
      </section>

      {/* FINAL CTA */}
      <section className="w-full bg-background py-24 px-6">
        <div className="mx-auto max-w-7xl rounded-3xl border border-base-300 bg-gradient-to-br from-base-200 to-base-100 p-10 md:p-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <Reveal direction="left">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                Want partner-grade <span className="italic font-serif text-secondary">access</span> on your next build?
              </h2>
              <p className="mt-3 text-muted-foreground">
                We bring the relationships, the credits, and the escalation paths — your team brings the
                problem.
              </p>
            </div>
          </Reveal>
          <Reveal direction="right" delay={150} className="shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-sm font-semibold text-primary-content hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
            >
              Talk to us <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
