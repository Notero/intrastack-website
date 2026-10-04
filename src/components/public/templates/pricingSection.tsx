"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Reveal, { RevealGroup } from "@/components/public/reveal";

type Tier = {
  name: string;
  monthly: number | null;
  annual: number | null;
  priceLabel?: string;
  description: string;
  items: string[];
  featured?: boolean;
};

const TIERS: Tier[] = [
  {
    name: "Starter",
    monthly: 499,
    annual: Math.round(499 * 0.8),
    description: "Perfect for small businesses getting started with the cloud.",
    items: [
      "Cloud readiness assessment",
      "Up to 5 workloads migrated",
      "Business-hours support",
      "Monthly cost review",
    ],
  },
  {
    name: "Professional",
    monthly: 1299,
    annual: Math.round(1299 * 0.8),
    description: "For growing teams that need more power and automation.",
    featured: true,
    items: [
      "Everything in Starter",
      "Up to 25 workloads migrated",
      "CI/CD pipeline automation",
      "24/5 priority support",
      "Quarterly architecture review",
    ],
  },
  {
    name: "Enterprise",
    monthly: null,
    annual: null,
    priceLabel: "Custom",
    description: "Tailored solutions for large-scale, mission-critical deployments.",
    items: [
      "Unlimited workloads",
      "Dedicated senior engineer",
      "24/7 mission-critical support",
      "Custom SLAs & compliance",
      "On-site engagement options",
    ],
  },
];

export default function PricingSection({ emphClass = "text-secondary" }: { emphClass?: string }) {
  const [annual, setAnnual] = useState(false);

  return (
    <section className="w-full bg-paper-4 py-28 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-12 items-end">
          <Reveal direction="down">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              <span className={`italic font-serif ${emphClass}`}>Pricing</span>
            </h2>
          </Reveal>
          <Reveal direction="up" delay={150}>
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center rounded-full border border-base-300 bg-base-100 p-1">
                <button
                  type="button"
                  onClick={() => setAnnual(false)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    !annual ? "bg-primary text-primary-content" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setAnnual(true)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    annual ? "bg-primary text-primary-content" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Annual
                </button>
              </div>
              <span className="rounded-full bg-secondary/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-secondary">
                Save 20%
              </span>
            </div>
          </Reveal>
        </div>

        <RevealGroup
          direction="scale"
          stagger={120}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          itemClassName="h-full"
        >
          {TIERS.map((t) => {
            const price =
              t.priceLabel ?? (annual ? t.annual : t.monthly);
            const showSlash = t.priceLabel == null;
            return (
              <div
                key={t.name}
                className={`relative h-full rounded-2xl border p-8 flex flex-col ${
                  t.featured
                    ? "border-primary bg-gradient-to-br from-base-100 to-base-200 shadow-xl shadow-primary/10"
                    : "border-base-300 bg-base-100"
                }`}
              >
                {t.featured && (
                  <span className="absolute -top-3 right-6 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-foreground">{t.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  {showSlash && <span className="text-2xl font-bold text-foreground">$</span>}
                  <span className="text-5xl font-bold text-foreground tracking-tight">
                    {typeof price === "number" ? price.toLocaleString() : price}
                  </span>
                  {showSlash && (
                    <span className="text-sm font-semibold text-muted-foreground">/mo</span>
                  )}
                </div>
                <ul className="mt-6 space-y-3 flex-1">
                  {t.items.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={2.5} />
                      {it}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`mt-8 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors ${
                    t.featured
                      ? "bg-primary text-primary-content hover:bg-primary/90 shadow-lg shadow-primary/30"
                      : "border border-base-300 bg-base-100/50 text-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  Choose {t.name} <ArrowRight className="size-4" />
                </Link>
              </div>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
