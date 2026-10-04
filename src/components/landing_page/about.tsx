import Image from "next/image";
import { Phone } from "lucide-react";
import Reveal, { RevealGroup } from "@/components/public/reveal";
import Shape from "@/components/public/shape";

const PILLARS = [
  {
    title: "Cost Optimization",
    body: "Consulting partners help clients optimize their cloud spend by identifying cost-saving opportunities across compute, storage, and networking.",
  },
  {
    title: "Customized Solutions",
    body: "Consulting partners work closely with clients to understand their specific needs and challenges, tailoring cloud solutions to fit.",
  },
  {
    title: "Security Expertise",
    body: "Specialized knowledge and tools to enhance cloud security and ensure compliance across regulated industries.",
  },
  {
    title: "Global Delivery",
    body: "A team of 150 engineers and consultants operating 24/7 across delivery centers in the United States, Vietnam, Japan, and India — handoffs that don't drop quality.",
  },
];

export default function About() {
  return (
    <section className="relative w-full bg-paper-3 py-28 md:py-32 px-6 overflow-hidden" id="about">
      <Shape kind="circle" size={140} position="top-16 right-12" color="var(--color-brand-600)" outline strokeWidth={2} opacity={0.18} />
      <Shape kind="triangle" size={90} position="top-1/3 left-8" color="#0F1622" opacity={0.08} rotate={-12} />
      <Shape kind="square" size={70} position="bottom-15 right-1/4" color="var(--color-brand-600)" outline rotate={18} opacity={0.25} />
      <Shape kind="circle" size={90} position="bottom-12 left-40" color="var(--color-brand-600)" opacity={0.12} />
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-20 items-end">
          <Reveal direction="left">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F1622] leading-tight">
              Where strategy meets
              <br />
              engineering <span className="italic font-serif text-orange-500">execution.</span>
            </h2>
          </Reveal>
          <Reveal direction="right" delay={150}>
            <div className="">
              <p className="text text-ink-700 leading-relaxed">
                <span className="font-semibold text-foreground">
                  IntraStack Solutions is an Orlando-based enterprise consulting and engineering firm
                </span>{" "}
                purpose-built for organizations navigating the convergence of cloud modernization,
                AI adoption, and escalating cybersecurity complexity — delivered within a single,
                accountable model.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-10 items-stretch">
          <Reveal direction="left" className="h-full">
            <div className="relative h-full min-h-[480px] w-full rounded-2xl overflow-hidden bg-white border border-[#E2E6EE] shadow-xl">
              <Image
                src="/images/legacy/intrastack-slide-12-1024x1024.webp"
                alt="Intrastack team"
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                loading="lazy"
                className="object-cover"
              />
              <div className="absolute bottom-5 left-5 rounded-xl bg-white/90 backdrop-blur-md border border-[#E2E6EE] px-5 py-3 shadow-sm">
                <div className="text-sm font-bold text-[#0F1622]">Enterprise Consulting & Engineering</div>
                <div className="text-xs text-[#5C6473] mt-0.5">Orlando, Florida</div>
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col h-full">
            <Reveal direction="right">
              <h3 className="text-2xl md:text-3xl font-bold text-[#0F1622] leading-snug">
                Advisory depth.{" "}
                <span className="italic font-serif text-orange-500">Engineering</span> accountability.
              </h3>
            </Reveal>
            <Reveal direction="right" delay={150}>
              <p className="mt-5 text-[#5C6473] leading-relaxed">
                We combine the advisory depth of a management consulting practice with the
                hands-on engineering capability of a systems integrator — reducing the friction
                between strategy and execution that consistently derails enterprise modernization
                programs at scale.
              </p>
            </Reveal>

            <RevealGroup
              stagger={120}
              initialDelay={250}
              direction="up"
              className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
              itemClassName="h-full"
            >
              {PILLARS.map((p) => (
                <div
                  key={p.title}
                  className="h-full flex flex-col rounded-xl border border-[#E2E6EE] bg-white p-5 hover:border-primary hover:shadow-md transition-all shadow-xl"
                >
                  <h4 className="text-base font-bold text-[#0F1622]">{p.title}</h4>
                  <p className="mt-2 text-sm text-[#5C6473] leading-relaxed flex-1">{p.body}</p>
                </div>
              ))}
            </RevealGroup>

              <div className="mt-6 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-5 shadow-xl" style={{ backgroundColor: "var(--dark-warm)" }}>
                <div className="flex items-center gap-4">
                  <div className="grid place-items-center size-12 rounded-full" style={{ backgroundColor: "rgba(242,106,44,0.14)" }}>
                    <Phone className="size-5" style={{ color: "#F26A2C" }} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#9A8E81" }}>
                      Call us now
                    </div>
                    <a
                      href="tel:8889597868"
                      className="text-2xl font-bold tracking-tight hover:underline"
                      style={{ color: "#F4EFE9" }}
                    >
                      888 · 959 · 7868
                    </a>
                  </div>
                </div>
                <div className="text-xs sm:text-right" style={{ color: "#9A8E81" }}>
                  Mon–Fri · 09:00–18:00 PT
                </div>
              </div>

          </div>
        </div>
      </div>
    </section>
  );
}
