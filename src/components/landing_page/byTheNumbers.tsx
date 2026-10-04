import Reveal, { RevealGroup } from "@/components/public/reveal";

const STATS = [
  { value: "320+", label: "Cloud migrations delivered" },
  { value: "98%", label: "Client retention rate" },
  { value: "11", label: "Years in operation" },
  { value: "60+", label: "AI models in production" },
];

export default function ByTheNumbers() {
  return (
    <section className="w-full py-20 px-6" style={{ backgroundColor: "var(--dark-warm)" }}>
      <div className="mx-auto max-w-7xl">
        {/* Top row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 pb-12 border-b border-white/10">
          <Reveal direction="left">
            <h2
              className="text-4xl md:text-5xl font-bold leading-tight"
              style={{ color: "#F4EFE9" }}
            >
              A decade of moving
              <br />
              critical systems.
            </h2>
          </Reveal>
          <Reveal direction="right" delay={150}>
            <p
              className="text-lg leading-relaxed lg:mt-12"
              style={{ color: "#9A8E81" }}
            >
              We don&apos;t chase logos. We measure ourselves by what stays in
              production — and by the clients who keep coming back.
            </p>
          </Reveal>
        </div>

        {/* Stats row */}
        <RevealGroup
          stagger={100}
          initialDelay={200}
          direction="up"
          className="grid grid-cols-2 lg:grid-cols-4 gap-10 pt-12"
        >
          {STATS.map((stat) => (
            <div key={stat.label}>
              <div
                className="text-5xl md:text-6xl font-bold"
                style={{ color: "#F26A2C" }}
              >
                {stat.value}
              </div>
              <p className="mt-3 text-sm" style={{ color: "#9A8E81" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
