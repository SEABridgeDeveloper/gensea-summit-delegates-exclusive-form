"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { TrackSwitchLink } from "./audience-toggle";
import { SectionCard } from "./section-card";
import { Reveal } from "@/components/shared/reveal";

const BENEFITS: string[] = [
  "Featured in the Gen SEA Summit 2026 Venture Catalogue (part of ASEAN Youth White Paper distribution)",
  "Venture deep-dive brief — market sizing, ASEAN expansion mapping, partner-matching analysis (USD 6,000 value)",
  "Gen SEA Bootcamp (USD 1,500 standalone value, included)",
  "Accommodation for 1 founder, 2 nights (covered by KKU APDS)",
  "Day 2 closed-door access — TED Fund, NIA, regional VCs, corporate venture arms",
  "Public recognition at Gen SEA Summit Gala, 17 July evening",
];

const STEPS: { n: string; body: string }[] = [
  {
    n: "01",
    body: "Apply directly, or be nominated by your incubation center, science park, or university entrepreneurship program.",
  },
  {
    n: "02",
    body: "Submit your venture overview, sector, and (recommended) a 2-minute video pitch.",
  },
  {
    n: "03",
    body: "33 ventures selected based on founder commitment, problem clarity, ASEAN relevance, and cohort diversity.",
  },
];

const TIMELINE: { date: string; label: string }[] = [
  { date: "28 Apr", label: "Open call and institutional nominations open." },
  { date: "23 May", label: "Application and nomination deadline." },
  { date: "2 Jun", label: "Gen SEA Ventures 33 cohort publicly announced." },
  { date: "9–13 Jun", label: "Pre-summit virtual preparation session (online)." },
  { date: "14 Jul", label: "Final venture brief submitted for Catalogue." },
  { date: "17 Jul", label: "Live demo slots and Gala recognition, Day 1." },
];

export function TrackStartup() {
  return (
    <section className="surface-poster relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-32 -z-10 h-96 w-96 rounded-full bg-sunset-500/20 blur-[140px]"
      />
      <div className="container-page py-20 sm:py-28">
        <div className="mb-10">
          <TrackSwitchLink track="startup" />
        </div>

        <Reveal as="header" className="max-w-4xl">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-sunset-400">
            Apply as a Startup
          </span>
          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <h2 className="font-display text-4xl font-bold text-cream-50 sm:text-5xl">
              Gen SEA Ventures 33
            </h2>
            <Link
              href="/apply/venture"
              className="inline-flex shrink-0 items-center gap-3 self-start rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-cream-50 shadow-soft transition hover:shadow-ember sm:self-auto sm:text-base"
            >
              Apply as Startup
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <p className="mt-5 max-w-3xl text-lg text-cream-50/85 sm:text-xl">
            For youth-led early-stage ventures where at least one founder is aged 18–30 and
            graduated within 5 years.
          </p>
          <p className="mt-3 max-w-3xl text-base text-cream-50/70">
            Building in Wellness, Food, AI, Creative, or Education — across Thailand, ASEAN, or
            internationally entering ASEAN.
          </p>
        </Reveal>

        <Reveal>
        <SectionCard
          step="01"
          kicker="What you get · Total package USD 9,000+"
          title="The full Summit, fully covered."
          accent="red"
        >
          <ul className="space-y-4">
            {BENEFITS.map((b) => (
              <li
                key={b}
                className="flex gap-4 border-b border-cream-50/10 pb-4 text-base text-cream-50/85 last:border-b-0 last:pb-0"
              >
                <span
                  className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sunset-500/20 text-sunset-400 ring-1 ring-sunset-500/45"
                  aria-hidden="true"
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-cream-50/70">
            Notable ventures selected by the organizing committee are offered a live demo slot on
            the Summit&apos;s main stage.
          </p>
        </SectionCard>
        </Reveal>

        <Reveal delay={80}>
        <SectionCard
          step="02"
          kicker="How to apply"
          title="Three steps to the cohort."
          accent="red"
        >
          <ol className="space-y-6">
            {STEPS.map((s) => (
              <li key={s.n} className="flex gap-5">
                <span className="font-display text-2xl font-bold text-sunset-400" aria-hidden="true">
                  {s.n}
                </span>
                <p className="text-base text-cream-50/85">{s.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 rounded-2xl border-l-4 border-sunset-500 bg-sunset-500/10 p-5 text-base text-cream-50/85">
            <span className="font-semibold text-cream-50">For Thai ventures:</span> TED Fund and NIA
            portfolio ventures are strongly encouraged to apply through the standard pathway.
          </div>
        </SectionCard>
        </Reveal>

        <Reveal delay={160}>
        <SectionCard
          step="03"
          kicker="Timeline"
          title="Mark the dates"
          accent="red"
        >
          <div className="relative">
            <div
              className="absolute inset-x-0 top-3 hidden h-px bg-brand-gradient lg:block"
              aria-hidden="true"
            />
            <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6 lg:gap-6">
              {TIMELINE.map((t) => (
                <li
                  key={t.date}
                  className="relative flex items-start gap-4 lg:flex-col lg:items-center lg:gap-3"
                >
                  <span
                    className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-800 ring-2 ring-sunset-500"
                    aria-hidden="true"
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-sunset-500" />
                  </span>
                  <div className="lg:text-center">
                    <div className="font-display text-lg font-semibold text-cream-50">{t.date}</div>
                    <div className="mt-1 text-sm text-cream-50/75">{t.label}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </SectionCard>
        </Reveal>
      </div>
    </section>
  );
}
