"use client";

import { useState } from "react";
import Link from "next/link";

const ACCENT = "#FF5A1F";
const TINT_BG = "#FFEFE6";

const INDUSTRIES = [
  {
    name: "Healthcare & Life Sciences",
    short: "Healthcare",
    href: "/industries/healthcare",
    desc: "HIPAA-ready platforms, clinical data pipelines, and patient apps that help providers move faster without compromising trust.",
    button: "Explore healthcare",
    iconPaths: ["M2 12h5l2-6 4 12 2-6h7"],
  },
  {
    name: "Banking & Finance",
    short: "Finance",
    href: "/industries/finance",
    desc: "Secure core systems, real-time payments, and fraud tooling engineered for institutions that cannot afford downtime.",
    button: "Explore finance",
    iconPaths: ["M3 21h18", "M5 21V10", "M9 21V10", "M15 21V10", "M19 21V10", "M3 9l9-6 9 6z"],
  },
  {
    name: "Government & Public Sector",
    short: "Government",
    href: "/industries/government",
    desc: "FedRAMP, CMMC, and Section 508 delivered inside procurement reality — ATO timelines compressed by automation.",
    button: "Explore government",
    iconPaths: ["M12 2l8 4v6c0 5-3.5 9.3-8 11-4.5-1.7-8-6-8-11V6l8-4z"],
  },
  {
    name: "Education & EdTech",
    short: "Education",
    href: "/industries/education",
    desc: "Learning platforms, assessment engines, and student tooling built for accessibility and millions of concurrent users.",
    button: "Explore education",
    iconPaths: ["M2 8l10-4 10 4-10 4L2 8z", "M6 10v5c0 1.4 2.7 3 6 3s6-1.6 6-3v-5", "M22 8v6"],
  },
  {
    name: "Telecom & Communications",
    short: "Telecom",
    href: "/industries/telecom",
    desc: "OSS and BSS modernization, cloud-native CNFs, and five-nines reliability delivered with carrier-grade discipline.",
    button: "Explore telecom",
    iconPaths: ["M1.5 8.5a13 13 0 0121 0", "M5 12a10 10 0 0114 0", "M8.5 15.5a6 6 0 017 0", "M11 19h2"],
  },
  {
    name: "Logistics & Supply Chain",
    short: "Logistics",
    href: "/industries/logistics",
    desc: "Route optimization, fleet tracking, and warehouse systems that keep goods moving and visibility end-to-end.",
    button: "Explore logistics",
    iconPaths: ["M2 6h11v9H2z", "M13 9h4l4 3v3h-8V9z", "M7 18.5a2 2 0 11-.01 0", "M18 18.5a2 2 0 11-.01 0"],
  },
  {
    name: "Manufacturing & Industrial",
    short: "Industry",
    href: "/industries/manufacturing",
    desc: "IoT telemetry, predictive maintenance, and factory dashboards that turn shop-floor data into operational decisions.",
    button: "Explore manufacturing",
    iconPaths: ["M2 20V8l7-5v17H2z", "M9 20V12h6v8H9z", "M15 20V8l7-5v17h-7z"],
  },
  {
    name: "Retail & E-Commerce",
    short: "Retail",
    href: "/industries/retail",
    desc: "Headless storefronts, inventory sync, and checkout flows that scale cleanly from launch through peak-season traffic.",
    button: "Explore retail",
    iconPaths: ["M5 8h14l-1.1 12.1a1 1 0 01-1 .9H7.1a1 1 0 01-1-.9L5 8z", "M8.5 8V6a3.5 3.5 0 017 0v2"],
  },
];

const N = INDUSTRIES.length;
const R = 46; // orbital radius as % of container

function getPosition(i: number) {
  const theta = (-90 + i * (360 / N)) * (Math.PI / 180);
  return {
    x: 50 + R * Math.cos(theta),
    y: 50 + R * Math.sin(theta),
  };
}

