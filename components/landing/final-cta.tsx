"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";

export function FinalCta() {
  const { t } = useLocale();
  return (
    <section className="bg-brand-red">
      <div className="container-page flex flex-col gap-8 py-20 text-cream-50 sm:py-24 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl font-bold sm:text-5xl">{t("finalCta.heading")}</h2>
          <p className="mt-4 text-lg text-cream-50/85">{t("finalCta.body")}</p>
        </div>
        <Link href="/#tracks" className="btn-inverse">
          {t("finalCta.cta")} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
