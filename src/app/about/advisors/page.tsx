import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import SchemaScript from "@/components/seo/SchemaScript";
import { breadcrumbSchema, personSchema } from "@/lib/seo/schemas";
import { fetchAdvisors } from "@/lib/content/leadership";
import { leaderPhotoUrl } from "@/lib/supabase/storage";
import { PersonCard, hasBio } from "@/components/public/leadershipCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Board of Advisors · Intrastack",
  description:
    "Senior leaders embedded in the regions Intrastack Solutions delivers from — keeping the company close to the markets it serves.",
  alternates: { canonical: "/about/advisors" },
};

export default async function AdvisorsPage() {
  const advisors = await fetchAdvisors();

  return (
    <main className="flex flex-col flex-1 pt-26">
      <SchemaScript
        data={[
          ...advisors.map((p) =>
            personSchema({
              name: p.name,
              jobTitle: p.title,
              image: leaderPhotoUrl(p.photo_path) ?? undefined,
              email: p.email ?? undefined,
              sameAs: [p.linkedin_url, p.instagram_url, p.twitter_url].filter(Boolean) as string[],
            })
          ),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "About", url: "/about" },
            { name: "Board of Advisors", url: "/about/advisors" },
          ]),
        ]}
      />

      {/* HERO */}
      <section className="relative w-full bg-background overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-40 -right-32 size-[520px] rounded-full bg-primary/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-32 size-[520px] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="inline size-3 mx-1" />
            <Link href="/about" className="hover:text-primary">About</Link>
            <ChevronRight className="inline size-3 mx-1" />
            <span className="text-primary">Board of Advisors</span>
          </div>
          <h1 className="mt-6 max-w-4xl text-5xl md:text-7xl font-bold text-foreground leading-[1.02] tracking-tight">
            Executive advisors, <span className="italic font-serif text-secondary">every geography.</span>
          </h1>
          <p className="mt-7 max-w-3xl text-lg text-muted-foreground leading-relaxed">
            Senior leaders embedded in the regions we deliver from. They keep the company close to the
            markets we serve and guide our organization toward technological excellence.
          </p>
        </div>
      </section>

      {/* ADVISORS GRID */}
      <section className="w-full bg-accent py-28 px-6 border-y border-base-300">
        <div className="mx-auto max-w-7xl">
          {advisors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {advisors.map((p, i) => (
                <PersonCard
                  key={p.slug}
                  person={p}
                  photoUrl={leaderPhotoUrl(p.photo_path)}
                  href={hasBio(p) ? `/about/advisors/${p.slug}` : null}
                  accent={i % 2 === 0 ? "primary" : "secondary"}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground">No advisors published yet.</p>
          )}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="w-full bg-background py-24 px-6">
        <div className="mx-auto max-w-7xl rounded-3xl border border-base-300 bg-gradient-to-br from-base-200 to-base-100 p-10 md:p-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Want to meet the <span className="italic font-serif text-secondary">team behind it?</span>
            </h3>
            <p className="mt-3 text-muted-foreground">
              30 minutes with a senior engineer or operator — no SDRs, no decks.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-sm font-semibold text-primary-content hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30 shrink-0"
          >
            Get in touch <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
