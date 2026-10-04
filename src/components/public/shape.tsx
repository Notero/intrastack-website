import * as React from "react";
import { cn } from "@/lib/utils";

type ShapeKind = "square" | "circle" | "triangle";

type ShapeProps = {
  kind: ShapeKind;
  size?: number;
  /** Tailwind position utilities, e.g. "top-10 left-20" */
  position?: string;
  /** Rotation in degrees */
  rotate?: number;
  /** Stroke or fill color — any valid CSS color or tailwind text-/border- via className */
  color?: string;
  /** If true renders an outline only */
  outline?: boolean;
  /** Outline stroke width in px */
  strokeWidth?: number;
  /** 0–1 */
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
};

export default function Shape({
  kind,
  size = 80,
  position,
  rotate = 0,
  color = "currentColor",
  outline = false,
  strokeWidth = 2,
  opacity = 1,
  className,
  style,
}: ShapeProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 100 100",
    "aria-hidden": true as const,
    focusable: false as const,
  };

  const fill = outline ? "none" : color;
  const stroke = outline ? color : "none";
  const sw = outline ? (strokeWidth * 100) / size : 0;

  let shape: React.ReactNode = null;
  if (kind === "square") {
    shape = <rect x="2" y="2" width="96" height="96" fill={fill} stroke={stroke} strokeWidth={sw} />;
  } else if (kind === "circle") {
    shape = <circle cx="50" cy="50" r="48" fill={fill} stroke={stroke} strokeWidth={sw} />;
  } else if (kind === "triangle") {
    shape = (
      <polygon
        points="50,4 96,92 4,92"
        fill={fill}
        stroke={stroke}
        strokeWidth={sw}
        strokeLinejoin="round"
      />
    );
  }

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute select-none -z-10", position, className)}
      style={{
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        opacity,
        ...style,
      }}
    >
      <svg {...common}>{shape}</svg>
    </div>
  );
}
