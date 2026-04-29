"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";
import { Kicker } from "../shared/kicker";

export function Hero() {
  const { t } = useLocale();

  return (
    <section className="relative isolate overflow-hidden bg-cream-50">
      {/* Right-side hero image — temple skyline at golden hour. Faded on mobile so
          it doesn't compete with the headline; full opacity from lg up. */}
      <div className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-full opacity-30 lg:w-[52%] lg:opacity-100">
        <Image
          src="https://images.unsplash.com/photo-1563492065599-3520f775eeed?q=80&w=2574&auto=format&fit=crop"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 52vw"
          className="object-cover object-center"
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(250,247,240,1) 0%, rgba(250,247,240,0.92) 28%, rgba(250,247,240,0.55) 48%, rgba(250,247,240,0.15) 68%, rgba(250,247,240,0) 88%)",
          }}
        />
      </div>

      <div className="container-page relative pb-24 pt-8 sm:pt-12 lg:pb-36 lg:pt-16">
        <Kicker
          primary={t("hero.kicker.primary")}
          secondary={t("hero.kicker.secondary")}
          variant="default"
          showIcon={false}
          className="mb-6"
        />

        <div className="max-w-3xl">
          <h1 className="font-display font-extrabold leading-[0.95] tracking-tight ">
            <span
              className="gradient-text block text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem]"
              style={{
                background:
                  "linear-gradient(90deg, #C81E2D 0%, #E63946 35%, #F26B3A 70%, #F59E2D 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {t("hero.headlineLine1")}
            </span>
            <span className="block text-navy mt-2 text-2xl md:text-2xl xl:text-4xl ">{t("hero.headlineLine2")}</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-navy/85 sm:text-lg">
            {t("hero.subhead")}
          </p>
        </div>

        <div className="mt-8 sm:mt-10">
          <Link
            href="#tracks"
            className="inline-flex items-center gap-3 rounded-full bg-brand-red px-7 py-4 text-base font-semibold text-cream-50 shadow-soft transition hover:bg-brand-redDark sm:text-lg"
          >
            {t("hero.cta.label")}
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Red ribbon at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-8 overflow-hidden lg:h-12" aria-hidden="true">
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <path
            d="M0,40 C240,80 480,0 720,30 C960,60 1200,10 1440,40 L1440,80 L0,80 Z"
            fill="#E63946"
            opacity="0.95"
          />
          <path
            d="M0,50 C240,90 480,10 720,40 C960,70 1200,20 1440,50 L1440,80 L0,80 Z"
            fill="#C81E2D"
          />
        </svg>
      </div>
    </section>
  );
}
