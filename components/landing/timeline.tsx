"use client";

import { useLocale } from "@/lib/i18n/provider";

type Item = { date: string; label: string };

export function Timeline() {
  const { t, tRaw } = useLocale();
  const items = tRaw<Item[]>("timeline.items") ?? [];

  return (
    <section id="timeline" className="bg-cream-50">
      <div className="container-page py-20 sm:py-28">
        <div className="mb-14 max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-coral-600">
            {t("timeline.kicker")}
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold text-navy sm:text-5xl">
            {t("timeline.heading")}
          </h2>
        </div>

        <div className="relative">
          {/* horizontal connector — desktop only */}
          <div className="absolute inset-x-0 top-3 hidden h-px bg-gold-500 lg:block" aria-hidden />
          <ol className="grid gap-10 lg:grid-cols-5 lg:gap-6">
            {items.map((item) => (
              <li key={item.date} className="relative flex gap-4 lg:flex-col lg:gap-3 items-center">
                <span
                  className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cream-50 ring-2 ring-gold-500"
                  aria-hidden
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-gold-500" />
                </span>
                <div>
                  <div className="font-display text-xl font-semibold text-navy text-center">{item.date}</div>
                  <div className="mt-1 text-sm text-navy/70 text-center">{item.label}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
