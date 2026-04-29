"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";
import Image from "next/image";

const SPONSORSHIP_URL = "https://genseasummit.seabridge.space";

export function ThemeSection() {
  const { t } = useLocale();

  return (
    <section className="bg-cream-100">
      <div className="container-page grid gap-10 py-20 sm:py-28 lg:grid-cols-[1fr_1.4fr] lg:items-start lg:gap-16">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-navy/75">
            {t("theme.kicker")}
          </span>
          <h2
            className="gradient-text mt-4 font-display text-4xl font-bold sm:text-5xl"
            style={{
              background:
                "linear-gradient(90deg, #C81E2D 0%, #E63946 35%, #F26B3A 70%, #F59E2D 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {t("theme.heading")}
          </h2>
          <Image
            src="/genseasummit-logo.png"
            width={400}
            height={400}
            alt=""
            aria-hidden="true"
            className="mt-8 h-48 w-auto lg:h-64"
          />
        </div>

        <div className="space-y-6">
          <p className="text-lg text-navy/85 sm:text-xl">{t("theme.body")}</p>

          <div className="border-t border-navy/10 pt-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-navy/75">
              {t("theme.sponsor.kicker")}
            </p>
            <blockquote className="mt-3 border-l-4 border-coral-500 pl-5 font-display text-lg text-navy">
              <p className="text-base text-navy/85">{t("theme.sponsor.body")}</p>
            </blockquote>
            <Link
              href={SPONSORSHIP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t("theme.sponsor.cta")} (opens in new tab)`}
              className="group mt-4 inline-flex items-center gap-2 text-base font-semibold text-coral-700 transition hover:text-coral-800"
            >
              {t("theme.sponsor.cta")}
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
