"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type TypeSet = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  heading: { family: string; label: string };
  sans: { family: string; label: string };
  mono: { family: string; label: string };
};

export default function TypographyShowcase({ sets }: { sets: TypeSet[] }) {
  const [activeId, setActiveId] = useState(sets[0].id);
  const active = sets.find((s) => s.id === activeId) ?? sets[0];

  const previewStyle = {
    "--ts-heading": active.heading.family,
    "--ts-sans": active.sans.family,
    "--ts-mono": active.mono.family,
  } as React.CSSProperties;

  return (
    <main className="min-h-screen bg-base-100 px-6 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Samples
        </p>
        <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Typography sets
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          Five professional pairings. Click a set to preview it below — the
          showcase rerenders with that set&apos;s heading, body, and mono
          families.
        </p>

        {/* Selector chips */}
        <div className="mt-10 flex flex-wrap gap-3">
          {sets.map((s) => {
            const isActive = s.id === activeId;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveId(s.id)}
                className={cn(
                  "group flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-base-300 bg-paper text-foreground hover:border-primary/50"
                )}
              >
                {isActive && <Check className="size-3.5" />}
                <span>{s.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active set summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <StackCard
            role="Heading"
            family={active.heading.label}
            fontFamily={active.heading.family}
          />
          <StackCard
            role="Body / Sans"
            family={active.sans.label}
            fontFamily={active.sans.family}
          />
          <StackCard
            role="Mono"
            family={active.mono.label}
            fontFamily={active.mono.family}
          />
        </div>

        <Separator className="my-12" />

        {/* Preview pane */}
        <Card className="p-8 md:p-12" style={previewStyle}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <Badge variant="secondary" className="uppercase tracking-wider">
              Preview · {active.name}
            </Badge>
            <p
              className="text-sm text-muted-foreground"
              style={{ fontFamily: "var(--ts-sans)" }}
            >
              {active.tagline}
            </p>
          </div>

          {/* Display */}
          <h2
            className="mt-8 text-5xl md:text-7xl font-bold tracking-tight leading-[0.95] text-foreground"
            style={{ fontFamily: "var(--ts-heading)" }}
          >
            Engineering that
            <br />
            ships, not slides.
          </h2>

          {/* Lede */}
          <p
            className="mt-8 text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed"
            style={{ fontFamily: "var(--ts-sans)" }}
          >
            Intrastack partners with operators who need cloud, data, and AI
            done properly — not pitched. Senior engineers from day one,
            measurable outcomes, no theatrics.
          </p>

          <Separator className="my-10" />

          {/* Scale */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <SectionLabel>Heading scale</SectionLabel>
              <div
                className="mt-6 space-y-4 text-foreground"
                style={{ fontFamily: "var(--ts-heading)" }}
              >
                <p className="text-5xl font-bold tracking-tight leading-tight">
                  H1 — The headline
                </p>
                <p className="text-4xl font-bold tracking-tight leading-tight">
                  H2 — Section title
                </p>
                <p className="text-2xl font-semibold tracking-tight">
                  H3 — Sub-section
                </p>
                <p className="text-xl font-semibold">H4 — Card title</p>
                <p className="text-base font-semibold uppercase tracking-widest">
                  H5 · Eyebrow label
                </p>
              </div>
            </div>

            <div>
              <SectionLabel>Body scale</SectionLabel>
              <div
                className="mt-6 space-y-5 text-foreground"
                style={{ fontFamily: "var(--ts-sans)" }}
              >
                <p className="text-lg leading-relaxed">
                  Large body — used for ledes and feature descriptions where
                  scanning matters more than density.
                </p>
                <p className="text-base leading-relaxed text-muted-foreground">
                  Default body — for the bulk of paragraph copy. Comfortable
                  measure, generous line-height, neutral colour.
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Small body — captions, helper text, secondary metadata. Still
                  legible, but visually quieter.
                </p>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Micro · tags & labels
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-10" />

          {/* Specimen paragraph */}
          <div>
            <SectionLabel>Long-form sample</SectionLabel>
            <div
              className="mt-6 max-w-3xl space-y-4 text-foreground"
              style={{ fontFamily: "var(--ts-sans)" }}
            >
              <p className="text-base leading-relaxed">
                We deliver cloud and AI engagements end-to-end — discovery,
                architecture, build, and the unglamorous handover that decides
                whether anything actually sticks. The model is simple: small
                teams of senior engineers, paired with your people, with the
                outcome written down before we start.
              </p>
              <p className="text-base leading-relaxed">
                Our typography choices reflect that posture. Headings carry
                conviction without theatre. Body type stays out of the way so
                the substance reads first. Monospace is reserved for things
                that genuinely need it —{" "}
                <code
                  className="rounded bg-muted px-1.5 py-0.5 text-sm"
                  style={{ fontFamily: "var(--ts-mono)" }}
                >
                  config values
                </code>
                , identifiers, and shell snippets.
              </p>
            </div>
          </div>

          <Separator className="my-10" />

          {/* Mono / code */}
          <div>
            <SectionLabel>Mono / code</SectionLabel>
            <pre
              className="mt-6 overflow-x-auto rounded-xl border border-base-300 bg-muted/40 p-5 text-sm leading-relaxed text-foreground"
              style={{ fontFamily: "var(--ts-mono)" }}
            >
              {`// terraform/main.tf
module "platform" {
  source        = "intrastack/platform/aws"
  version       = "1.4.2"
  environment   = "production"
  ha_enabled    = true
  observability = { logs = true, traces = true }
}`}
            </pre>

            <p
              className="mt-4 text-sm text-muted-foreground"
              style={{ fontFamily: "var(--ts-mono)" }}
            >
              $ intrastack deploy --env=prod --watch
            </p>
          </div>

          <Separator className="my-10" />

          {/* Numerals */}
          <div>
            <SectionLabel>Numerals</SectionLabel>
            <div
              className="mt-6 flex flex-wrap gap-x-10 gap-y-4 text-foreground"
              style={{ fontFamily: "var(--ts-heading)" }}
            >
              <Stat value="2014" label="Founded" />
              <Stat value="120+" label="Engagements" />
              <Stat value="38%" label="Avg. cost reduction" />
              <Stat value="24/7" label="Production support" />
            </div>
          </div>

          <Separator className="my-10" />

          {/* Pangram / case */}
          <div>
            <SectionLabel>Glyphs</SectionLabel>
            <div className="mt-6 space-y-4">
              <p
                className="text-2xl text-foreground"
                style={{ fontFamily: "var(--ts-heading)" }}
              >
                The quick brown fox jumps over the lazy dog.
              </p>
              <p
                className="text-2xl text-foreground"
                style={{ fontFamily: "var(--ts-sans)" }}
              >
                THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG.
              </p>
              <p
                className="text-2xl text-foreground"
                style={{ fontFamily: "var(--ts-mono)" }}
              >
                0123456789 — &amp; @ # % * → ←
              </p>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}

function StackCard({
  role,
  family,
  fontFamily,
}: {
  role: string;
  family: string;
  fontFamily: string;
}) {
  return (
    <Card className="p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {role}
      </p>
      <p
        className="mt-2 text-2xl font-semibold text-foreground"
        style={{ fontFamily }}
      >
        {family}
      </p>
      <p
        className="mt-2 text-sm text-muted-foreground"
        style={{ fontFamily }}
      >
        Aa Bb Cc 0123 — the quick brown fox
      </p>
    </Card>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
      {children}
    </p>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p
        className="text-4xl md:text-5xl font-bold tracking-tight text-foreground"
        style={{ fontFamily: "var(--ts-heading)" }}
      >
        {value}
      </p>
      <p
        className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        style={{ fontFamily: "var(--ts-sans)" }}
      >
        {label}
      </p>
    </div>
  );
}
