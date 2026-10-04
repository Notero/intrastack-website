import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import SchemaScript from "@/components/seo/SchemaScript";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { Button } from "@/components/ui/button";
import CareersBoard from "@/components/public/careersBoard";
import { fetchJobs } from "@/lib/content/jobs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Careers · Intrastack",
  description:
    "Open roles at Intrastack Solutions. Build the future of cloud, AI, security, and data with a team that ships.",
  alternates: { canonical: "/careers" },
};

// Always fetch fresh — listings change as HR opens/closes roles.
export const revalidate = 0;

export default async function Page() {
  const jobs = await fetchJobs();

  return (
    <main className="flex flex-col flex-1 pt-26">
      <SchemaScript
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Careers", url: "/careers" },
        ])}
      />

      {/* HERO */}
      <section className="w-full bg-background">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="inline size-3 mx-1" />
            <span className="text-primary">Careers</span>
          </div>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 items-end">
            <div>
              <h1 className="anim-rise text-4xl md:text-5xl font-bold text-foreground leading-[1.08] tracking-tight">
                Build your future with{" "}
                <span className="italic font-serif text-secondary">Intrastack</span>.
              </h1>
            </div>
            <p className="anim-rise anim-rise-delay-1 text-lg text-muted-foreground leading-relaxed">
              Open positions across engineering, architecture, and delivery. Browse the board,
              read the brief, and apply in under two minutes.
            </p>
          </div>
        </div>
      </section>

      {/* BOARD */}
      <section className="w-full bg-accent py-16 md:py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <CareersBoard jobs={jobs} />
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-background py-20 md:py-24 px-6 border-t border-base-300">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            Don&apos;t see the right role?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We&apos;re always looking for talented people.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/contact">
                Contact us <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/about/life_intrastack">Life at Intrastack</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
