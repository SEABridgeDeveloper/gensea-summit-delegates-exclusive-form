"use client";

import { useLocale } from "@/lib/i18n/provider";
import { Reveal } from "@/components/shared/reveal";
import { Heart, Sprout, Cpu, Palette, GraduationCap, type LucideIcon } from "lucide-react";

type Sector = {
  key: string;
  name: string;
  blurb: string;
};

/**
 * SectorsGrid — five-sector proof block.
 *
 * Renders `messages.sectors.items` (already in en.json, previously
 * unrendered). Mirrors the poster's "FIVE WFACE SECTORS" row:
 * Wellness · Food · AI · Creative · Education.
 *
 * Sector → icon mapping uses lucide glyphs (no emojis). Falls back to
 * the wellness Heart for any unknown key so the page can't crash on
 * a future i18n addition.
 */
const ICON_BY_KEY: Record<string, LucideIcon> = {
  wellness: Heart,
  food: Sprout,
  ai: Cpu,
  creative: Palette,
  education: GraduationCap,
};

export function SectorsGrid() {
  const { tRaw, t } = useLocale();
  const items = (tRaw<Sector[]>("sectors.items") ?? []).filter(Boolean);
  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="sectors-heading"
      className="surface-poster relative isolate overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-32 -z-10 h-96 w-96 rounded-full bg-sunset-500/15 blur-[140px]"
      />

      <div className="container-page py-20 sm:py-28">
        <Reveal as="header" className="max-w-2xl">
          <span className="eyebrow">{t("sectors.kicker")}</span>
          <h2 id="sectors-heading" className="mt-4 font-display text-display-sm text-bone">
            {t("sectors.heading")}
          </h2>
          <p className="mt-5 text-lg text-bone-muted sm:text-xl">
            {t("sectors.body")}
          </p>
        </Reveal>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-5 lg:gap-5">
          {items.map((sector, index) => {
            const Icon = ICON_BY_KEY[sector.key] ?? Heart;
            return (
              <Reveal as="div" key={sector.key} delay={index * 60}>
                <article className="group relative h-full overflow-hidden rounded-2xl border border-sunset-500/20 bg-ink-elevated p-6 shadow-ink transition duration-300 ease-out hover:-translate-y-0.5 hover:border-sunset-500/40 hover:shadow-ember motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                  {/* Top gradient seam — micro version of the section ribbon */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px bg-brand-gradient opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <span className="check-halo h-10 w-10 ring-1 ring-sunset-500/30">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-bone">
                    {sector.name}
                  </h3>
                  <p className="mt-2 text-sm text-bone-muted">{sector.blurb}</p>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
