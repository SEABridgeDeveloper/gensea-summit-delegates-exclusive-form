"use client";

import { Lock } from "lucide-react";
import { cn } from "@/lib/cn";

type KickerVariant = "exclusive" | "default";

interface KickerProps {
  primary: string;
  secondary?: string;
  variant?: KickerVariant;
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
          ? "border-brand-red/40 bg-brand-red/10"
          : "border-navy/20 bg-white/80",
        className,
      )}
    >
      {renderIcon ? (
        <Lock
          className={cn(
            "h-3 w-3",
            isExclusive ? "text-brand-red" : "text-navy/75",
          )}
          strokeWidth={2.5}
          aria-hidden="true"
        />
      ) : (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            isExclusive ? "bg-brand-red" : "bg-coral-600",
          )}
          aria-hidden="true"
        />
      )}

      <span className={isExclusive ? "text-brand-red" : "text-navy/85"}>{primary}</span>

      {secondary && (
        <>
          <span
            className={cn(
              "h-1 w-1 rounded-full",
              isExclusive ? "bg-brand-red/40" : "bg-navy/40",
            )}
            aria-hidden="true"
          />
          <span className="text-navy/85">{secondary}</span>
        </>
      )}
    </div>
  );
}
