"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";
import { Reveal } from "@/components/shared/reveal";

const SPONSORSHIP_URL = "https://genseasummit.seabridge.space";

/**
 * Theme manifesto.
 *
 * Surfaces `theme.body` (the Climate-conflict-capital paragraph already
 * in en.json) and `theme.pull` — a strong pull quote that was prepared
 * in i18n but never rendered before this redesign. The sponsor link is
 * demoted to a small footer-style row at the bottom of the section so
 * its institutional tone doesn't interrupt the manifesto register.
 */
export function ThemeSection() {
  const { t } = useLocale();

  return (
    <section className="surface-poster relative isolate overflow-hidden">
      <div className="gradient-strip" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-10 -z-10 h-96 w-96 rounded-full bg-sunset-500/20 blur-[120px]"
      />

      <div className="container-page py-20 sm:py-28 lg:py-32">
        <Reveal className="max-w-2xl">
          <span className="eyebrow">{t("theme.kicker")}</span>
          <h2 className="gradient-text-brand mt-4 font-display text-display">
            {t("theme.heading")}
          </h2>
        </Reveal>

        <Reveal
          delay={120}
          className="mt-10 grid gap-12 lg:mt-14 lg:grid-cols-[1.1fr_1fr] lg:gap-16"
        >
          <p className="max-w-xl text-lg leading-relaxed text-bone-muted sm:text-xl">
            {t("theme.body")}
          </p>

          {/* Pull quote — previously unrendered. The poster's voice. */}
          <figure className="relative pl-6 sm:pl-8">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1 rounded-full bg-brand-gradient"
            />
            <blockquote>
              <p className="font-display text-2xl leading-snug text-bone sm:text-3xl">
                {t("theme.pull")}
              </p>
            </blockquote>
          </figure>
        </Reveal>

        {/* Demoted sponsor row — small, footer-style. */}
        <Reveal delay={200} className="mt-16 border-t border-bone-hairline pt-6 sm:mt-20">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow">{t("theme.sponsor.kicker")}</p>
              <p className="mt-1 max-w-xl text-sm text-bone-muted">
                {t("theme.sponsor.body")}
              </p>
            </div>
            <Link
              href={SPONSORSHIP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t("theme.sponsor.cta")} (opens in new tab)`}
              className="group inline-flex shrink-0 items-center gap-2 self-start text-sm font-semibold text-sunset-400 transition hover:text-sunset-300 sm:self-auto"
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
