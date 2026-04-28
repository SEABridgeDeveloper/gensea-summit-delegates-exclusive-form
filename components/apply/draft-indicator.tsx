"use client";

import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export type DraftState = "idle" | "saving" | "saved";

export function DraftIndicator({ state, className }: { state: DraftState; className?: string }) {
  if (state === "idle") return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium text-navy/55",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      {state === "saving" ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin" />
          Saving draft…
        </>
      ) : (
        <>
          <Check className="h-3 w-3 text-coral-500" strokeWidth={3} />
          Draft saved
        </>
      )}
    </span>
  );
}
