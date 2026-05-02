"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";
import { Kicker } from "../shared/kicker";

export function Hero() {
  const { t } = useLocale();

  return (
    // Full-viewport hero. `min-h-[100dvh]` uses dynamic viewport units so
    // mobile browsers don't include the address bar in the calculation.
    //
    // The /public/hero-poster.png source is large (~1.9 MB), but Next/Image
    // serves WebP/AVIF variants to browsers automatically — user-facing
    // bytes are already optimized. Repo size only.
    <section className="surface-poster relative isolate flex min-h-[100dvh] flex-col overflow-hidden">
      {/* Hero artwork already carries the diagonal triangle + sunset temple
          composition baked in, so it spans the full section. A subtle
          ink-fade gutter on the left protects headline contrast. */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src="/hero-poster.png"
          alt={t("hero.imageAlt")}
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgb(10 10 10 / 0.92) 0%, rgb(10 10 10 / 0.78) 22%, rgb(10 10 10 / 0.45) 42%, rgb(10 10 10 / 0.15) 62%, rgb(10 10 10 / 0) 80%)",
          }}
        />
        {/* Mobile: lift the bottom so headline stays readable over the artwork */}
        <div
          aria-hidden="true"
          className="absolute inset-0 lg:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgb(10 10 10 / 0.55) 0%, rgb(10 10 10 / 0.35) 50%, rgb(10 10 10 / 0.85) 100%)",
          }}
        />
      </div>

      {/* Soft sunset glow behind the headline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-24 -z-10 h-[28rem] w-[28rem] rounded-full bg-sunset-500/25 blur-[140px] animate-ember-pulse"
      />

      {/* Vertically-centered content column. Flex-1 absorbs any leftover
          height so the hero always fills the viewport without leaving a
          dead band above the scroll cue. */}
      <div className="container-page relative flex flex-1 flex-col justify-center pb-12 pt-28 sm:pt-32 lg:pt-36">
        <div className="animate-fade-up">
          <Kicker
            primary={t("hero.kicker.primary")}
            secondary={t("hero.kicker.secondary")}
            variant="default"
            showIcon={false}
            className="mb-6"
          />
        </div>

        <div
          className="max-w-3xl animate-fade-up"
          style={{ animationDelay: "120ms" }}
        >
          <h1 className="font-display font-extrabold leading-[0.95] tracking-tight">
            <span className="gradient-text-brand block text-display-xl">
              {t("hero.headlineLine1")}
            </span>
            <span className="mt-3 block text-2xl text-bone md:text-2xl xl:text-4xl">
              {t("hero.headlineLine2")}
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-bone-muted sm:text-lg">
            {t("hero.subhead")}
          </p>
        </div>

        <div
          className="mt-8 sm:mt-10 animate-fade-up"
          style={{ animationDelay: "240ms" }}
        >
          <Link
            href="#tracks"
            className="group inline-flex items-center gap-3 rounded-full bg-sunset-600 px-7 py-4 text-base font-semibold text-bone shadow-ember transition hover:bg-sunset-700 hover:-translate-y-0.5 active:translate-y-0 sm:text-lg"
          >
            {t("hero.cta.label")}
            <ArrowRight
              className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>

      {/* Scroll cue — bottom-centered, gently pulsing chevron. Reduced-motion
          users get a static chevron via the global media query. */}
      <Link
        href="#tracks"
        aria-label="Scroll to application tracks"
        className="group relative z-10 mb-6 mt-2 flex items-center justify-center self-center rounded-full text-bone-subtle transition hover:text-sunset-400 sm:mb-8"
      >
        <span className="flex flex-col items-center gap-1.5">
          <span className="text-metadata">Scroll</span>
          <ChevronDown
            className="h-5 w-5 animate-scroll-cue"
            strokeWidth={2.5}
            aria-hidden="true"
          />
        </span>
      </Link>

      {/* Gradient ribbon strip — the signature element from the bottom of the
          poster. */}
      <div className="h-2 bg-brand-gradient" aria-hidden="true" />
    </section>
  );
}
