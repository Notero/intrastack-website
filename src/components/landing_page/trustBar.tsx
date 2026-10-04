import Image from "next/image";
import Reveal from "@/components/public/reveal";
import Shape from "@/components/public/shape";

type Brand = { name: string; src: string };

const BRANDS: Brand[] = [
  { name: "Amazon AWS", src: "/images/Amazon_Web_Services_2025.svg" },
  { name: "Microsoft Azure", src: "/images/expertise/Azure.webp" },
  { name: "Google Cloud", src: "https://cdn.simpleicons.org/googlecloud" },
  { name: "Salesforce", src: "https://cdn.simpleicons.org/salesforce" },
  { name: "HubSpot", src: "https://cdn.simpleicons.org/hubspot" },
  { name: "Stripe", src: "https://cdn.simpleicons.org/stripe" },
  { name: "Slack", src: "/images/Slack-logo.jpg" },
  { name: "Atlassian", src: "https://cdn.simpleicons.org/atlassian" },
];

const TILED = Array.from({ length: 2 }, () => BRANDS).flat();

function Row({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <ul
      aria-hidden={ariaHidden}
      className="flex items-center gap-12 pr-12 shrink-0"
    >
      {TILED.map((brand, i) => (
        <li
          key={i}
          className="shrink-0 inline-flex items-center gap-2.5 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition"
        >
          <Image
            src={brand.src}
            alt=""
            aria-hidden
            height={24}
            width={24}
            loading="lazy"
            unoptimized
            sizes="24px"
            style={{ width: "24px", height: "24px" }}
            className="object-contain"
          />
          <span className="text-sm font-medium text-foreground whitespace-nowrap">
            {brand.name}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function TrustBar() {
  return (
    <div className="relative w-full bg-paper-2 border-y border-border py-12 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 flex items-center gap-10">
        <Reveal direction="left">
          <div className="shrink-0 text-xs uppercase tracking-widest font-semibold text-muted-foreground max-w-[160px]">
            Trusted by
          </div>
        </Reveal>
        <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max animate-[marquee_45s_linear_infinite]">
            <Row />
            <Row ariaHidden />
          </div>
        </div>
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
