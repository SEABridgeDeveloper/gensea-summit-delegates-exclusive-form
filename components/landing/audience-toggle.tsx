"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { ArrowRight, GraduationCap, Rocket } from "lucide-react";
import { cn } from "@/lib/cn";
import { useLocale } from "@/lib/i18n/provider";
import { Reveal } from "@/components/shared/reveal";

export type Track = "individual" | "startup";

export function useTrack(): Track {
  const params = useSearchParams();
  return params.get("track") === "startup" ? "startup" : "individual";
}

/**
 * AudienceToggle — true tablist.
 *
 * The two buttons select between two views (Individual / Startup) and
 * the URL reflects the choice. role="tablist" + aria-selected +
 * aria-controls give screen-reader users the right model — they hear
 * "tab, selected" instead of "button, pressed".
 */
export function AudienceToggle({ track }: { track: Track }) {
  const router = useRouter();
  const params = useSearchParams();
  const { t } = useLocale();

  const setTrack = useCallback(
    (next: Track) => {
      const sp = new URLSearchParams(params.toString());
      sp.set("track", next);
      router.replace(`/?${sp.toString()}#tracks`, { scroll: false });
    },
    [router, params],
  );

  return (
    <section id="tracks" className="surface-poster relative isolate overflow-hidden">
      <div className="container-page py-12 sm:py-16">
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="eyebrow">{t("tracks.toggle.eyebrow")}</span>

          {/* Poster-style ink pill: dark surface with a gradient-active state
              that mirrors the DELEGATE badge from the poster. Tablist
              semantics — buttons control the track section below. */}
          <div
            role="tablist"
            aria-label={t("tracks.toggle.groupLabel")}
            className="mt-6 inline-flex w-full max-w-md flex-col rounded-full border border-sunset-500/25 bg-ink-elevated p-1.5 shadow-ink sm:w-auto sm:flex-row"
          >
            <button
              type="button"
              role="tab"
              id="track-tab-individual"
              aria-selected={track === "individual"}
              aria-controls="track-panel-individual"
              tabIndex={track === "individual" ? 0 : -1}
              onClick={() => setTrack("individual")}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition sm:px-8 sm:text-base",
                track === "individual"
                  ? "bg-bone text-ink shadow-sm"
                  : "text-bone-muted hover:text-bone",
              )}
            >
              <GraduationCap className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
              {t("tracks.toggle.individual")}
            </button>
            <button
              type="button"
              role="tab"
              id="track-tab-startup"
              aria-selected={track === "startup"}
              aria-controls="track-panel-startup"
              tabIndex={track === "startup" ? 0 : -1}
              onClick={() => setTrack("startup")}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition sm:px-8 sm:text-base",
                track === "startup"
                  ? "bg-brand-gradient text-bone shadow-ember"
                  : "text-bone-muted hover:text-bone",
              )}
            >
              <Rocket className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
              {t("tracks.toggle.startup")}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * TrackSwitchLink — moved to the bottom of each track in the redesign.
 * Reads the prompt + label from i18n so a single component supports
 * both tracks.
 */
export function TrackSwitchLink({ track }: { track: Track }) {
  const router = useRouter();
  const params = useSearchParams();
  const { t } = useLocale();
  const other: Track = track === "individual" ? "startup" : "individual";
  const otherLabel =
    other === "individual"
      ? t("tracks.switchToIndividual")
      : t("tracks.switchToStartup");

  const switchTrack = () => {
    const sp = new URLSearchParams(params.toString());
    sp.set("track", other);
    router.replace(`/?${sp.toString()}#tracks`, { scroll: false });
  };

  return (
    <button
      type="button"
      onClick={switchTrack}
      aria-label={otherLabel}
      className="group inline-flex items-center gap-1.5 text-sm font-semibold text-sunset-400 transition hover:text-sunset-300"
    >
      {t("tracks.switchPrompt")} {otherLabel}
      <ArrowRight
        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </button>
  );
}
