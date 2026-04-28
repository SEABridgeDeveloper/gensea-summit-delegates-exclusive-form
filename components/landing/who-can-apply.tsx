"use client";

import { useLocale } from "@/lib/i18n/provider";

type Item = { label: string; value: string };

export function WhoCanApply() {
  const { t, tRaw } = useLocale();
  const items = tRaw<Item[]>("whoCanApply.criteria") ?? [];

  return (
    <section className="bg-cream-100">
      <div className="container-page grid gap-12 py-20 sm:py-28 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-coral-600">
            {t("whoCanApply.kicker")}
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold text-navy sm:text-5xl">
            {t("whoCanApply.heading")}
          </h2>
        </div>
        <div>
          <dl className="divide-y divide-navy/10 border-y border-navy/10">
            {items.map((item) => (
              <div key={item.label} className="grid gap-2 py-5 sm:grid-cols-[180px_1fr]">
                <dt className="text-sm font-semibold uppercase tracking-[0.14em] text-navy/55">
                  {item.label}
                </dt>
                <dd className="font-display text-xl text-navy sm:text-2xl">{item.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-base text-navy/70">{t("whoCanApply.footnote")}</p>
        </div>
      </div>
    </section>
  );
}
