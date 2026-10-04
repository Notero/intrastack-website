"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Smartphone, Headset, Server, Users, CloudCog, LayoutGrid } from "lucide-react";
import Reveal from "@/components/public/reveal";
import Shape from "@/components/public/shape";

type Service = {
  num: string;
  title: string;
  body: string;
  href: string;
  tags: string[];
  image: string;
  imageAlt: string;
};

const SERVICES: Service[] = [
  {
    num: "01",
    title: "Cloud Engineering",
    body: "Landing zone architecture, workload migration, and platform modernization across AWS, Azure, and GCP — built to scale with your business and governed from day one.",
    href: "/services/cloud_transformation",
    tags: ["AWS · Azure · GCP", "Landing zones", "FinOps"],
    image: "/images/unsplash/photo-1544197150-b99a580bb7a8-1600.webp",
    imageAlt: "Cloud infrastructure engineering",
  },
  {
    num: "02",
    title: "DevOps & Platform Engineering",
    body: "CI/CD pipelines, infrastructure-as-code, and Kubernetes orchestration — quality gates, policy-as-code, and automated security scanning embedded at every delivery stage.",
    href: "/services/devops_automation",
    tags: ["GitOps", "Terraform", "Kubernetes"],
    image: "/images/unsplash/photo-1555066931-4365d14bab8c-1600.webp",
    imageAlt: "DevOps and platform engineering",
  },
  {
    num: "03",
    title: "AI / ML Consulting",
    body: "Enterprise AI from strategy through production — use-case shaping, ML pipeline engineering, LLM integration, and model operationalization against real workflow KPIs.",
    href: "/services/ai_engineering",
    tags: ["LLMOps", "MLOps", "GenAI"],
    image: "/images/unsplash/photo-1677442136019-21780ecad995-1600.webp",
    imageAlt: "AI and machine learning consulting",
  },
  {
    num: "04",
    title: "Cybersecurity & Risk",
    body: "Zero-trust architecture aligned to NIST, SOC 2, HIPAA, and FedRAMP — treated as an engineering discipline, with compliance evidence built into the pipeline continuously.",
    href: "/services/cybersecurity",
    tags: ["Zero Trust", "FedRAMP", "SIEM"],
    image: "/images/unsplash/photo-1550751827-4bd374c3f58b-1600.webp",
    imageAlt: "Cybersecurity and risk management",
  },
  {
    num: "05",
    title: "Data Engineering",
    body: "Enterprise data platforms from ingestion pipelines through semantic layer and governed self-service analytics — AI-ready by design, production-grade from the first release.",
    href: "/solutions/data_analytics",
    tags: ["Snowflake", "Databricks", "dbt"],
    image: "/images/unsplash/photo-1551288049-bebda4e38f71-1600.webp",
    imageAlt: "Data engineering and analytics",
  },
];

const CTA_CARD = {
  num: "06",
  title: "Discover all services",
  body: "The full catalog runs deeper — mobile app development, IT consulting, hardware and software procurement, staff augmentation, and end-to-end cloud migration. Same senior engineers on every engagement.",
  href: "/services",
};

const STEPS = [...SERVICES.map((s) => ({ n: s.num, label: s.title })), { n: CTA_CARD.num, label: "All services" }];

const DECK_SIZE = SERVICES.length + 1; // services + the closing CTA card
const N = DECK_SIZE;

// How much scroll (in viewport heights) is spent transitioning through the
// whole deck while the stage stays pinned on screen.
const SCROLL_VH_PER_CARD = 40;
const STAGE_VH = 90;

// Visual cascade for cards that are not the active one.
const PEEK_STEP_PX = 22;
const MAX_PEEK_LAYERS = 4;
const MIN_SCALE = 0.94;
const MIN_OPACITY = 0.35;

