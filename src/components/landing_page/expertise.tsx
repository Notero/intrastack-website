import Image from "next/image";
import Reveal, { RevealGroup } from "@/components/public/reveal";
import Shape from "@/components/public/shape";

const CLOUDS = [
  {
    name: "AWS",
    tier: "Premier Partner",
    logo: "/images/Amazon_Web_Services_2025.svg",
    width: 76, // ponytail: matches source SVG's 1920x1009 aspect ratio at h-10
  },
  {
    name: "Azure",
    tier: "Gold Partner",
    logo: "/images/expertise/Azure.webp",
    width: 124, // ponytail: matches source webp's 158x51 aspect ratio at h-10
  },
  {
    name: "GCP",
    tier: "Service Partner",
    logo: "https://cdn.simpleicons.org/googlecloud/4285F4",
    width: 40, // ponytail: simpleicons are square (24x24 viewBox)
  },
];

const LOCATIONS = [
  "Clermont, FL · USA",
  "Ho Chi Minh City · Vietnam",
  "Tokyo · Japan",
  "Bengaluru · India",
];

export default function Expertise() {
  return (
    <section
      className="relative w-full py-28 md:py-32 px-6 overflow-hidden"
      style={{ backgroundColor: "var(--dark-warm)" }}
      id="expertise"
    >
      <Shape kind="triangle" size={120} position="top-12 right-16" color="#F26A2C" outline opacity={0.22} rotate={-15} />
      <Shape kind="circle" size={80} position="bottom-20 left-12" color="#F4EFE9" opacity={0.06} />
      <Shape kind="square" size={55} position="top-1/3 left-1/4" color="#F26A2C" opacity={0.15} rotate={25} />
      <div className="relative mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 lg:items-end">
        <div>
          <Reveal direction="left">
            <h2
              className="mt-4 text-4xl md:text-5xl font-bold leading-tight text-pretty"
              style={{ color: "#F4EFE9" }}
            >
              Not the biggest firm in the room. The most{" "}
              <span className="italic font-serif" style={{ color: "#F26A2C" }}>accountable</span> one.
            </h2>
          </Reveal>
          <Reveal direction="up" delay={150}>
            <p className="mt-6 max-w-xl leading-relaxed" style={{ color: "#9A8E81" }}>
              IntraStack delivers Fortune 500-grade consulting expertise at the speed and
              accountability of a specialized firm — without the overhead, bait-and-switch, or
              junior-team substitution that defines large SI engagements.
            </p>
          </Reveal>

          <RevealGroup
            direction="scale"
            stagger={100}
            initialDelay={250}
            className="mt-8 grid grid-cols-3 gap-3"
          >
            {CLOUDS.map((c) => (
              <div
                key={c.name}
                className="rounded-xl bg-white p-5 text-center flex flex-col items-center justify-center gap-3"
                style={{ border: "1px solid #C2410C" }}
              >
                <div className="relative h-10 w-full flex items-center justify-center">
                  <Image
                    src={c.logo}
                    alt={`${c.name} logo`}
                    width={c.width}
                    height={40}
                    className="h-10 w-auto object-contain"
                    unoptimized
                  />
                </div>
                <div className="text-lg font-bold text-black">{c.name}</div>
                <div className="text-xs text-black/60">{c.tier}</div>
              </div>
            ))}
          </RevealGroup>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Reveal direction="right">
              <div className="h-full rounded-2xl bg-white p-6" style={{ border: "1px solid #C2410C" }}>
                <div className="text-4xl font-bold text-black">
                  150<span style={{ color: "#C2410C" }}>+</span>
                </div>
                <div className="mt-2 text-sm font-semibold text-black">Engineers & Consultants</div>
                <div className="mt-2 text-xs leading-relaxed text-black/60">
                  Senior practitioners with average 12+ years in the field.
                </div>
              </div>
            </Reveal>
            <Reveal direction="right" delay={120}>
              <div className="h-full rounded-2xl bg-white p-6" style={{ border: "1px solid #C2410C" }}>
                <div className="text-4xl font-bold text-black">24/7</div>
                <div className="mt-2 text-sm font-semibold text-black">Coverage</div>
                <div className="mt-2 text-xs leading-relaxed text-black/60">
                  Follow-the-sun handoffs across four delivery centers.
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal direction="up" delay={250}>
            <div className="rounded-2xl bg-white p-6" style={{ border: "1px solid #C2410C" }}>
              <div className="text-sm font-semibold text-black">Global Delivery Centers</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {LOCATIONS.map((loc) => (
                  <span
                    key={loc}
                    className="inline-flex items-center rounded-full border border-black/10 px-3 py-1.5 text-xs text-black"
                  >
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
