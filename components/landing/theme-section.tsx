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
          <h2 className="mt-4 font-display text-4xl font-bold text-navy sm:text-5xl" style={{
                background:
                  "linear-gradient(90deg, #C81E2D 0%, #E63946 35%, #F26B3A 70%, #F59E2D 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}>
            {t("theme.heading")}
          </h2>
          <Image src="/genseasummit-logo.png" width={100} height={100} className="h-[30vh] w-auto" alt=""/>
          
        </div>

        <div className="space-y-6">
          <p className="text-lg text-navy/80 sm:text-xl">{t("theme.body")}</p>

    

          {/* Sponsorship CTA */}
          
          <div className="border-t border-navy/10 pt-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-navy/60">
              {t("theme.sponsor.kicker")}
            </p>
            <blockquote className="border-l-4 border-coral-500 pl-5 font-display text-xl text-navy sm:text-2xl">
            <p className="mt-2 text-base text-navy/75 sm:text-lg">
              {t("theme.sponsor.body")}
            </p>
            </blockquote>
            <Link
              href={SPONSORSHIP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 inline-flex items-center gap-2 text-base font-semibold text-coral-600 transition-colors hover:text-coral-700"
            >
              {t("theme.sponsor.cta")}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
          
        </div>
      </div>
    </section>
  );
}