function CardBody({ title, body, tags, href, linkLabel, light }: { title: string; body: string; tags: string[]; href: string; linkLabel: string; light?: boolean }) {
  return (
    <div className="p-7 md:p-8 flex-1 flex flex-col justify-center min-h-0">
      <h3 className={`font-heading text-[21px] font-semibold leading-snug mb-2 ${light ? "text-white" : ""}`} style={light ? undefined : { color: "#F4EFE9" }}>
        {title}
      </h3>
      <p
        className="text-[13.5px] leading-relaxed mb-3.5 line-clamp-2"
        style={{ color: light ? "rgba(255,255,255,0.9)" : "#9A8E81" }}
      >
        {body}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((t) => (
          <span
            key={t}
            className={`text-[12.5px] font-semibold px-3 py-1.5 rounded-full ${light ? "bg-white/15 text-white" : ""}`}
            style={light ? undefined : { color: "#F26A2C", backgroundColor: "rgba(242,106,44,0.14)" }}
          >
            {t}
          </span>
        ))}
      </div>
      <Link
        href={href}
        className={`inline-flex items-center gap-2 text-[14px] font-bold hover:gap-3 transition-all font-heading ${light ? "text-white" : ""}`}
        style={light ? undefined : { color: "#F26A2C" }}
      >
        {linkLabel} <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}

