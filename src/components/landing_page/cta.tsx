import Link from "next/link";
import { ArrowRight, Clock, MessageSquare, ShieldCheck } from "lucide-react";
import ReachUsForm from "@/components/public/reachUsForm";
import Reveal from "@/components/public/reveal";
import Shape from "@/components/public/shape";

const PROMISES = [
  { icon: Clock, label: "45-minute discovery call with a senior executive" },
  { icon: MessageSquare, label: "No pre-built pitch, no junior analyst brief" },
  { icon: ShieldCheck, label: "Direct exchange to assess mutual fit · NDA-friendly" },
];

export default function CTA() {
  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden bg-paper-3 py-28 md:py-36 px-6"
    >
      <Shape kind="square" size={90} position="top-20 right-16" color="var(--color-brand-600)" outline rotate={22} opacity={0.25} />
      <Shape kind="triangle" size={110} position="top-1/2 left-10" color="#0F1622" opacity={0.07} rotate={8} />
      <Shape kind="circle" size={60} position="bottom-24 right-1/3" color="var(--color-brand-600)" opacity={0.15} />
      <Shape kind="square" size={45} position="top-40 left-1/3" color="#0F1622" outline opacity={0.18} rotate={-10} />
      <Shape kind="triangle" size={70} position="bottom-16 left-24" color="var(--color-brand-600)" outline opacity={0.22} rotate={45} />
      {/* Ambient glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 size-[600px] rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 size-[600px] rounded-full bg-secondary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--paper-3)_75%)]"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 lg:gap-16 items-start">
          {/* Left — pitch */}
          <div>
            <Reveal direction="left" delay={120}>
              <h2 className="mt-6 text-5xl md:text-6xl font-bold text-foreground leading-[1.05] tracking-tight">
                Start the{" "}
                <span className="italic font-serif text-red-600">conversation.</span>
                <br />
                No pitch decks.
              </h2>
            </Reveal>

            <Reveal direction="left" delay={250}>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
                A focused conversation with a senior IntraStack executive about your current
                technology environment, strategic priorities, and modernization challenges —
                designed to assess mutual fit.
              </p>
            </Reveal>

            <ul className="mt-8 space-y-3">
              {PROMISES.map(({ icon: Icon, label }, i) => (
                <Reveal as="li" key={label} direction="right" delay={350 + i * 120}>
                  <div className="flex items-center gap-3 text-sm text-foreground">
                    <span className="grid place-items-center size-8 rounded-lg bg-brand-500/5 text-brand-500 shrink-0">
                      <Icon className="size-4" strokeWidth={2} />
                    </span>
                    {label}
                  </div>
                </Reveal>
              ))}
            </ul>

            <Reveal direction="up" delay={550}>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/news/whitepaper"
                  className="inline-flex items-center gap-2 rounded-lg border border-base-300 bg-base-100/50 backdrop-blur px-5 py-3 text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  Read whitepapers <ArrowRight className="size-4" />
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Right — form */}
          <Reveal direction="right" delay={200}>
            <ReachUsForm
              title="Request a discovery call"
              subtitle="45 minutes with a senior executive. Proposals are written by the engineers who will execute."
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
