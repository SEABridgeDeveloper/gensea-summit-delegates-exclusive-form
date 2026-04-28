"use client";

import Link from "next/link";
import { Check, Home } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";
import { BrandMark } from "@/components/shared/brand-mark";
import { LanguageToggle } from "@/components/shared/language-toggle";

export default function ApplySuccessPage() {
  const { t, tArray } = useLocale();
  const tips = tArray("apply.success.tips");

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="border-b border-navy/10 bg-cream-50/80 backdrop-blur">
        <div className="container-page flex items-center justify-between py-4">
          <Link href="/" className="inline-flex items-center gap-3">
            <BrandMark />
          </Link>
          <LanguageToggle />
        </div>
      </header>

      <main className="container-page max-w-2xl pb-32 pt-20 sm:pt-28">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-coral-500/15 text-coral-600">
            <Check className="h-7 w-7" strokeWidth={2.4} />
          </span>
          <div>
            <h1 className="font-display text-4xl font-bold text-navy sm:text-5xl">
              {t("apply.success.title")}
            </h1>
            <p className="mt-3 text-lg text-navy/75">{t("apply.success.subtitle")}</p>
          </div>
          <p className="text-base text-navy/80">{t("apply.success.body")}</p>

          <div className="mt-4 w-full rounded-2xl border border-navy/10 bg-white p-6 shadow-soft">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-coral-600">
              {t("apply.success.tipsHeading")}
            </h2>
            <ul className="mt-4 space-y-3">
              {tips.map((tip) => (
                <li key={tip} className="flex gap-3 text-sm text-navy">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral-500" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/" className="btn-primary">
              <Home className="h-4 w-4" /> {t("apply.success.ctaHome")}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
