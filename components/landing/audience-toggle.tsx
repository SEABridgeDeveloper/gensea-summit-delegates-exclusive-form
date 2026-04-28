"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { ArrowRight, GraduationCap, Rocket } from "lucide-react";
import { cn } from "@/lib/cn";

export type Track = "individual" | "startup";

export function useTrack(): Track {
  const params = useSearchParams();
  return params.get("track") === "startup" ? "startup" : "individual";
}

export function AudienceToggle({ track }: { track: Track }) {
  const router = useRouter();
  const params = useSearchParams();

  const setTrack = useCallback(
    (next: Track) => {
      const sp = new URLSearchParams(params.toString());
      sp.set("track", next);
      router.replace(`/?${sp.toString()}#tracks`, { scroll: false });
    },
    [router, params],
  );

  return (
    <section id="tracks" className="bg-cream-50">
      <div className="container-page py-16 sm:py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-coral-600">
            Choose your application path
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold text-navy sm:text-4xl">
            Two tracks. Both open below.
          </h2>
          <p className="mt-3 max-w-xl text-base text-navy/70">
            Switch any time — the URL keeps your selection so you can share it.
          </p>

          <div
            role="tablist"
            aria-label="Application track"
            className="mt-8 inline-flex flex-col rounded-full border border-navy/15 bg-white p-1.5 shadow-soft sm:flex-row"
          >
            <button
              type="button"
              role="tab"
              aria-selected={track === "individual"}
              onClick={() => setTrack("individual")}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition sm:px-8 sm:text-base",
                track === "individual"
                  ? "bg-navy text-cream-50 shadow-sm"
                  : "text-navy/60 hover:text-navy",
              )}
            >
              <GraduationCap className="h-4 w-4" strokeWidth={2.25} />
              Individual Applicant
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={track === "startup"}
              onClick={() => setTrack("startup")}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition sm:px-8 sm:text-base",
                track === "startup"
                  ? "bg-brand-red text-white shadow-sm"
                  : "text-navy/60 hover:text-navy",
              )}
            >
              <Rocket className="h-4 w-4" strokeWidth={2.25} />
              Startup Applicant
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TrackSwitchLink({ track }: { track: Track }) {
  const router = useRouter();
  const params = useSearchParams();
  const other: Track = track === "individual" ? "startup" : "individual";
  const otherLabel = other === "individual" ? "Individual Applicant" : "Startup Applicant";

  const switchTrack = () => {
    const sp = new URLSearchParams(params.toString());
    sp.set("track", other);
    router.replace(`/?${sp.toString()}#tracks`, { scroll: false });
  };

  return (
    <button
      type="button"
      onClick={switchTrack}
      className="group inline-flex items-center gap-1.5 text-sm font-semibold text-coral-600 transition hover:text-coral-700"
    >
      Looking for the other track? Switch to {otherLabel}
      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}
