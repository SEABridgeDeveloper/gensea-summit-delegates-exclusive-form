"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Reveal — scroll-triggered fade-up wrapper.
 *
 * Uses IntersectionObserver to flip into the visible state once the element
 * crosses ~12% into the viewport. Fires once, then disconnects so the user
 * doesn't see content re-animate on every scroll.
 *
 * Reduced-motion users skip the transform/opacity transition entirely
 * (handled both via `motion-reduce:` variants and the global media query
 * in globals.css).
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "header";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -64px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag
      ref={ref as any}
      style={{ transitionDelay: revealed ? `${delay}ms` : "0ms" }}
      className={cn(
        "transition duration-700 ease-out will-change-transform",
        "motion-reduce:transition-none",
        revealed
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
