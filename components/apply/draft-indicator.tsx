"use client";

import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export type DraftState = "idle" | "saving" | "saved";

export function DraftIndicator({ state, className }: { state: DraftState; className?: string }) {
  if (state === "idle") return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[13px] font-medium text-navy/75",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      {state === "saving" ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          Saving draft…
        </>
      ) : (
        <>
          <Check className="h-3.5 w-3.5 text-coral-700" strokeWidth={3} aria-hidden="true" />
          Draft saved
        </>
      )}
    </span>
  );
}
