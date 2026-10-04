import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, MapPin, Mail, Phone, Globe2, Clock } from "lucide-react";
import SchemaScript from "@/components/seo/SchemaScript";
import { breadcrumbSchema, localBusinessSchema } from "@/lib/seo/schemas";
import { Button } from "@/components/ui/button";
import SplitContactForm from "@/components/public/splitContactForm";
import Reveal from "@/components/public/reveal";
import { SITE } from "@/lib/seo/site";
import SectionSeam from "@/components/public/sectionSeam";

export const metadata: Metadata = {
  title: "Contact Us · Intrastack",
  description:
    "Get in touch with Intrastack Solutions — headquartered in Las Vegas with delivery centers in Ho Chi Minh City, Tokyo, and Bengaluru.",
  alternates: { canonical: "/contact" },
};

const DELIVERY_CENTERS = [
  {
    flag: "🇻🇳",
    country: "Vietnam Delivery Center",
    address: "596 Cong Hoa Street, Ward 13, Tan Binh District, Ho Chi Minh City",
    lead: "Mr. Trung Huynh",
    email: "vietnam@intrastack.com",
  },
  {
    flag: "🇯🇵",
    country: "Japan Delivery Center",
    address: "803-6 Yamazaki-machi, Machida-shi, Tokyo-to 195-0074, Japan",
    lead: "Mr. Cuong Truong",
    email: "japan@intrastack.com",
  },
  {
    flag: "🇮🇳",
    country: "India Delivery Center",
    address:
      "15/1, 185/2, 185/A, 18th Main Road, Jayanagar 9th Block, Bengaluru, Karnataka 560041, India",
    lead: "Mr. Bhaskar Pal",
    email: "india@intrastack.com",
  },
];

export default function Page() {
  const { email, telephone, address } = SITE.contact;
  const phoneDisplay = "888-959-7868";
  const fullAddress = `${address.streetAddress}, ${address.addressLocality}, ${address.addressRegion} ${address.postalCode}`;
  const mapsQuery = encodeURIComponent(`Intrastack Solutions, ${fullAddress}`);

  return (
    <main className="flex flex-col flex-1 pt-26">
      <SchemaScript
        data={[
          localBusinessSchema(),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Contact", url: "/contact" },
          ]),
        ]}
      />

      {/* HERO */}
      <section className="w-full bg-background">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="inline size-3 mx-1" />
            <span className="text-primary">Contact Us</span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-10 items-end">
            <div>
              <h1 className="anim-rise text-4xl md:text-5xl font-bold text-foreground leading-[1.08] tracking-tight">
                Let&apos;s start a{" "}
                <span className="italic font-serif text-secondary">conversation</span>.
              </h1>
            </div>
            <p className="anim-rise anim-rise-delay-1 text-lg text-muted-foreground leading-relaxed">
              We value your inquiries and are here to help on your journey to technological
              excellence. Send a message and our team will respond within one business day.
            </p>
          </div>
        </div>
      </section>

      <SectionSeam variant="wave" topColor="var(--paper)" bottomColor="var(--paper-2)" flip />

      {/* FORM */}
      <section className="w-full bg-paper-2 py-20 md:py-24 px-6 border-base-300">
        <div className="mx-auto max-w-7xl">
          <SplitContactForm
            title="Ready to get started?"
            subtitle="Send a message — a senior engineer will respond within one business day."
          />
          <p className="sr-only">Contact form for Intrastack Solutions.</p>
        </div>
      </section>

      {/* MAP + HOURS */}
      <section className="w-full bg-background py-16 px-6 border-t border-base-300">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10">
          <div className="relative overflow-hidden rounded-2xl border border-base-300 aspect-[16/9] lg:aspect-auto lg:min-h-[320px] bg-card">
            <iframe
              title="Intrastack HQ map"
              src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`}
              className="absolute inset-0 size-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="rounded-2xl border border-base-300 bg-base-100 p-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary">
              <Clock className="size-3.5" /> Hours of operation
            </div>
            <p className="mt-3 text-sm text-foreground">
              Monday – Friday · 09:00 – 18:00 PT
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Follow-the-sun coverage via our APAC delivery centers.
            </p>
          </div>
        </div>
      </section>

            {/* CONTACT TILES */}
      <section className="w-full bg-accent py-16 md:py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <Reveal className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ContactTile
              icon={MapPin}
              label="Our address"
              primary="Intrastack Solutions"
              secondary={fullAddress}
              href={`https://www.google.com/maps?q=${mapsQuery}`}
              ariaLabel="Open address in Google Maps"
            />
            <ContactTile
              icon={Mail}
              label="Our mailbox"
              primary={email}
              secondary="Replies within 1 business day"
              href={`mailto:${email}`}
              ariaLabel={`Email ${email}`}
            />
            <ContactTile
              icon={Phone}
              label="Our phone"
              primary={phoneDisplay}
              secondary="Mon–Fri · 09:00–18:00 PT"
              href={`tel:${telephone}`}
              ariaLabel={`Call ${phoneDisplay}`}
            />
          </Reveal>
        </div>
      </section>

      {/* DELIVERY CENTERS */}
      <section className="w-full bg-accent py-20 md:py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-12 items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                <Globe2 className="inline size-3.5 mr-1" /> Global footprint
              </span>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold text-foreground leading-tight">
                Delivery{" "}
                <span className="italic font-serif text-secondary">centers.</span>
              </h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Senior engineering teams across three additional regions keep work moving
              while one timezone sleeps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DELIVERY_CENTERS.map((c, i) => (
              <Reveal
                key={c.country}
                delay={i * 80}
                className="hover-lift rounded-2xl border border-base-300 bg-base-100 p-6 flex flex-col"
              >
                <div className="text-3xl leading-none">{c.flag}</div>
                <h3 className="mt-4 text-base font-bold text-foreground">{c.country}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">
                  {c.address}
                </p>
                <div className="mt-4 pt-4 border-t border-base-300 space-y-1 text-sm">
                  <div className="text-foreground">
                    <span className="font-semibold">Lead:</span> {c.lead}
                  </div>
                  <a
                    href={`mailto:${c.email}`}
                    className="text-primary hover:underline break-all"
                  >
                    {c.email}
                  </a>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button asChild variant="outline">
              <Link href="/about/delivery_centers">
                See all delivery centers <ChevronRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

function ContactTile({
  icon: Icon,
  label,
  primary,
  secondary,
  href,
  ariaLabel,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  primary: string;
  secondary: string;
  href: string;
  ariaLabel: string;
}) {
  const isExternal = href.startsWith("http");
  const linkProps = isExternal
    ? { target: "_blank" as const, rel: "noreferrer" as const }
    : {};
  void ariaLabel;
  return (
    <a
      href={href}
      {...linkProps}
      className="group hover-lift rounded-2xl border border-base-300 bg-base-100 p-7 flex flex-col hover:border-primary"
    >
      <div className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-6" />
      </div>
      <div className="mt-5 text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 text-lg font-bold text-foreground group-hover:text-primary transition-colors break-words">
        {primary}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{secondary}</div>
    </a>
  );
}
