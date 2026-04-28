"use client";

import { Info } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";

type Step = { n: string; title: string; body: string };

export function HowToGetIn() {
  const { t, tRaw } = useLocale();
  const steps = tRaw<Step[]>("howToGetIn.steps") ?? [];

  return (
    <section className="bg-cream-100">
      <div className="container-page py-20 sm:py-28">
        <div className="mb-12 max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-coral-600">
            {t("howToGetIn.kicker")}
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold text-navy sm:text-5xl">
            {t("howToGetIn.heading")}
          </h2>
        </div>

        <ol className="grid gap-6 lg:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="rounded-2xl border border-navy/10 bg-white p-7 shadow-soft">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-red font-display text-lg font-bold text-cream-50">
                {s.n}
              </span>
              <h3 className="mt-5 font-display text-2xl font-semibold text-navy">{s.title}</h3>
              <p className="mt-3 text-sm text-navy/70">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex gap-4 rounded-2xl border-2 border-gold-500/70 bg-gold-500/5 p-6">
          <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-gold-600">
            <Info className="h-4 w-4" strokeWidth={2} />
          </span>
          <div>
            <h4 className="font-display text-lg font-semibold text-navy">
              {t("howToGetIn.caveatTitle")}
            </h4>
            <p className="mt-1 text-sm text-navy/75">{t("howToGetIn.caveatBody")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
