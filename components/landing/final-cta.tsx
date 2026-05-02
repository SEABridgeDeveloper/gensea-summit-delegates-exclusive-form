"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";
import { Reveal } from "@/components/shared/reveal";

export function FinalCta() {
  const { t } = useLocale();
  return (
    // Poster-style ink panel topped + tailed by the signature gradient ribbon.
    <section className="surface-poster relative isolate overflow-hidden">
      <div className="gradient-strip" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/2 -z-10 h-96 w-96 -translate-y-1/2 rounded-full bg-sunset-500/25 blur-[140px]"
      />
      <Reveal className="container-page flex flex-col gap-8 py-20 text-cream-50 sm:py-24 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl font-bold sm:text-5xl">
            <span className="gradient-text-brand">{t("finalCta.heading")}</span>
          </h2>
          <p className="mt-4 text-lg text-cream-50/85">{t("finalCta.body")}</p>
        </div>
        <Link href="/#tracks" className="btn-inverse shadow-ember transition hover:-translate-y-0.5">
          {t("finalCta.cta")}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Reveal>
      <div className="gradient-strip" aria-hidden="true" />
    </section>
  );
}
