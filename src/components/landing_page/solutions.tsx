"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  ShieldCheck,
  LifeBuoy,
  Sparkles,
  ShieldAlert,
  Boxes,
  GitBranch,
  Layers,
  type LucideIcon,
} from "lucide-react";
import Reveal from "@/components/public/reveal";
import Shape from "@/components/public/shape";

const ACCENT = "#FF6200";
const CYCLE_MS = 3400;

type Item = {
  slug: string;
  name: string;
  kicker: string;
  eyebrow: string;
  desc: string;
  icon: LucideIcon;
  stats: { value: string; label: string }[];
};

const ITEMS: Item[] = [
  {
    slug: "data_analytics",
    name: "Data Analytics",
    kicker: "Snowflake · BigQuery · dbt",
    eyebrow: "Insight",
    desc: "Unify sources, model the business, and put trusted numbers in front of the people who make decisions — without a six-month warehouse rebuild.",
    icon: BarChart3,
    stats: [
      { value: "6-8wk", label: "To first metric" },
      { value: "6", label: "Capabilities" },
      { value: "9", label: "Tools in stack" },
    ],
  },
  {
    slug: "security_compliance",
    name: "Security & Compliance",
    kicker: "FedRAMP · SOC 2 · HIPAA",
    eyebrow: "Assurance",
    desc: "Controls aligned to FedRAMP, PCI DSS, SOC, HIPAA, GDPR, and PII protection — implemented as code, evidenced continuously.",
    icon: ShieldCheck,
    stats: [
      { value: "100%", label: "Evidence as code" },
      { value: "5+", label: "Frameworks" },
      { value: "24/7", label: "Optional on-call" },
    ],
  },
  {
    slug: "business_continuity",
    name: "Business Continuity",
    kicker: "DR · Failover · RTO/RPO",
    eyebrow: "Resilience",
    desc: "Disaster recovery and failover engineered into the platform — rehearsed before an incident forces the question.",
    icon: LifeBuoy,
    stats: [
      { value: "<1hr", label: "Target RTO" },
      { value: "Tested", label: "Failover drills" },
      { value: "24/7", label: "Optional on-call" },
    ],
  },
  {
    slug: "ai_automation",
    name: "AI Automation",
    kicker: "LLMOps · MLOps · GenAI",
    eyebrow: "Automation",
    desc: "Embed AI into the workflows that matter — augmenting your team and compounding productivity across the business.",
    icon: Sparkles,
    stats: [
      { value: "6wk", label: "Pilot to prod" },
      { value: "KPI-tied", label: "Evaluation" },
      { value: "Ongoing", label: "Retraining" },
    ],
  },
  {
    slug: "enterprise_security",
    name: "Enterprise Security",
    kicker: "Zero Trust · Identity · SIEM",
    eyebrow: "Defense",
    desc: "Defense-in-depth across identity, workloads, and data. Engineered for compliance, built to scale.",
    icon: ShieldAlert,
    stats: [
      { value: "Zero Trust", label: "Architecture" },
      { value: "24/7", label: "Monitoring" },
      { value: "Day 1", label: "Best practices" },
    ],
  },
  {
    slug: "kubernetes",
    name: "Kubernetes",
    kicker: "EKS · AKS · GKE",
    eyebrow: "Platform",
    desc: "Production-grade clusters with policy-as-code, autoscaling, and observability baked in from the first deploy.",
    icon: Boxes,
    stats: [
      { value: "Multi-cloud", label: "EKS/AKS/GKE" },
      { value: "Policy", label: "as code" },
      { value: "Day 1", label: "Observability" },
    ],
  },
  {
    slug: "cicd_transformation",
    name: "CI/CD Transformation",
    kicker: "GitOps · Pipelines · Gates",
    eyebrow: "Velocity",
    desc: "From the commit to the user, in minutes — pipelines, gates, and rollback rehearsed before they're needed.",
    icon: GitBranch,
    stats: [
      { value: "Minutes", label: "Commit to deploy" },
      { value: "Rehearsed", label: "Rollback" },
      { value: "Gated", label: "Every stage" },
    ],
  },
  {
    slug: "hybrid_cloud",
    name: "Hybrid Cloud",
    kicker: "On-prem + Cloud",
    eyebrow: "Estate",
    desc: "On-prem and cloud as one estate — workloads land where they belong, not where the org chart shoves them.",
    icon: Layers,
    stats: [
      { value: "1", label: "Unified estate" },
      { value: "Same", label: "Controls everywhere" },
      { value: "No", label: "Lock-in" },
    ],
  },
];

