"use client";

import type { ReactNode } from "react";
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
  const accentText = accent === "coral" ? "text-coral-600" : "text-brand-red";
  const accentBg = accent === "coral" ? "bg-coral-500/10" : "bg-brand-red/10";

  return (
    <article
      className={cn(
        "mt-10 overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-soft",
        className,
      )}
    >
      <header className="flex flex-col gap-4 border-b border-navy/10 px-6 py-7 sm:flex-row sm:items-center sm:gap-6 sm:px-10 sm:py-8">
        <span
          className={cn(
            "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-base font-bold",
            accentBg,
            accentText,
          )}
          aria-hidden
        >
          {step}
        </span>
        <div>
          <span
            className={cn(
              "text-xs font-semibold uppercase tracking-[0.2em]",
              accentText,
            )}
          >
            {kicker}
          </span>
          <h3 className="mt-1 font-display text-2xl font-bold text-navy sm:text-3xl">
            {title}
          </h3>
        </div>
      </header>
      <div className="px-6 py-8 sm:px-10 sm:py-10">{children}</div>
    </article>
  );
}
