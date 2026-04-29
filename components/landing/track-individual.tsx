"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { TrackSwitchLink } from "./audience-toggle";
import { SectionCard } from "./section-card";

const BENEFITS: string[] = [
  "Ticket to 3 days at Gen SEA Summit 2026, Khon Kaen",
  "Room with 350+ founders, investors, and ministers from 10+ countries",
  "Gen SEA Bootcamp — USD 1,500 standalone value, included",
  "Scholarships up to 100% of the USD 300 Delegate Pass",
  "Fast-track to SEA Bridge Fellowships and partner internships",
  "Khon Kaen during Isan Creative Festival 2026",
];

const STEPS: { n: string; body: string }[] = [
  {
    n: "01",
    body: "Apply directly, or be nominated by your university (up to 10 ranked) or faculty (up to 5 ranked).",
  },
  { n: "02", body: "Complete the Gen SEA Bootcamp." },
  { n: "03", body: "Top 50 selected on Bootcamp Capstone + application strength." },
];

const TIMELINE: { date: string; label: string }[] = [
  { date: "28 Apr", label: "Applications & nominations open. Bootcamp begins immediately." },
  { date: "15 May", label: "Application & nomination deadline." },
  { date: "16 May – 5 Jun", label: "Gen SEA Bootcamp." },
  { date: "6 Jun", label: "Bootcamp Capstone submission due." },
  { date: "7 Jun", label: "50 Delegates announced." },
  { date: "16–18 Jul", label: "Gen SEA Summit 2026, Khon Kaen." },
];

export function TrackIndividual() {
  return (
    <section className="bg-cream-100">
      <div className="container-page py-20 sm:py-28">
        <div className="mb-10">
          <TrackSwitchLink track="individual" />
        </div>

        <header className="max-w-4xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-coral-700">
            Apply as an Individual
          </span>
          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <h2 className="font-display text-4xl font-bold text-navy sm:text-5xl">
              Gen SEA Delegates 2026
            </h2>
            <Link
              href="/apply/delegate"
              className="inline-flex shrink-0 items-center gap-3 self-start rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-cream-50 shadow-soft transition hover:bg-brand-redDark sm:self-auto sm:text-base"
            >
              Apply as Individual
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <p className="mt-5 max-w-3xl text-lg text-navy/85 sm:text-xl">
            For students and recent graduates, ages 18–30, motivated to understand how ventures are
            built and scaled in ASEAN — whether or not they have a startup of their own.
          </p>
          <p className="mt-3 text-base font-semibold text-coral-700">No startup required.</p>
        </header>

        <SectionCard
          step="01"
          kicker="What you get"
          title="The full Summit, fully covered."
          accent="coral"
        >
          <ul className="space-y-4">
            {BENEFITS.map((b) => (
              <li
                key={b}
                className="flex gap-4 border-b border-navy/10 pb-4 text-base text-navy/85 last:border-b-0 last:pb-0"
              >
                <span
                  className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-coral-500/15 text-coral-700"
                  aria-hidden="true"
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          step="02"
          kicker="How to win your seat"
          title="Three steps. No tricks."
          accent="coral"
        >
          <ol className="space-y-6">
            {STEPS.map((s) => (
              <li key={s.n} className="flex gap-5">
                <span className="font-display text-2xl font-bold text-coral-700" aria-hidden="true">
                  {s.n}
                </span>
                <p className="text-base text-navy/85">{s.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 rounded-2xl border-l-4 border-coral-500 bg-cream-100 p-5 text-base text-navy/85">
            Nomination prioritizes your application — it does not guarantee selection.
          </div>
        </SectionCard>

        <SectionCard
          step="03"
          kicker="Timeline"
          title="Mark the dates"
          accent="coral"
        >
          <div className="relative">
            <div
              className="absolute inset-x-0 top-3 hidden h-px bg-gold-500 lg:block"
              aria-hidden="true"
            />
            <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6 lg:gap-6">
              {TIMELINE.map((t) => (
                <li
                  key={t.date}
                  className="relative flex items-start gap-4 lg:flex-col lg:items-center lg:gap-3"
                >
                  <span
                    className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white ring-2 ring-gold-500"
                    aria-hidden="true"
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-gold-500" />
                  </span>
                  <div className="lg:text-center">
                    <div className="font-display text-lg font-semibold text-navy">{t.date}</div>
                    <div className="mt-1 text-sm text-navy/75">{t.label}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </SectionCard>
      </div>
    </section>
  );
}