const LEFT = [0, 1, 2, 3];
const RIGHT = [4, 5, 6, 7];

type Geo = { i: number; side: "left" | "right"; x1: number; y1: number; x2: number; y2: number };

function SideCard({
  item,
  active,
  side,
  onEnter,
  onLeave,
  setRef,
}: {
  item: Item;
  active: boolean;
  side: "left" | "right";
  onEnter: () => void;
  onLeave: () => void;
  setRef: (el: HTMLButtonElement | null) => void;
}) {
  const Icon = item.icon;
  const iconBlock = (
    <span
      className={`grid shrink-0 place-items-center rounded-2xl transition-all duration-300 ${
        active ? "size-16" : "size-12"
      }`}
      style={{
        backgroundColor: active ? ACCENT : "rgba(20,20,20,0.05)",
        boxShadow: active ? `0 10px 20px -6px ${ACCENT}99` : "none",
      }}
    >
      <Icon className={active ? "size-7" : "size-6"} style={{ color: active ? "#fff" : "#8C867B" }} strokeWidth={1.7} />
    </span>
  );
  const textBlock = (
    <span
      className={`flex min-w-0 flex-1 flex-col gap-1 ${
        side === "left" ? "items-start text-left" : "items-end text-right"
      }`}
    >
      <span
        className="truncate text-lg font-semibold tracking-tight"
        style={{ color: active ? "#1B1A17" : "#4D4940" }}
      >
        {item.name}
      </span>
      <span className="truncate text-sm font-medium text-[#A39D92]">{item.kicker}</span>
    </span>
  );
  const mark = (
    <span
      className="size-2.5 shrink-0 rounded-full transition-all duration-300"
      style={{
        backgroundColor: active ? ACCENT : "#DAD6CE",
        boxShadow: active ? `0 0 0 4px ${ACCENT}26` : "none",
      }}
    />
  );

  return (
    <button
      ref={setRef}
      type="button"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onClick={onEnter}
      className="flex w-full flex-1 items-center gap-5 rounded-2xl px-6 py-7 text-left transition-all duration-300"
      style={{
        border: active ? `1px solid ${ACCENT}` : "1px solid #E6E3DD",
        backgroundColor: active ? "#FFFFFF" : "#FBFAF8",
        boxShadow: active
          ? `0 18px 36px -16px ${ACCENT}80, 0 0 0 3px ${ACCENT}1F`
          : "0 1px 0 rgba(40,33,22,0.02)",
        transform: active ? "translateY(-1px)" : "none",
      }}
    >
      {side === "left" ? (
        <>
          {iconBlock}
          {textBlock}
          {mark}
        </>
      ) : (
        <>
          {mark}
          {textBlock}
          {iconBlock}
        </>
      )}
    </button>
  );
}

