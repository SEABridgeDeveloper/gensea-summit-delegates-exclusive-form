"use client";

import { Lock } from "lucide-react";
import { cn } from "@/lib/cn";

type KickerVariant = "exclusive" | "default";

interface KickerProps {
  /** Main label, e.g. "Exclusive Scholarship" */
  primary: string;
  /** Optional secondary label after a divider, e.g. "Nomination Only" */
  secondary?: string;
  /** Visual variant — "exclusive" uses brand-red, "default" uses navy/cream */
  variant?: KickerVariant;
  /** Show lock icon (auto-true for exclusive variant) */
  showIcon?: boolean;
  className?: string;
}

export function Kicker({
  primary,
  secondary,
  variant = "exclusive",
  showIcon,
  className,
}: KickerProps) {
  const isExclusive = variant === "exclusive";
  const renderIcon = showIcon ?? isExclusive;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] backdrop-blur",
        isExclusive
          ? "border-brand-red/25 bg-brand-red/5"
          : "border-navy/15 bg-white/60",
        className,
      )}
    >
      {renderIcon ? (
        <Lock
          className={cn(
            "h-3 w-3",
            isExclusive ? "text-brand-red" : "text-navy/70",
          )}
          strokeWidth={2.5}
        />
      ) : (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            isExclusive ? "bg-brand-red" : "bg-coral-500",
          )}
        />
      )}

      <span className={isExclusive ? "text-brand-red" : "text-navy/70"}>
        {primary}
      </span>

      {secondary && (
        <>
          <span
            className={cn(
              "h-1 w-1 rounded-full",
              isExclusive ? "bg-brand-red/40" : "bg-navy/30",
            )}
            aria-hidden="true"
          />
          <span className="text-navy/70">{secondary}</span>
        </>
      )}
    </div>
  );
}