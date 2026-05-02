"use client";

import Link from "next/link";
import { CalendarCheck, Check, FileText, Home, Mail } from "lucide-react";
import { BrandMark } from "@/components/shared/brand-mark";

export default function StartupSuccessPage() {
  return (
    <div className="min-h-screen bg-ink">
      <header className="sticky top-0 z-40 border-b border-bone-hairline bg-ink/90 backdrop-blur">
        <div className="container-page flex items-center justify-between py-4">
          <Link href="/" aria-label="Gen SEA Summit home">
            <BrandMark />
          </Link>
        </div>
      </header>

      <main
        id="main"
        className="container-page flex max-w-2xl flex-col items-start gap-6 pb-32 pt-16 sm:pt-24"
      >
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-sunset-500/15 text-sunset-400 ring-1 ring-sunset-500/40">
          <Check className="h-7 w-7" strokeWidth={2.4} aria-hidden="true" />
        </span>

        <div>
          <span className="eyebrow">Apply as a Startup</span>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-bone sm:text-4xl">
            Application received.
          </h1>
          <p className="mt-3 text-lg text-bone-muted">
            You&apos;re in the Gen SEA Bootcamp. The 33 cohort is announced 2 June 2026.
          </p>
        </div>

        <div className="w-full overflow-hidden rounded-2xl border border-sunset-500/20 bg-ink-elevated p-6 shadow-ink">
          <h2 className="eyebrow">What happens next</h2>
          <ul className="mt-4 space-y-4 text-sm text-bone">
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-sunset-400" aria-hidden="true" />
              <div>
                <strong className="block text-bone">Bootcamp access — sent to your inbox</strong>
                <span className="text-bone-muted">
                  A confirmation email with your Gen SEA Bootcamp (GVP) enrollment link and Team
                  Flow workspace invite is on its way.
                </span>
              </div>
            </li>
            <li className="flex gap-3">
              <CalendarCheck className="mt-0.5 h-4 w-4 shrink-0 text-sunset-400" aria-hidden="true" />
              <div>
                <strong className="block text-bone">Cohort announcement — 2 June</strong>
                <span className="text-bone-muted">
                  Selected ventures receive onboarding details for the pre-summit prep session
                  (9–13 June).
                </span>
              </div>
            </li>
            <li className="flex gap-3">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-sunset-400" aria-hidden="true" />
              <div>
                <strong className="block text-bone">Catalogue brief — due 14 July</strong>
                <span className="text-bone-muted">
                  Final venture brief for the Summit Catalogue. Live demo slots and Gala recognition
                  on Day 1, 17 July.
                </span>
              </div>
            </li>
          </ul>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-4">
          <Link href="/" className="btn-primary">
            <Home className="h-4 w-4" aria-hidden="true" /> Back to home
          </Link>
          <a
            href="mailto:team@seabridge.space"
            aria-label="Email team@seabridge.space"
            className="text-sm font-semibold text-sunset-400 hover:text-sunset-300"
          >
            team@seabridge.space
          </a>
        </div>
      </main>
    </div>
  );
}
