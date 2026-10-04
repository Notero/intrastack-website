import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/public/reveal";
import { Button } from "@/components/ui/button";
import Shape from "@/components/public/shape";

type Item = {
  quote: string;
  name: string;
  title: string;
  initials: string;
  accent: string;
};

// TODO: testimonials below are PLACEHOLDER content — names, companies, and
// quotes are not real. Replace with verified client testimonials before launch.
const ITEMS: Item[] = [
  {
    quote:
      "IntraStack migrated our entire infrastructure to AWS in under 3 weeks with zero downtime. Their team is exceptional — responsive, skilled, and genuinely invested in our success.",
    name: "James Martinez",
    title: "CTO, TechForward Solutions",
    initials: "JM",
    accent: "var(--color-brand-600)",
  },
  {
    quote:
      "The AI support bot IntraStack built for us handles 68% of all incoming tickets automatically. Our team can now focus on complex issues instead of repetitive queries.",
    name: "Sarah Rodriguez",
    title: "Head of Operations, NovaBridge",
    initials: "SR",
    accent: "var(--color-brand-600)",
  },
  {
    quote:
      "We went from a slow legacy system to a fully modern, secure cloud platform in two months. IntraStack delivered everything on time and on budget — a rare achievement.",
    name: "David Kim",
    title: "CEO, PrimeScale Ventures",
    initials: "DK",
    accent: "#1D4ED8",
  },
];

export default function Testimonial() {
  return (
    <section
      className="relative w-full overflow-hidden py-28 md:py-32 px-6"
      style={{ backgroundColor: "var(--dark-warm)" }}
      id="testimonial"
    >
      <Shape kind="triangle" size={100} position="top-24 left-12" color="#F26A2C" outline opacity={0.08} rotate={15} />
      <Shape kind="circle" size={70} position="bottom-32 right-16" color="#F26A2C" opacity={0.05} />
      <Shape kind="square" size={50} position="top-1/2 left-1/4" color="#F26A2C" outline opacity={0.06} rotate={20} />
      {/* Abstract background shapes — kept inset from the top/bottom edges so the section seams stay flat */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-20 bottom-20 overflow-hidden">
        <svg
          className="absolute top-4 right-[12%] size-56 text-white/[0.035]"
          viewBox="0 0 200 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <circle cx="100" cy="100" r="100" />
          <circle cx="100" cy="100" r="75" />
          <circle cx="100" cy="100" r="45" />
          <circle cx="100" cy="100" r="15"/>
        </svg>
        <svg
          className="absolute bottom-4 left-[8%] size-52 text-white/[0.03] rotate-12"
          viewBox="0 0 200 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <polygon points="100,20 180,170 20,170" />
          <polygon points="100,60 150,150 50,150" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-6xl">
        <Reveal direction="up">
          <h2 className="text-center text-3xl md:text-4xl font-bold" style={{ color: "#F4EFE9" }}>
            Testimonials
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {ITEMS.map((item, i) => (
            <Reveal key={item.name} direction="up" delay={150 + i * 100}>
              <figure
                className="h-full flex flex-col rounded-2xl p-8"
                style={{ backgroundColor: "rgba(242,106,44,0.06)", border: "1px solid rgba(242,106,44,0.15)" }}
              >
                <blockquote className="flex-1 text-base leading-relaxed" style={{ color: "#F4EFE9" }}>
                  <span
                    aria-hidden="true"
                    className="font-serif leading-none mr-1 align-top"
                    style={{ color: "#F26A2C" }}
                  >
                    &ldquo;
                  </span>
                  {item.quote}
                  <span
                    aria-hidden="true"
                    className="font-serif leading-none ml-1 align-bottom"
                    style={{ color: "#F26A2C" }}
                  >
                    &rdquo;
                  </span>
                </blockquote>

                <figcaption className="mt-8 flex items-center gap-4">
                  <div
                    aria-hidden="true"
                    className="size-12 shrink-0 rounded-full flex items-center justify-center text-sm font-semibold"
                    style={{ backgroundColor: "rgba(242,106,44,0.14)", color: "#F26A2C", border: "1px solid rgba(242,106,44,0.3)" }}
                  >
                    {item.initials}
                  </div>
                  <div>
                    <div className="text-sm font-bold" style={{ color: "#F4EFE9" }}>{item.name}</div>
                    <div className="text-xs" style={{ color: "#9A8E81" }}>{item.title}</div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal direction="up" delay={500}>
          <div className="relative mt-14 flex justify-center">
            <Button
              asChild
              size="lg"
              className="bg-brand-500 hover:bg-brand-500 text-white shadow-sm"
            >
              <Link href="/news/client_stories">
                Read all client stories
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
