import Image from "next/image";
import Reveal from "@/components/public/reveal";

const CONTRACTS: [string, string][] = [
  ["Connecticut", "/images/contracts/connecticut-1.webp"],
  ["Delaware", "/images/contracts/delaware-1.webp"],
  ["Florida", "/images/contracts/florida-logo-1.webp"],
  ["Georgia", "/images/contracts/georgia-logo-1.webp"],
  ["Nebraska", "/images/contracts/nebraska-1.webp"],
  ["Nevada", "/images/contracts/nevada-logo-1.webp"],
  ["MBE", "/images/contracts/mbe.webp"],
];

// Tile inside a row so total content width safely exceeds the viewport — that
// keeps the marquee seamless on wide screens.
const TILED = Array.from({ length: 2 }, () => CONTRACTS).flat();

function Row({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <ul
      aria-hidden={ariaHidden}
      className="flex items-center gap-16 pr-16 shrink-0"
    >
      {TILED.map(([name, src], i) => (
        <li key={i} className="shrink-0">
          <Image
            src={src}
            alt={ariaHidden ? "" : name}
            height={110}
            width={110}
            loading="lazy"
            sizes="110px"
            style={{ width: "auto", height: "110px" }}
            className="object-contain opacity-80 grayscale hover:grayscale-0 hover:opacity-100 transition"
          />
        </li>
      ))}
    </ul>
  );
}

export default function ContractsStrip() {
  return (
    <div className="relative w-full bg-paper-5 shadow-2xl py-[12px] overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 flex items-center gap-10 mt-6">
        <Reveal direction="left">
          <div className="shrink-0 text-xs uppercase tracking-widest font-semibold text-muted-foreground max-w-[160px]">
            State Government Contracts
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
