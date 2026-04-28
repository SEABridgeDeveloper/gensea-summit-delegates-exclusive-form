"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { useLocale } from "@/lib/i18n/provider";
import { BrandMark } from "@/components/shared/brand-mark";
import { LanguageToggle } from "@/components/shared/language-toggle";

export default function VentureSuccessPage() {
  const { t } = useLocale();

  return (
    <main className="min-h-screen bg-cream-50">
      <header className="border-b border-navy/10 bg-white/80 backdrop-blur">
        <div className="container-page flex items-center justify-between py-4">
          <BrandMark />
          <LanguageToggle />
        </div>
      </header>

      <div className="container-page flex flex-col items-center py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gold-500/15 text-gold-500">
          <CheckCircle2 className="h-12 w-12" strokeWidth={1.75} />
        </div>

        <span className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand-red px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white">
          {t("apply.venture.label")}
        </span>

        <h1 className="mt-4 max-w-2xl font-display text-4xl font-extrabold leading-tight text-navy sm:text-5xl">
          {t("apply.venture.success.title")}
        </h1>

        <p className="mt-5 max-w-xl text-base leading-relaxed text-navy/70 sm:text-lg">
          {t("apply.venture.success.body")}
        </p>

        {/* Next steps */}
        <div className="mt-10 grid w-full max-w-2xl gap-4 text-left sm:grid-cols-3">
          <NextStep
            number="1"
            title={t("apply.venture.success.next1Title")}
            body={t("apply.venture.success.next1Body")}
          />
          <NextStep
            number="2"
            title={t("apply.venture.success.next2Title")}
            body={t("apply.venture.success.next2Body")}
          />
          <NextStep
            number="3"
            title={t("apply.venture.success.next3Title")}
            body={t("apply.venture.success.next3Body")}
          />
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-md border border-navy/20 bg-white px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-cream-100"
          >
            {t("apply.success.backHome")}
          </Link>
          <a
            href="mailto:team@seabridge.space"
            className="text-sm font-semibold text-brand-red hover:underline"
          >
            team@seabridge.space
          </a>
        </div>
      </div>
    </main>
  );
}

function NextStep({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-cream-200 bg-white p-5">
      <span className="font-display text-xs font-bold uppercase tracking-[0.16em] text-gold-500">
        {number}
      </span>
      <h3 className="mt-1 font-display text-base font-bold text-navy">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-navy/65">{body}</p>
    </div>
  );
}