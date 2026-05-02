"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Accent = "coral" | "red";

export function SectionCard({
  step,
  kicker,
  title,
  accent = "coral",
  children,
  className,
}: {
  step: string;
  kicker: string;
  title: string;
  accent?: Accent;
  children: ReactNode;
  className?: string;
}) {
  const id = useId();
  const titleId = `${id}-title`;
  // Both accents lean into the poster's sunset palette so info-cards pick
  // up the same warm orange the deck uses for stat badges. The two accent
  // names are kept for backward compatibility but resolve to the same hue.
  const accentText = "text-sunset-400";
  const accentBg = accent === "coral" ? "bg-sunset-500/15" : "bg-sunset-500/20";
  const stepRing =
    accent === "coral"
      ? "ring-1 ring-sunset-500/30"
      : "ring-1 ring-sunset-500/45";

  return (
    <article
      aria-labelledby={titleId}
      // Dark stat-card surface mirrors the poster's panels: ink fill, thin
      // sunset-tinted border, and a gradient seam at the top edge. Subtle
      // hover-lift + border glow gives the dark cards a sense of depth on
      // mouse pointers without breaking on touch.
      className={cn(
        "group mt-10 overflow-hidden rounded-3xl border border-sunset-500/20 bg-ink-800 shadow-ink transition duration-300 ease-out hover:-translate-y-0.5 hover:border-sunset-500/40 hover:shadow-ember motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <div className="h-1 w-full bg-brand-gradient" aria-hidden="true" />
      <header className="flex flex-col gap-4 border-b border-cream-50/10 px-6 py-8 sm:flex-row sm:items-center sm:gap-6 sm:px-10 sm:py-10">
        <span
          className={cn(
            "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-base font-bold",
            accentBg,
            accentText,
            stepRing,
          )}
          aria-hidden="true"
        >
          {step}
        </span>
        <div>
          <span
            className={cn(
              "text-xs font-semibold uppercase tracking-[0.22em]",
              accentText,
            )}
          >
            {kicker}
          </span>
          <h3
            id={titleId}
            className="mt-1 font-display text-2xl font-bold text-cream-50 sm:text-3xl"
          >
            {title}
          </h3>
        </div>
      </header>
      <div className="px-6 py-8 sm:px-10 sm:py-10 text-cream-50/85">{children}</div>
    </article>
  );
}
