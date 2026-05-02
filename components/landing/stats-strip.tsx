"use client";

import { useLocale } from "@/lib/i18n/provider";
import { Reveal } from "@/components/shared/reveal";

type Stat = { label: string; value: string };

/**
 * Stats strip — the poster's signature row of big-number proof tiles.
 *
 * Reads `messages.stats.items` (already in en.json, previously unrendered).
 * Sits between the hero and the theme manifesto so applicants see the
 * scale of the room before committing to a track decision.
 */
export function StatsStrip() {
  const { tRaw, t } = useLocale();
  const items = (tRaw<Stat[]>("stats.items") ?? []).filter(Boolean);
  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="stats-heading"
      className="surface-poster relative isolate overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-0 -z-10 h-72 w-72 rounded-full bg-sunset-500/15 blur-[120px]"
      />
      <div className="container-page py-16 sm:py-20">
        <Reveal>
          <h2 id="stats-heading" className="eyebrow mb-8 sm:mb-10">
            {t("stats.heading")}
          </h2>

          {/* Poster-style grid: 2 columns on phone, 3 on tablet, all six
              stats on a single row at lg+ if there are six. */}
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-sunset-500/20 bg-bone-hairline sm:grid-cols-3 lg:grid-cols-6">
            {items.map((stat) => (
              <li
                key={stat.label}
                className="bg-ink-elevated p-5 transition-colors duration-300 hover:bg-ink-subtle sm:p-6"
              >
                <span className="block min-h-[2.5em] font-display text-2xl font-bold flex items-center text-sunset-400 sm:text-3xl">
                  {stat.value}
                </span>
                <span className="mt-2 block min-h-[2.75em] text-xs leading-snug text-bone-muted sm:text-sm">
                  {stat.label}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
