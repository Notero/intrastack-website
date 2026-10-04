import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  MapPin,
  Award,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import SchemaScript from "@/components/seo/SchemaScript";
import { breadcrumbSchema, personSchema } from "@/lib/seo/schemas";
import { fetchLeadershipPerson } from "@/lib/content/leadership";
import { leaderPhotoUrl } from "@/lib/supabase/storage";
import { PortraitBlock, ContactSocialsRow } from "@/components/public/leadershipCard";
import SectionSeam from "@/components/public/sectionSeam";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const leader = await fetchLeadershipPerson(slug);
  if (!leader || leader.group_name === "advisor") return {};
  return {
    title: `${leader.name} · Intrastack`,
    description: `${leader.name} — ${leader.title}${
      leader.region ? `, ${leader.region}` : ""
    }. ${leader.intro[0]?.slice(0, 140) ?? ""}`,
    alternates: { canonical: `/about/leadership/${leader.slug}` },
  };
}

const ICONS = [Award, Sparkles, ShieldCheck] as const;

export default async function LeaderProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const leader = await fetchLeadershipPerson(slug);
  if (!leader || leader.group_name === "advisor") notFound();

  const photoUrl = leaderPhotoUrl(leader.photo_path);

  return (
    <main className="flex flex-col flex-1 pt-26">
      <SchemaScript
        data={[
          personSchema({
            name: leader.name,
            jobTitle: leader.title,
            image: photoUrl ?? undefined,
            email: leader.email ?? undefined,
            sameAs: [leader.linkedin_url, leader.instagram_url, leader.twitter_url].filter(Boolean) as string[],
          }),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "About", url: "/about" },
            { name: "Leadership", url: "/about/leadership" },
            { name: leader.name, url: `/about/leadership/${leader.slug}` },
          ]),
        ]}
      />

      {/* HERO */}
      <section className="relative w-full bg-background overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -right-32 size-[520px] rounded-full bg-primary/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-32 size-[520px] rounded-full blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <ChevronRight className="inline size-3 mx-1" />
            <Link href="/about" className="hover:text-primary">
              About
            </Link>
            <ChevronRight className="inline size-3 mx-1" />
            <Link href="/about/leadership" className="hover:text-primary">
              Leadership
            </Link>
            <ChevronRight className="inline size-3 mx-1" />
            <span className="text-primary">{leader.name}</span>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-12 lg:gap-16 items-start">
            <PortraitBlock name={leader.name} photoUrl={photoUrl} />

            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                {leader.region ? `${leader.region} — ` : ""}
                {leader.title}
              </span>
              <h1 className="mt-4 text-5xl md:text-6xl font-bold text-foreground leading-[1.05] tracking-tight">
                {leader.name}
              </h1>
              <p className="mt-4 text-lg font-semibold text-secondary italic font-serif">
                {leader.title}
              </p>

              {leader.region && (
                <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-base-200 border border-base-300 px-3 py-1.5 text-xs font-medium text-foreground">
                  <MapPin className="size-3.5 text-secondary" strokeWidth={2} />
                  {leader.region}
                </div>
              )}

              <ContactSocialsRow
                email={leader.email}
                phone={leader.phone}
                linkedin_url={leader.linkedin_url}
                instagram_url={leader.instagram_url}
                twitter_url={leader.twitter_url}
              />

              <div className="mt-8 space-y-5">
                {leader.intro.map((para, i) => (
                  <p
                    key={i}
                    className="text-base md:text-lg text-muted-foreground leading-relaxed"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      {leader.highlights.length > 0 && (
        <section className="w-full bg-accent py-24 px-6 border-b border-base-300">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-14 items-end">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  What {leader.name.split(" ")[0]} leads
                </span>
                <h2 className="mt-4 text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  Focus areas{" "}
                  <span className="italic font-serif text-secondary">
                    & impact.
                  </span>
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leader.highlights.map((h, i) => {
                const Icon = ICONS[i % ICONS.length];
                return (
                  <div
                    key={h.title}
                    className="rounded-2xl border border-base-300 bg-base-100 p-7 hover:border-primary/60 transition-colors"
                  >
                    <div className="flex items-start gap-5">
                      <div className="grid place-items-center size-12 shrink-0 rounded-lg bg-primary/15 text-primary">
                        <Icon className="size-6" strokeWidth={1.75} />
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          0{i + 1}
                        </div>
                        <h3 className="mt-1 text-lg font-bold text-foreground">
                          {h.title}
                        </h3>
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                          {h.body}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CERTIFICATIONS */}
      {leader.certifications.length > 0 && (
        <section className="w-full bg-background py-24 px-6 border-b border-base-300">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Credentials
              </span>
              <h2 className="mt-4 text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Certifications{" "}
                <span className="italic font-serif text-secondary">& expertise.</span>
              </h2>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {leader.certifications.map((cert) => (
                <Badge key={cert} variant="outline" className="h-auto px-3 py-1.5 text-xs">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CLOSING */}
      {leader.closing && (
        <>
        <SectionSeam variant="wave" topColor="var(--paper)" bottomColor="var(--paper-3)" />
        <section className="w-full bg-paper-3 py-24 px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">
              In the company
            </span>
            <p className="mt-6 text-2xl md:text-3xl font-bold text-[#0F1622] leading-snug">
              {leader.closing}
            </p>
          </div>
        </section>
        </>
      )}

      {/* CTA */}
      <section className="w-full bg-background py-24 px-6">
        <div className="mx-auto max-w-7xl rounded-3xl border border-base-300 bg-gradient-to-br from-base-200 to-base-100 p-10 md:p-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Meet more of the{" "}
              <span className="italic font-serif text-secondary">
                Intrastack team.
              </span>
            </h3>
            <p className="mt-3 text-muted-foreground">
              Founders, executives, VPs, and directors steering each function of the company.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/about/leadership"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-base-300 bg-base-100 px-5 py-3 text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <ArrowLeft className="size-4" /> Back to leadership
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-content hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
            >
              Get in touch <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
