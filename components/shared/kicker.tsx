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
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur",
        // Both variants now lean into the poster's sunset palette so the
        // pill reads cleanly on the dark hero and on light sections.
        isExclusive
          ? "border-sunset-500/50 bg-sunset-500/15 text-sunset-100"
          : "border-sunset-500/40 bg-cream-50/10 text-cream-50",
        className,
      )}
    >
      {renderIcon ? (
        <Lock
          className="h-3 w-3 text-sunset-500"
          strokeWidth={2.5}
          aria-hidden="true"
        />
      ) : (
        <span
          className="h-1.5 w-1.5 rounded-full bg-sunset-500 shadow-[0_0_10px_rgba(255,107,26,0.8)]"
          aria-hidden="true"
        />
      )}

      <span className="text-sunset-400">{primary}</span>

      {secondary && (
        <>
          <span
            className="h-1 w-1 rounded-full bg-sunset-500/50"
            aria-hidden="true"
          />
          <span className={isExclusive ? "text-sunset-100" : "text-cream-50/90"}>
            {secondary}
          </span>
        </>
      )}
    </div>
  );
}
