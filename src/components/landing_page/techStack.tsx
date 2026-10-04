"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Reveal from "@/components/public/reveal";
import Shape from "@/components/public/shape";

type Tech = { name: string; slug?: string; domain?: string; url?: string };

const TECH: Tech[] = [
  { name: "Azure", url: "/images/expertise/Azure.webp" },
  { name: "Cisco", url: "/images/expertise/cisco.webp" },
  { name: "Cloudify", url: "/images/expertise/cloudify.webp" },
  { name: "CloudCheckr", url: "/images/expertise/cloudchekr.webp" },
  { name: "ServiceNow", url: "/images/expertise/servicenow.webp" },
  { name: "Splunk", url: "/images/expertise/splunk.webp" },
  { name: "CyberArk", url: "/images/expertise/cyberark.webp" },
  { name: "CrowdStrike", url: "/images/expertise/crowdstrike.webp" },
  { name: "Citrix", url: "/images/expertise/citrix.webp" },
  { name: "VMware", url: "/images/expertise/vmware.webp" },
  { name: "HPE", url: "/images/expertise/hewlettpackardenterprise.webp" },
  { name: "Tanium", url: "/images/expertise/tanium.webp" },
  { name: "Fortinet", url: "/images/expertise/fortinet.webp" },
  { name: "Nutanix", url: "/images/expertise/nutanix.webp" },
  { name: "Pure Storage", url: "/images/expertise/purestorage.webp" },
  { name: "Google", url: "/images/expertise/google.webp" },
  { name: "Check Point", url: "/images/expertise/checkpoint.webp" },
  { name: "Microsoft", url: "/images/expertise/microsoft.webp" },
  { name: "Palo Alto", url: "/images/expertise/paloalto.webp" },
  { name: "Next.js", url: "/images/expertise/next.webp" },
];

const PER_SLIDE = 10;
const AUTOPLAY_MS = 6000;

function logoUrl(t: Tech): string | null {
  if (t.url) return t.url;
  if (t.slug) return `https://cdn.simpleicons.org/${t.slug}/ffffff`;
  // No Google favicon fallback — it sets a third-party cookie and 404s for several brands.
  // Brands without `slug` or `url` render as a styled text monogram below.
  return null;
}

function initials(name: string): string {
  return name
    .split(/[\s.&]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function TechStack() {
  const slides = chunk(TECH, PER_SLIDE);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = (i: number) => setIndex(((i % slides.length) + slides.length) % slides.length);
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, slides.length]);

  return (
    <section className="relative w-full bg-paper-2 py-28 md:py-32 px-6 overflow-hidden" id="tech">
      <Shape kind="circle" size={120} position="top-14 right-10" color="var(--color-brand-600)" outline opacity={0.22} />
      <Shape kind="square" size={75} position="bottom-20 left-16" color="#0F1622" opacity={0.08} rotate={18} />
      <Shape kind="triangle" size={55} position="top-1/3 left-1/3" color="var(--color-brand-600)" opacity={0.15} rotate={-25} />
      <Shape kind="circle" size={40} position="bottom-32 right-1/4" color="#0F1622" outline opacity={0.18} />
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-20 items-end">
          <Reveal direction="right">
            <div>
              <h2 className="mt-4 text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Our stack <span className="italic font-serif text-primary">expertise.</span>
              </h2>
            </div>
          </Reveal>
          <Reveal direction="left" delay={150}>
            <p className="text-muted-foreground leading-relaxed">
              Deep practitioners in the platforms enterprises actually run — cloud providers,
              container orchestration, security, observability, and the data infrastructure in
              between.
            </p>
          </Reveal>
        </div>

        <div
          className="relative px-0 lg:px-16"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          aria-roledescription="carousel"
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {slides.map((group, gi) => (
                <div
                  key={gi}
                  className="shrink-0 w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
                  aria-roledescription="slide"
                  aria-label={`${gi + 1} of ${slides.length}`}
                >
                  {group.map((t) => {
                    const url = logoUrl(t);
                    return (
                      <div
                        key={t.name}
                        title={t.name}
                        className="group aspect-[5/3] rounded-xl border border-base-300 bg-base-100 flex flex-col items-center justify-center gap-2 p-4 hover:border-primary hover:bg-card transition-colors"
                      >
                        {url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={url}
                            alt={`${t.name} logo`}
                            width={80}
                            height={32}
                            className="h-8 w-auto max-w-[80px] object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                            loading="lazy"
                          />
                        ) : (
                          <span
                            aria-hidden
                            className="grid place-items-center h-8 min-w-8 px-2 rounded-md bg-primary/15 text-primary text-sm font-bold tracking-wide"
                          >
                            {initials(t.name)}
                          </span>
                        )}
                        <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                          {t.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous slide"
                className="hidden lg:grid absolute left-0 top-1/2 -translate-y-1/2 place-items-center size-11 rounded-full bg-base-100 border border-base-300 text-foreground hover:bg-primary hover:text-primary-content transition-colors z-10"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next slide"
                className="hidden lg:grid absolute right-0 top-1/2 -translate-y-1/2 place-items-center size-11 rounded-full bg-base-100 border border-base-300 text-foreground hover:bg-primary hover:text-primary-content transition-colors z-10"
              >
                <ChevronRight className="size-5" />
              </button>

              <div className="mt-10 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous slide"
                  className="lg:hidden grid place-items-center size-9 rounded-full bg-base-100 border border-base-300 text-foreground hover:bg-primary hover:text-primary-content transition-colors"
                >
                  <ChevronLeft className="size-4" />
                </button>

                <div className="flex items-center gap-2">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={cn(
                        "h-2 rounded-full transition-all",
                        i === index ? "w-8 bg-primary" : "w-2 bg-base-300 hover:bg-base-300/70"
                      )}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={next}
                  aria-label="Next slide"
                  className="lg:hidden grid place-items-center size-9 rounded-full bg-base-100 border border-base-300 text-foreground hover:bg-primary hover:text-primary-content transition-colors"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
