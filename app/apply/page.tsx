"use client";

import Link from "next/link";
import { GraduationCap, Rocket, ArrowRight } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";

export default function ApplyPicker() {
  const { t } = useLocale();
  return (
    <main className="container-page py-20">
      <h1 className="font-display text-4xl font-extrabold text-navy">
        {t("applyPicker.title")}
      </h1>
      <p className="mt-3 max-w-xl text-navy/70">{t("applyPicker.subtitle")}</p>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <Link
          href="/apply/delegate"
          className="group rounded-2xl border border-navy/15 bg-white p-8 hover:-translate-y-1 hover:border-navy/40 hover:shadow-xl transition-all"
        >
          <GraduationCap className="h-10 w-10 text-navy" />
          <h2 className="mt-4 font-display text-2xl font-bold text-navy">
            {t("applyPicker.delegate.title")}
          </h2>
          <p className="mt-2 text-navy/70">{t("applyPicker.delegate.body")}</p>
          <span className="mt-6 inline-flex items-center gap-2 font-semibold text-navy group-hover:translate-x-1 transition-transform">
            {t("applyPicker.delegate.cta")} <ArrowRight className="h-4 w-4" />
          </span>
        </Link>

        <Link
          href="/apply/venture"
          className="group rounded-2xl border border-brand-red/20 bg-white p-8 hover:-translate-y-1 hover:border-brand-red/50 hover:shadow-xl transition-all"
        >
          <Rocket className="h-10 w-10 text-brand-red" />
          <h2 className="mt-4 font-display text-2xl font-bold text-navy">
            {t("applyPicker.venture.title")}
          </h2>
          <p className="mt-2 text-navy/70">{t("applyPicker.venture.body")}</p>
          <span className="mt-6 inline-flex items-center gap-2 font-semibold text-brand-red group-hover:translate-x-1 transition-transform">
            {t("applyPicker.venture.cta")} <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </div>
    </main>
  );
}