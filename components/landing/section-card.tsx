"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * SectionCard — the dark stat-panel that the poster uses for its info
 * blocks. ink-elevated fill, sunset-500/20 border, gradient seam at
 * the top edge, hover-lift + ember shadow on pointer devices.
 *
 * The legacy `accent` prop ("coral" | "red") was kept during the
 * migration but both values resolved to the same sunset hue. It's been
 * removed; existing call sites just stop passing it.
 */
export function SectionCard({
  step,
  kicker,
  title,
  children,
  className,
}: {
  step: string;
  kicker: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const id = useId();
  const titleId = `${id}-title`;

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        "group mt-10 overflow-hidden rounded-3xl border border-sunset-500/20 bg-ink-elevated shadow-ink transition duration-300 ease-out hover:-translate-y-0.5 hover:border-sunset-500/40 hover:shadow-ember motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <div className="h-1 w-full bg-brand-gradient" aria-hidden="true" />
      <header className="flex flex-col gap-4 border-b border-bone-hairline px-6 py-8 sm:flex-row sm:items-center sm:gap-6 sm:px-10 sm:py-10">
        <span
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sunset-500/15 font-display text-base font-bold text-sunset-400 ring-1 ring-sunset-500/30"
          aria-hidden="true"
        >
          {step}
        </span>
        <div>
          <span className="eyebrow">{kicker}</span>
          <h3
            id={titleId}
            className="mt-1 font-display text-2xl font-bold text-bone sm:text-3xl"
          >
            {title}
          </h3>
        </div>
      </header>
      <div className="px-6 py-8 text-bone-muted sm:px-10 sm:py-10">{children}</div>
    </article>
  );
}