export default function Solutions() {
  const [active, setActive] = useState(0);
  const [locked, setLocked] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const gridRef = useRef<HTMLDivElement | null>(null);
  const centerRef = useRef<HTMLAnchorElement | null>(null);
  const cardRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const [geo, setGeo] = useState<Geo[]>([]);
  const [gridSize, setGridSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive((prev) => {
        if (locked) return prev;
        return (prev + 1) % ITEMS.length;
      });
    }, CYCLE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [locked]);

  useEffect(() => {
    const measure = () => {
      const g = gridRef.current;
      const c = centerRef.current;
      if (!g || !c) return;
      const gr = g.getBoundingClientRect();
      const rel = (r: DOMRect) => ({
        left: r.left - gr.left,
        right: r.right - gr.left,
        midY: (r.top + r.bottom) / 2 - gr.top,
        cTop: r.top - gr.top,
        cBot: r.bottom - gr.top,
      });
      const C = rel(c.getBoundingClientRect());
      const nextGeo: Geo[] = [];
      for (let i = 0; i < ITEMS.length; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const r = rel(el.getBoundingClientRect());
        const side: "left" | "right" = i < 4 ? "left" : "right";
        const x1 = side === "left" ? r.right : r.left;
        const y1 = r.midY;
        const x2 = side === "left" ? C.left : C.right;
        const y2 = Math.max(C.cTop + 16, Math.min(C.cBot - 16, r.midY));
        nextGeo.push({ i, side, x1, y1, x2, y2 });
      }
      setGeo(nextGeo);
      setGridSize({ w: gr.width, h: gr.height });
    };

    measure();
    const raf = requestAnimationFrame(measure);
    const fontTimeout = setTimeout(measure, 600);

    const ro = new ResizeObserver(measure);
    if (gridRef.current) ro.observe(gridRef.current);
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fontTimeout);
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [active, locked]);

  const center = ITEMS[active];
  const CenterIcon = center.icon;

  return (
    <section className="relative w-full bg-paper-5 py-28 md:py-32 px-6 overflow-hidden" id="solutions">
      <Shape kind="triangle" size={140} position="top-16 left-12" color="var(--color-brand-600)" outline opacity={0.18} rotate={18} />
      <Shape kind="circle" size={90} position="bottom-24 right-20" color="#0F1622" opacity={0.08} />
      <Shape kind="square" size={60} position="top-1/2 right-1/4" color="var(--color-brand-600)" opacity={0.16} rotate={-22} />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-16">
          <Reveal direction="down">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F1622] leading-tight">
              Outcomes you can <span className="italic font-serif text-brand-500">ship.</span>
            </h2>
          </Reveal>
          <div className="mt-4 flex flex-col items-end justify-between gap-4 lg:flex-row">
            <Reveal direction="up" delay={120} className="flex-1">
              <p className="max-w-3xl text-lg text-[#5C6473] leading-relaxed">
                Ten focused solution areas — packaged engagements with clear deliverables, not
                open-ended consulting hours. Hover a card to see the detail.
              </p>
            </Reveal>
            <Reveal direction="left" delay={200} className="shrink-0">
              <span
                className="inline-flex items-center gap-2 whitespace-nowrap pb-1 text-xs font-medium"
                style={{ color: "#9A958B" }}
              >
                <span
                  className="size-1.5 rounded-full transition-colors"
                  style={{ backgroundColor: locked ? "#C7C2B8" : ACCENT }}
                />
                {locked ? "Locked · move away to resume" : "Auto-cycling · hover to lock"}
              </span>
            </Reveal>
          </div>
        </div>

        <div
          ref={gridRef}
          className="relative grid grid-cols-1 gap-6 lg:min-h-[620px] lg:grid-cols-[340px_minmax(380px,1fr)_340px] lg:items-stretch"
        >
          {/* Connector lines — drawn between each side card and the center panel */}
          <svg
            width={gridSize.w || 0}
            height={gridSize.h || 0}
            className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
            style={{ width: "100%", height: "100%", overflow: "visible" }}
          >
            {geo.map((g) => {
              const on = g.i === active;
              const dx = g.x2 - g.x1;
              const c1x = g.x1 + dx * 0.55;
              const c2x = g.x2 - dx * 0.55;
              const d = `M ${g.x1} ${g.y1} C ${c1x} ${g.y1} ${c2x} ${g.y2} ${g.x2} ${g.y2}`;
              return (
                <g key={g.i}>
                  <path
                    d={d}
                    fill="none"
                    stroke={on ? ACCENT : "#C8C2B7"}
                    strokeWidth={on ? 2.4 : 1.6}
                    strokeDasharray={on ? "none" : "4 7"}
                    strokeLinecap="round"
                    style={{ transition: "stroke .3s ease, stroke-width .3s ease" }}
                  />
                  <circle
                    cx={g.x2}
                    cy={g.y2}
                    r={on ? 4 : 3}
                    fill={on ? ACCENT : "#D6D1C8"}
                    style={{ transition: "all .3s ease" }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Left column */}
          <Reveal direction="left" className="relative z-10 h-full">
            <div className="flex h-full flex-col gap-5">
              {LEFT.map((i) => (
                <SideCard
                  key={ITEMS[i].slug}
                  item={ITEMS[i]}
                  active={i === active}
                  side="left"
                  setRef={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  onEnter={() => {
                    setActive(i);
                    setLocked(true);
                  }}
                  onLeave={() => setLocked(false)}
                />
              ))}
            </div>
          </Reveal>

          {/* Center detail panel — intrinsic height, vertically centered
              within the (taller) row defined by the side columns */}
          <Reveal direction="up" delay={100} className="relative z-10 lg:self-center">
            <Link
              ref={centerRef}
              href={`/solutions/${center.slug}`}
              className="relative flex flex-col overflow-hidden rounded-[20px] border border-[#E9E6E0] bg-white p-8 md:p-9 lg:min-h-[420px]"
              style={{ boxShadow: "0 24px 60px -36px rgba(40,33,22,0.28)" }}
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-[#F0EEE9]">
                <div
                  key={active + (locked ? "-l" : "-r")}
                  className="h-full origin-left"
                  style={{
                    backgroundColor: ACCENT,
                    animation: `solutions-fillbar ${CYCLE_MS}ms linear forwards`,
                    animationPlayState: locked ? "paused" : "running",
                    transform: locked ? "scaleX(1)" : undefined,
                  }}
                />
              </div>

              <div className="mt-1.5 mb-7 flex items-center">
                <span
                  className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide"
                  style={{ backgroundColor: `${ACCENT}1A`, color: "#D85C18" }}
                >
                  {center.eyebrow}
                </span>
              </div>

              <div className="mb-6 flex items-center gap-4">
                <span
                  className="grid size-[72px] shrink-0 place-items-center rounded-2xl"
                  style={{ backgroundColor: `${ACCENT}1A` }}
                >
                  <CenterIcon className="size-8" style={{ color: ACCENT }} strokeWidth={1.6} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-2xl md:text-[27px] font-bold leading-tight tracking-tight text-[#1B1A17]">
                    {center.name}
                  </h3>
                  <p className="mt-1 text-[13.5px] font-medium text-[#A39D92]">{center.kicker}</p>
                </div>
              </div>

              <p className="mb-7 text-[15.5px] leading-relaxed text-[#6E685E]">{center.desc}</p>

              <div className="mb-6 h-px bg-[#EEEBE5]" />

              <div className="mt-auto grid grid-cols-3 gap-4">
                {center.stats.map((s) => (
                  <div key={s.label} className="flex flex-col gap-1">
                    <span className="text-2xl font-bold tracking-tight text-[#1B1A17]">{s.value}</span>
                    <span className="text-xs font-medium text-[#A39D92]">{s.label}</span>
                  </div>
                ))}
              </div>

              <span
                className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold transition-all"
                style={{ color: ACCENT }}
              >
                Explore solution <ArrowRight className="size-4" />
              </span>
            </Link>
          </Reveal>

          {/* Right column */}
          <Reveal direction="right" className="relative z-10 h-full">
            <div className="flex h-full flex-col gap-5">
              {RIGHT.map((i) => (
                <SideCard
                  key={ITEMS[i].slug}
                  item={ITEMS[i]}
                  active={i === active}
                  side="right"
                  setRef={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  onEnter={() => {
                    setActive(i);
                    setLocked(true);
                  }}
                  onLeave={() => setLocked(false)}
                />
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal direction="up" delay={300} className="mt-8">
          <Link
            href="/solutions"
            className="group flex items-center justify-between rounded-2xl bg-brand-500 px-6 py-5 hover:bg-brand-600 transition-colors shadow-xl"
          >
            <span className="text-base font-semibold text-white">See all 10 solutions</span>
            <ArrowRight className="size-5 text-white transition-all group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>

      <style>{`
        @keyframes solutions-fillbar {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
}
