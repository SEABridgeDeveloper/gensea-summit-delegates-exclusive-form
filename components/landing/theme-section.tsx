"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";
import Image from "next/image";
import { Reveal } from "@/components/shared/reveal";

const SPONSORSHIP_URL = "https://genseasummit.seabridge.space";

export function ThemeSection() {
  const { t } = useLocale();

  return (
    // Poster-style ink section: dark surface, sunset spotlight, gradient seam.
    <section className="surface-poster relative isolate overflow-hidden">
      <div className="gradient-strip" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-10 -z-10 h-96 w-96 rounded-full bg-sunset-500/20 blur-[120px]"
      />
      <div className="container-page grid gap-10 py-20 sm:py-28 lg:grid-cols-[1fr_1.4fr] lg:items-start lg:gap-16">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-sunset-400">
            {t("theme.kicker")}
          </span>
          <h2 className="gradient-text-brand mt-4 font-display text-4xl font-bold sm:text-5xl">
            {t("theme.heading")}
          </h2>
          <Image
            src="/genseasummit-logo.png"
            width={400}
            height={400}
            alt=""
            aria-hidden="true"
            className="mt-8 h-48 w-auto opacity-95 lg:h-64"
          />
        </Reveal>

        <Reveal delay={120} className="space-y-6">
          <p className="text-lg text-cream-50/85 sm:text-xl">{t("theme.body")}</p>

          <div className="border-t border-cream-50/15 pt-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sunset-400">
              {t("theme.sponsor.kicker")}
            </p>
            <blockquote className="mt-3 border-l-4 border-sunset-500 pl-5 font-display text-lg text-cream-50">
              <p className="text-base text-cream-50/85">{t("theme.sponsor.body")}</p>
            </blockquote>
            <Link
              href={SPONSORSHIP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t("theme.sponsor.cta")} (opens in new tab)`}
              className="group mt-4 inline-flex items-center gap-2 text-base font-semibold text-sunset-400 transition hover:text-sunset-300"
            >
              {t("theme.sponsor.cta")}
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </Reveal>
      </div>
      <div className="gradient-strip" aria-hidden="true" />
    </section>
  );
}
