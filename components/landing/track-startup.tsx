"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { TrackSwitchLink } from "./audience-toggle";
import { SectionCard } from "./section-card";
import { Reveal } from "@/components/shared/reveal";
import { useLocale } from "@/lib/i18n/provider";

type Step = { n: string; body: string };
type TimelineEntry = { date: string; label: string };

export function TrackStartup() {
  const { t, tArray, tRaw } = useLocale();
  const benefits = tArray("tracks.startup.benefits");
  const steps = tRaw<Step[]>("tracks.startup.steps") ?? [];
  const timeline = tRaw<TimelineEntry[]>("tracks.startup.timeline") ?? [];

  return (
    <section
      id="track-panel-startup"
      role="tabpanel"
      aria-labelledby="track-tab-startup"
      className="surface-poster relative isolate overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-32 -z-10 h-96 w-96 rounded-full bg-sunset-500/20 blur-[140px]"
      />
      <div className="container-page py-20 sm:py-28">
        <Reveal as="header" className="max-w-4xl">
          <span className="eyebrow">{t("tracks.startup.eyebrow")}</span>
          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <h2 className="font-display text-4xl font-bold text-bone sm:text-5xl">
              {t("tracks.startup.heading")}
            </h2>
            <Link
              href="/apply/venture"
              className="inline-flex shrink-0 items-center gap-3 self-start rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-bone shadow-soft transition hover:shadow-ember sm:self-auto sm:text-base"
            >
              {t("tracks.startup.cta")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <p className="mt-5 max-w-3xl text-lg text-bone-muted sm:text-xl">
            {t("tracks.startup.subhead")}
          </p>
          <p className="mt-3 max-w-3xl text-base text-bone-subtle">
            {t("tracks.startup.tag")}
          </p>
        </Reveal>

        <Reveal>
          <SectionCard
            step="01"
            kicker={t("tracks.startup.benefitsKicker")}
            title={t("tracks.startup.benefitsTitle")}
          >
            <ul className="space-y-4">
              {benefits.map((b) => (
                <li
                  key={b}
                  className="flex gap-4 border-b border-bone-hairline pb-4 text-base text-bone-muted last:border-b-0 last:pb-0"
                >
                  <span className="check-halo" aria-hidden="true">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-bone-subtle">
              {t("tracks.startup.benefitsFootnote")}
            </p>
          </SectionCard>
        </Reveal>

        <Reveal delay={80}>
          <SectionCard
            step="02"
            kicker={t("tracks.startup.stepsKicker")}
            title={t("tracks.startup.stepsTitle")}
          >
            <ol className="space-y-6">
              {steps.map((s) => (
                <li key={s.n} className="flex gap-5">
                  <span
                    className="font-display text-2xl font-bold text-sunset-400"
                    aria-hidden="true"
                  >
                    {s.n}
                  </span>
                  <p className="text-base text-bone-muted">{s.body}</p>
                </li>
              ))}
            </ol>
          </SectionCard>
        </Reveal>

        <Reveal delay={160}>
          <SectionCard
            step="03"
            kicker={t("tracks.startup.timelineKicker")}
            title={t("tracks.startup.timelineTitle")}
          >
            <div className="relative">
              <div
                className="absolute inset-x-0 top-3 hidden h-px bg-brand-gradient lg:block"
                aria-hidden="true"
              />
              <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6 lg:gap-6">
                {timeline.map((entry) => (
                  <li
                    key={entry.date}
                    className="relative flex items-start gap-4 lg:flex-col lg:items-center lg:gap-3"
                  >
                    <span
                      className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-elevated ring-2 ring-sunset-500"
                      aria-hidden="true"
                    >
                      <span className="h-2.5 w-2.5 rounded-full bg-sunset-500" />
                    </span>
                    <div className="lg:text-center">
                      <div className="font-display text-lg font-semibold text-bone">
                        {entry.date}
                      </div>
                      <div className="mt-1 text-sm text-bone-subtle">{entry.label}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </SectionCard>
        </Reveal>

        {/* Fine-print + track-switch at the bottom — same content as before
            but no longer interrupting the persuasion flow. */}
        <Reveal delay={240} className="mt-10 space-y-6">
          <div className="callout">{t("tracks.startup.stepsNote")}</div>
          <div className="border-t border-bone-hairline pt-6">
            <TrackSwitchLink track="startup" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