export default function Services() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const stepBarRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      const wrapper = wrapperRef.current;
      if (wrapper) {
        const rect = wrapper.getBoundingClientRect();
        const scrollableRange = rect.height - window.innerHeight * (STAGE_VH / 100);
        const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(scrollableRange, 1));
        const progress = scrolled / Math.max(scrollableRange, 1);
        const p = progress * (N - 1);
        const active = Math.max(0, Math.min(N - 1, Math.round(p)));

        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          const d = i - p; // 0 = active/front, <0 = already passed, >0 = still queued
          const absD = Math.min(Math.abs(d), MAX_PEEK_LAYERS);

          const translateY = Math.max(-MAX_PEEK_LAYERS, Math.min(MAX_PEEK_LAYERS, d)) * PEEK_STEP_PX;
          const scale = 1 - (absD / MAX_PEEK_LAYERS) * (1 - MIN_SCALE);
          const opacity = 1 - (absD / MAX_PEEK_LAYERS) * (1 - MIN_OPACITY);
          const zIndex = Math.round(100 - absD * 10);

          card.style.transform = `translateY(${translateY}px) scale(${scale})`;
          card.style.opacity = String(opacity);
          card.style.zIndex = String(zIndex);
          card.style.pointerEvents = Math.abs(d) < 0.5 ? "auto" : "none";
        });

        if (counterRef.current) counterRef.current.textContent = String(active + 1).padStart(2, "0");
        if (barRef.current) barRef.current.style.width = `${(progress * 100).toFixed(1)}%`;

        stepRefs.current.forEach((el, i) => {
          if (!el) return;
          const on = i === active;
          el.style.color = on ? "#221C16" : "#9B8E7F";
          el.style.fontWeight = on ? "600" : "500";
          const bar = stepBarRefs.current[i];
          if (bar) {
            bar.style.width = on ? "26px" : "12px";
            bar.style.backgroundColor = on ? "#F26A2C" : "currentColor";
          }
        });
      }
      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  const jumpTo = (i: number) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const scrollableRange = wrapper.getBoundingClientRect().height - window.innerHeight * (STAGE_VH / 100);
    const top = wrapper.offsetTop + (i / (N - 1)) * Math.max(scrollableRange, 1);
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section className="relative w-full bg-paper-4 py-16 md:py-20 px-6" id="services">
      <Shape kind="circle" size={110} position="top-20 right-12" color="var(--color-brand-600)" outline opacity={0.18} />
      <Shape kind="square" size={70} position="bottom-24 left-10" color="#0F1622" opacity={0.07} rotate={20} />
      <Shape kind="triangle" size={60} position="top-1/2 left-1/4" color="var(--color-brand-600)" opacity={0.12} rotate={-18} />
      <div className="relative mx-auto max-w-7xl flex flex-col lg:flex-row gap-10 lg:gap-14">

        {/* Left rail */}
        <div className="lg:w-[350px] flex-none lg:sticky lg:top-28 lg:self-start">
          <Reveal direction="left">
            <h2 className="font-heading text-4xl font-bold leading-tight text-foreground mb-4">
              A closer look at the <span className="text-orange-500">work</span> itself
            </h2>
            <p className="text-[15.5px] leading-relaxed text-foreground/60 max-w-[280px] mb-6">
              The disciplines we&apos;re asked for most — scoped before the first sprint and delivered by the same senior engineers, end to end.
            </p>
          </Reveal>

          <div className="flex items-baseline gap-2 font-mono">
            <span ref={counterRef} className="text-4xl font-semibold text-orange-500 leading-none">01</span>
            <span className="text-sm text-foreground/40">/ {String(N).padStart(2, "0")}</span>
          </div>
          <div className="h-0.5 rounded-full bg-foreground/10 mt-3.5 overflow-hidden">
            <div ref={barRef} className="h-full rounded-full bg-orange-500" style={{ width: "0%" }} />
          </div>

          <div className="hidden lg:flex flex-col mt-6">
            {STEPS.map((step, i) => (
              <button
                key={step.n}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                onClick={() => jumpTo(i)}
                className="flex items-center gap-3.5 bg-transparent border-0 py-2 text-left cursor-pointer text-[#9B8E7F] transition-colors"
              >
                <span
                  ref={(el) => {
                    stepBarRefs.current[i] = el;
                  }}
                  className="w-3 h-0.5 flex-none rounded-full bg-current transition-[width]"
                />
                <span className="font-mono text-[11px] opacity-75 w-5 flex-none">{step.n}</span>
                <span className="font-heading text-[14.5px]">{step.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Deck */}
        <div ref={wrapperRef} className="flex-1 min-w-0" style={{ height: `${SCROLL_VH_PER_CARD * (N - 1) + STAGE_VH}vh` }}>
          <div
            className="sticky top-0 flex items-center overflow-visible"
            style={{ height: `${STAGE_VH}vh` }}
          >
            <div className="relative w-full" style={{ height: 440 }}>
              {SERVICES.map((s, i) => (
                <div
                  key={s.num}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="absolute inset-0"
                  style={{ transformOrigin: "center", willChange: "transform, opacity" }}
                >
                  <div
                    className="h-full rounded-[20px] overflow-hidden flex flex-col"
                    style={{ backgroundColor: "#1F1813", boxShadow: "0 26px 56px -30px rgba(20,10,0,0.55)" }}
                  >
                    <div className="relative h-[190px] flex-none" style={{ backgroundColor: "#15100C" }}>
                      <Image
                        src={s.image}
                        alt={s.imageAlt}
                        fill
                        sizes="(min-width: 1024px) 40vw, 90vw"
                        loading="lazy"
                        className="object-cover"
                      />
                      <div
                        className="absolute inset-0"
                        style={{ background: "linear-gradient(180deg, rgba(15,9,5,0) 46%, rgba(15,9,5,0.5))" }}
                      />
                      <span className="absolute top-4 left-4 font-mono text-xs font-medium text-[#F4EFE9] bg-black/35 px-2.5 py-1 rounded-full backdrop-blur-sm tracking-wide">
                        {s.num}
                      </span>
                    </div>
                    <CardBody
                      title={s.title}
                      body={s.body}
                      tags={s.tags}
                      href={s.href}
                      linkLabel={`Explore ${s.title}`}
                    />
                  </div>
                </div>
              ))}

              {/* Closing CTA — last card in the same deck */}
              <div
                ref={(el) => {
                  cardRefs.current[SERVICES.length] = el;
                }}
                className="absolute inset-0"
                style={{ transformOrigin: "center", willChange: "transform, opacity" }}
              >
                <Link
                  href={CTA_CARD.href}
                  className="group block h-full rounded-[20px] overflow-hidden bg-brand-500 hover:bg-brand-600 transition-colors flex flex-col"
                  style={{ boxShadow: "0 26px 56px -30px rgba(120,40,0,0.5)" }}
                >
                  <div className="relative h-[190px] flex-none bg-black/10 px-6 flex items-center">
                    <span className="absolute top-4 left-4 font-mono text-xs font-medium text-white/85 tracking-wide">
                      {CTA_CARD.num}
                    </span>
                    <div className="w-full grid grid-cols-3 grid-rows-2 gap-2.5" style={{ height: 140 }}>
                      {[Smartphone, Headset, Server, Users, CloudCog, LayoutGrid].map((Icon, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-center rounded-xl bg-white/10 transition-colors group-hover:bg-white/15"
                        >
                          <Icon className="size-6 text-white/85" strokeWidth={1.6} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-7 md:p-8 flex-1 flex flex-col justify-center min-h-0">
                    <h3 className="font-heading text-[21px] font-semibold leading-snug mb-2 text-white">
                      {CTA_CARD.title}
                    </h3>
                    <p className="text-[13.5px] leading-relaxed mb-4 text-white/90 line-clamp-2">
                      {CTA_CARD.body}
                    </p>
                    <span className="inline-flex items-center gap-2 text-[14px] font-bold text-white group-hover:gap-3 transition-all font-heading">
                      See all services <ArrowRight className="size-4" />
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
