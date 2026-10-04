"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
} from "react";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type RevealDirection =
  | "up"
  | "down"
  | "left"
  | "right"
  | "fade"
  | "scale";

type RevealTag =
  | "div"
  | "section"
  | "article"
  | "header"
  | "footer"
  | "main"
  | "aside"
  | "ul"
  | "li"
  | "span";

/**
 * Scroll-triggered reveal. Wrap a section/heading/card group and it
 * fades + slides into view once any part enters the viewport.
 *
 * Honors prefers-reduced-motion via the .reveal CSS rule in globals.css.
 */
export default function Reveal({
  as: Tag = "div",
  direction = "up",
  delay = 0,
  duration,
  className = "",
  children,
}: {
  as?: RevealTag;
  direction?: RevealDirection;
  delay?: number; // ms
  duration?: number; // ms
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);
  // Default to revealed so SSR and the first client render agree (no
  // hydration mismatch, no flash of hidden content). Below-the-fold
  // elements get re-hidden on mount and animated in via IO.
  const [revealed, setRevealed] = useState(true);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Always hide first so the transition has a "from" state to paint,
    // including for above-the-fold content.
    setRevealed(false);
    const rect = el.getBoundingClientRect();
    const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
    if (inViewport) {
      // Give the browser one frame to paint the hidden state, then reveal.
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setRevealed(true));
      });
      return () => cancelAnimationFrame(raf);
    }
    if (typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Component = Tag as React.ElementType;
  const style: React.CSSProperties = {};
  if (delay) style.transitionDelay = `${delay}ms`;
  if (duration) style.transitionDuration = `${duration}ms`;

  return (
    <Component
      ref={ref as React.Ref<HTMLElement>}
      data-direction={direction}
      className={`reveal ${revealed ? "is-revealed" : ""} ${className}`.trim()}
      style={Object.keys(style).length ? style : undefined}
    >
      {children}
    </Component>
  );
}

/**
 * Staggers a sequence of children. Each direct child is wrapped in a
 * Reveal with an incrementing delay. If a child is already a Reveal-like
 * element with a `delay` prop, the stagger is added to it.
 */
export function RevealGroup({
  as: Tag = "div",
  direction = "up",
  stagger = 80,
  initialDelay = 0,
  className = "",
  itemClassName = "",
  children,
}: {
  as?: RevealTag;
  direction?: RevealDirection;
  stagger?: number; // ms between each child
  initialDelay?: number; // ms before the first child
  className?: string;
  itemClassName?: string;
  children: React.ReactNode;
}) {
  const Component = Tag as React.ElementType;
  const items = Children.toArray(children);
  return (
    <Component className={className || undefined}>
      {items.map((child, i) => {
        const delay = initialDelay + i * stagger;
        if (isValidElement(child) && child.type === Reveal) {
          const el = child as ReactElement<{ delay?: number; className?: string }>;
          return cloneElement(el, {
            delay: (el.props.delay ?? 0) + delay,
            className: `${el.props.className ?? ""} ${itemClassName}`.trim() || undefined,
          });
        }
        return (
          <Reveal key={i} direction={direction} delay={delay} className={itemClassName}>
            {child}
          </Reveal>
        );
      })}
    </Component>
  );
}
