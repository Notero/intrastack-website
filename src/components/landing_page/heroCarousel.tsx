"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Slide = {
  title: string;
  accent: string;
  description: string;
  cta: { label: string; href: string };
  image: string;
};

const SLIDES: Slide[] = [
  {
    title: "Enterprise Technology. Delivered with",
    accent: "Purpose.",
    description:
      "IntraStack partners with enterprise organizations to modernize infrastructure, operationalize AI, and secure the digital enterprise — with the accountability of a dedicated delivery partner.",
    cta: { label: "Why IntraStack", href: "/about" },
    image: "/images/unsplash/photo-1521737711867-e3b97375f902-1920.webp",
  },
  {
    title: "Cloud Modernization, Engineered for",
    accent: "Scale.",
    description:
      "Multi-cloud architecture, migration strategy, and platform engineering across AWS, Azure, and GCP — landing zone design through production operations.",
    cta: { label: "Explore", href: "/services/cloud_transformation" },
    image: "/images/unsplash/photo-1451187580459-43490279c0fa-1920.webp",
  },
  {
    title: "Delivery Velocity at Production",
    accent: "Scale.",
    description:
      "CI/CD pipeline acceleration, infrastructure-as-code, Kubernetes orchestration, and enterprise platform enablement — quality gates and policy-as-code embedded throughout.",
    cta: { label: "Explore", href: "/services/devops_automation" },
    image: "/images/unsplash/photo-1517694712202-14dd9538aa97-1920.webp",
  },
  {
    title: "AI Programs Built for",
    accent: "Production.",
    description:
      "Enterprise AI strategy, ML pipeline engineering, LLM integration, and model operationalization — production-ready from day one, not proof-of-concept-ready.",
    cta: { label: "Explore", href: "/solutions/ai_automation" },
    image: "/images/unsplash/photo-1620712943543-bcc4688e7485-1920.webp",
  },
  {
    title: "Cybersecurity as an Engineering",
    accent: "Discipline.",
    description:
      "Zero-trust architecture, threat detection, and compliance frameworks aligned to NIST, SOC 2, HIPAA, FedRAMP, and ISO 27001 — embedded into architecture, not appended.",
    cta: { label: "Explore", href: "/solutions/enterprise_security" },
    image: "/images/unsplash/photo-1563013544-824ae1b704d3-1920.webp",
  },
];

const AUTOPLAY_MS = 6000;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const goTo = (i: number) => setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  useEffect(() => {
    const onVis = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = () => setReducedMotion(mq.matches);
    onMq();
    mq.addEventListener("change", onMq);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      mq.removeEventListener("change", onMq);
    };
  }, []);

  useEffect(() => {
    if (paused || tabHidden || reducedMotion) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, tabHidden, reducedMotion]);

  const isNearby = (i: number) => {
    if (i === index) return true;
    const last = SLIDES.length - 1;
    const prevI = (index - 1 + SLIDES.length) % SLIDES.length;
    const nextI = (index + 1) % SLIDES.length;
    return i === prevI || i === nextI || (index === 0 && i === last) || (index === last && i === 0);
  };

  return (
    <section
      className="relative w-full h-[85vh] min-h-[560px] overflow-hidden text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div
        className="flex h-full w-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className="relative shrink-0 w-full h-full flex items-start overflow-hidden"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${SLIDES.length}`}
          >
            {isNearby(i) &&
              (i === 0 ? (
                <Image
                  src={slide.image}
                  alt=""
                  aria-hidden="true"
                  fill
                  priority
                  fetchPriority="high"
                  quality={65}
                  sizes="100vw"
                  className="absolute inset-0 size-full object-cover"
                />
              ) : (
                <Image
                  src={slide.image}
                  alt=""
                  aria-hidden="true"
                  fill
                  loading="lazy"
                  sizes="100vw"
                  className="absolute inset-0 size-full object-cover"
                />
              ))}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30" />
            <div key={`${i}-${index}`} className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 pt-[22vh] md:pt-[18vh]">
              <h1 className="anim-rise text-4xl md:text-6xl font-bold leading-tight max-w-3xl">
                {slide.title}{" "}
                <span className="italic font-serif text-brand-600">{slide.accent}</span>
              </h1>
              <p className="anim-rise anim-rise-delay-1 mt-6 max-w-2xl text-lg md:text-xl text-white/85">
                {slide.description}
              </p>
              <Link
                href={slide.cta.href}
                aria-label={`${slide.cta.label} — ${slide.title}`}
                className="anim-rise anim-rise-delay-2 mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-content hover:bg-primary/90 transition-colors hover:scale-[1.02]"
              >
                {slide.cta.label}
                <ChevronRight className="size-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 grid place-items-center size-11 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 grid place-items-center size-11 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
      >
        <ChevronRight className="size-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              "h-2 rounded-full transition-all",
              i === index ? "w-8 bg-primary" : "w-2 bg-white/50 hover:bg-white/80"
            )}
          />
        ))}
      </div>
    </section>
  );
}
