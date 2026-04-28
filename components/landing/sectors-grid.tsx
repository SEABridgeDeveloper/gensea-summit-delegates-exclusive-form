"use client";

import { Heart, Wheat, Cpu, Palette, GraduationCap } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";

const ICONS: Record<string, typeof Heart> = {
  wellness: Heart,
  food: Wheat,
  ai: Cpu,
  creative: Palette,
  education: GraduationCap,
};

type LegacySector = { key: string; name: string; blurb: string };
type NewSector = { title: string; description: string };

// Normalise both shapes:
//   1. legacy en.json:  [{ key, name, blurb }, ...]
//   2. new gen-sea:     { wellness: { title, description }, ... }
function normaliseSectors(raw: unknown): { key: string; name: string; blurb: string }[] {
  if (Array.isArray(raw)) {
    return (raw as LegacySector[]).map((s) => ({
      key: s.key,
      name: s.name,
      blurb: s.blurb,
    }));
  }
  if (raw && typeof raw === "object") {
    return Object.entries(raw as Record<string, NewSector>).map(([key, value]) => ({
      key,
      name: value.title,
      blurb: value.description,
    }));
  }
  return [];
}

export function SectorsGrid() {
  const { t, tRaw } = useLocale();
  const sectors = normaliseSectors(tRaw<unknown>("sectors.items"));
  // Support both legacy heading/body keys and the new title/subtitle keys.
  const heading = t("sectors.title") || t("sectors.heading");
  const body = t("sectors.subtitle") || t("sectors.body");
  // `t()` returns the path back when missing — strip those fallbacks so we don't render literal paths.
  const safeHeading = heading.startsWith("sectors.") ? "" : heading;
  const safeBody = body.startsWith("sectors.") ? "" : body;

  if (sectors.length === 0) return null;

  return (
    <section id="sectors" className="bg-cream-50">
      <div className="container-page py-20 sm:py-28">
        <div className="mb-12 max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-coral-600">
            {t("sectors.kicker")}
          </span>
          {safeHeading && (
            <h2 className="mt-4 font-display text-4xl font-bold text-navy sm:text-5xl">
              {safeHeading}
            </h2>
          )}
          {safeBody && <p className="mt-5 text-lg text-navy/75">{safeBody}</p>}
        </div>

        <ul className="flex flex-row items-stretch gap-4 sm:gap-6">
  {sectors.map((sector) => {
    const Icon = ICONS[sector.key] ?? Heart;
    return (
      <li
        key={sector.key}
        className="group flex min-w-0 flex-1 flex-col gap-4 rounded-2xl border border-navy/10 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-coral-500/40 sm:p-6"
      >
        <span className="icon-halo-lg">
          <Icon className="h-6 w-6" strokeWidth={1.75} />
        </span>
        <h3 className="font-display text-lg font-semibold leading-tight text-navy lg:text-xl">
          {sector.name}
        </h3>
        <p className="text-sm leading-relaxed text-navy/70">
          {sector.blurb}
        </p>
      </li>
    );
  })}
</ul>
      </div>
    </section>
  );
}