export default function Industries() {
  const [active, setActive] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const handleActivate = (i: number) => {
    if (i === active) return;
    setActive(i);
    setAnimKey((k) => k + 1);
  };

  const current = INDUSTRIES[active];

  return (
    <section
      id="industries"
      className="px-6"
      style={{
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
        background: "var(--paper-3, #F5F7FA)",
        color: "#111",
        paddingTop: "64px",
        paddingBottom: "80px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
    <div className="mx-auto max-w-7xl">
      <style>{`
        @keyframes cardIn {
          0%   { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes ringFloat {
          0%,100% { transform: translate(-50%,-50%) rotate(0deg); }
          50%     { transform: translate(-50%,-50%) rotate(2deg); }
        }
        .ind-ring-float {
          animation: ringFloat 14s ease-in-out infinite;
        }
        .ind-card-anim {
          animation: cardIn 0.4s cubic-bezier(0.2,0.8,0.2,1) both;
        }
        .ind-cta:hover {
          transform: translate(-2px, -2px);
          box-shadow: 5px 5px 0 #111 !important;
        }
        .ind-node:hover {
          transform: scale(1.1) !important;
        }
      `}</style>

      {/* Header */}
      <header style={{ maxWidth: "560px", margin: "0 0 8px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "6px 12px", border: "2px solid #111", borderRadius: "100px",
          background: "#fff", boxShadow: "3px 3px 0 #111",
          fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em",
          textTransform: "uppercase", whiteSpace: "nowrap",
        }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: ACCENT, display: "inline-block" }} />
          Where we build
        </div>

        <h2 style={{
          fontFamily: "var(--font-heading, system-ui, sans-serif)",
          fontWeight: 700,
          fontSize: "clamp(34px, 5vw, 56px)",
          lineHeight: 1.02,
          letterSpacing: "-0.02em",
          margin: "20px 0 14px",
        }}>
          Industries we engineer for
        </h2>

        <p style={{ fontSize: "16px", lineHeight: 1.6, color: "#444", margin: 0, maxWidth: "46ch" }}>
          Hover any industry to see how our teams deliver. Eight sectors, one engineering practice — explore where we build.
        </p>
      </header>

      {/* Orbital wheel */}
      <div style={{
        position: "relative",
        width: "min(96vw, 860px)",
        aspectRatio: "1 / 1",
        margin: "8px auto 0",
      }}>

        {/* Animated dashed ring */}
        <div
          className="ind-ring-float"
          style={{
            position: "absolute", left: "50%", top: "50%",
            width: "92%", height: "92%",
            border: "2px dashed rgba(17,17,17,0.16)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        {/* Static solid ring */}
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          width: "92%", height: "92%",
          border: "1.5px solid rgba(17,17,17,0.10)",
          borderRadius: "50%",
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
        }} />

        {/* Central info card */}
        <article style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%,-50%)",
          width: "min(52%, 420px)",
          background: "#fff",
          border: "2.5px solid #111",
          borderRadius: "22px",
          boxShadow: "8px 8px 0 #111",
          padding: "32px 32px 30px",
          boxSizing: "border-box",
          zIndex: 8,
        }}>
          <div key={animKey} className="ind-card-anim">
            {/* Icon + counter */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "22px" }}>
              <div style={{
                width: 64, height: 64, borderRadius: "16px",
                border: "2px solid #111", background: TINT_BG, color: ACCENT,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"
                  strokeLinecap="round" strokeLinejoin="round" width="34" height="34" style={{ display: "block" }}>
                  {current.iconPaths.map((d, i) => <path key={i} d={d} />)}
                </svg>
              </div>
              <span style={{
                fontFamily: "var(--font-heading, sans-serif)",
                fontSize: "14px", fontWeight: 600, color: "#999", letterSpacing: "0.04em",
              }}>
                {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
              </span>
            </div>

            {/* Name */}
            <h3 style={{
              fontFamily: "var(--font-heading, sans-serif)",
              fontWeight: 700, fontSize: "26px", lineHeight: 1.1,
              letterSpacing: "-0.01em", margin: "0 0 12px",
            }}>
              {current.name}
            </h3>

            {/* Description */}
            <p style={{
              fontSize: "15.5px", lineHeight: 1.65, color: "#4a4a4a",
              margin: "0 0 26px", minHeight: "76px",
            }}>
              {current.desc}
            </p>

            {/* CTA */}
            <Link
              href={current.href}
              className="ind-cta"
              style={{
                display: "inline-flex", alignItems: "center", gap: "9px",
                background: ACCENT, color: "#fff",
                fontWeight: 600, fontSize: "14px",
                textDecoration: "none",
                padding: "11px 18px",
                border: "2px solid #111", borderRadius: "10px",
                boxShadow: "3px 3px 0 #111",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
            >
              {current.button}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <path d="M5 12h14" /><path d="M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </article>

        {/* Industry nodes */}
        {INDUSTRIES.map((ind, i) => {
          const { x, y } = getPosition(i);
          const isActive = i === active;

          return (
            <div
              key={ind.short}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%,-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                width: "110px",
                zIndex: isActive ? 7 : 4,
              }}
            >
              <button
                onMouseEnter={() => handleActivate(i)}
                onFocus={() => handleActivate(i)}
                onClick={() => handleActivate(i)}
                aria-label={ind.name}
                className={isActive ? undefined : "ind-node"}
                style={{
                  width: 80, height: 80,
                  borderRadius: "50%",
                  border: "2.5px solid #111",
                  background: isActive ? ACCENT : "#fff",
                  color: isActive ? "#fff" : "#111",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", padding: 0,
                  boxShadow: isActive ? "4px 4px 0 #111" : "2px 2px 0 rgba(17,17,17,0.18)",
                  transform: isActive ? "scale(1.12)" : "scale(1)",
                  transition: "background 0.2s, color 0.2s, transform 0.25s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.2s",
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" width="32" height="32" style={{ display: "block" }}>
                  {ind.iconPaths.map((d, pi) => <path key={pi} d={d} />)}
                </svg>
              </button>

              <span style={{
                fontSize: "12px",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? ACCENT : "#5b5b5b",
                textAlign: "center",
                letterSpacing: "0.01em",
                lineHeight: 1.15,
                transition: "color 0.2s",
              }}>
                {ind.short}
              </span>
            </div>
          );
        })}
      </div>
    </div>
    </section>
  );
}
