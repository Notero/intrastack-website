import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import SchemaScript from "@/components/seo/SchemaScript";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import SectionSeam from "@/components/public/sectionSeam";
import PricingSection from "@/components/public/templates/pricingSection";

export const metadata: Metadata = {
  title: "Pricing · Intrastack",
  description:
    "Simple, transparent pricing for Intrastack's cloud, DevOps, AI, and staffing engagements — from self-serve Starter plans to custom Enterprise agreements.",
  alternates: { canonical: "/pricing" },
};

export default function Page() {
  return (
    <main className="flex flex-col flex-1 pt-26">
      <SchemaScript
        data={[
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Pricing", url: "/pricing" },
          ]),
        ]}
      />

      {/* HERO */}
      <section className="w-full bg-background">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="inline size-3 mx-1" />
            <span className="text-primary">Pricing</span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-10 items-end">
            <div>
              <h1 className="anim-rise text-4xl md:text-5xl font-bold text-foreground leading-[1.08] tracking-tight">
                Simple, transparent{" "}
                <span className="italic font-serif text-secondary">pricing</span>.
              </h1>
            </div>
            <p className="anim-rise anim-rise-delay-1 text-lg text-muted-foreground leading-relaxed">
              No hidden fees, no surprise scope. Pick a plan that fits your team today, or talk
              to us about a custom engagement.
            </p>
          </div>
        </div>
      </section>

      <SectionSeam variant="wave" topColor="var(--paper)" bottomColor="var(--paper-4)" flip />

      <PricingSection />
    </main>
  );
}
