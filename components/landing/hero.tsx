"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, GraduationCap, Rocket } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";
import { cn } from "@/lib/cn";
import { Kicker } from "../shared/kicker";

export function Hero() {
  const { t } = useLocale();

  return (
    <section className="relative isolate overflow-hidden bg-cream-50">
      {/* Right-side hero image — temple skyline at golden hour */}
      <div className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-full lg:w-[52%]">
        <Image
          src="https://images.unsplash.com/photo-1563492065599-3520f775eeed?q=80&w=2574&auto=format&fit=crop"
          alt={t("hero.imageAlt")}
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

      <div className="container-page relative pt-8 pb-32 sm:pt-12 lg:pt-16 lg:pb-44">
        {/* Top bar */}
        
<Kicker
  primary={t("hero.kicker.primary")}
  secondary={t("hero.kicker.secondary")}
  className="mb-6"
/>
        {/* Headline */}
        <div className="max-w-3xl">
          <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
            <span
              className="block"
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
            <span className="block text-navy">{t("hero.headlineLine2")}</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-navy/75 sm:text-lg">
            {t("hero.subhead")}
          </p>
        </div>

        {/* Single CTA — anchor jumps to the audience toggle below */}
        <div className="mt-5">
          <Link
            href="#tracks"
            className="inline-flex items-center gap-3 rounded-md bg-brand-red px-7 py-4 text-base font-semibold text-white shadow-sm transition-all hover:bg-brand-red/90 hover:shadow-md sm:text-lg"
          >
            {t("hero.cta.label")}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Red ribbon at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-12 overflow-hidden lg:h-16" aria-hidden="true">
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

type PathTone = "navy" | "red";

interface PathCardProps {
  tone: PathTone;
  kicker: string;
  icon: React.ReactNode;
  title: string;
  stat: string;
  statSub: string;
  ctaLabel: string;
  ctaHref: string;
  deadline: string;
}

function PathCard({
  tone,
  kicker,
  icon,
  title,
  stat,
  statSub,
  ctaLabel,
  ctaHref,
  deadline,
}: PathCardProps) {
  return (
    <Link
      href={ctaHref}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-white/95 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-xl sm:p-8",
        tone === "navy"
          ? "border-navy/15 hover:border-navy/40"
          : "border-brand-red/20 hover:border-brand-red/50",
      )}
    >
      <span
        className={cn(
          "absolute inset-x-0 top-0 h-1",
          tone === "navy" ? "bg-navy" : "bg-brand-red",
        )}
        aria-hidden="true"
      />

      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full",
            tone === "navy" ? "bg-navy text-white" : "bg-brand-red text-white",
          )}
        >
          {icon}
        </div>
        <span
          className={cn(
            "text-[11px] font-bold uppercase tracking-[0.16em]",
            tone === "navy" ? "text-navy/70" : "text-brand-red",
          )}
        >
          {kicker}
        </span>
      </div>

      <h3 className="mt-5 font-display text-2xl font-extrabold leading-tight text-navy sm:text-3xl">
        {title}
      </h3>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-display text-lg font-bold text-navy">{stat}</span>
        <span className="text-sm text-navy/60">{statSub}</span>
      </div>

      <div className="mt-auto pt-6">
        <div
          className={cn(
            "inline-flex items-center gap-2 text-sm font-semibold transition-transform group-hover:translate-x-1",
            tone === "navy" ? "text-navy" : "text-brand-red",
          )}
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </div>
        <div className="mt-2 text-xs text-navy/50">{deadline}</div>
      </div>
    </Link>
  );
}