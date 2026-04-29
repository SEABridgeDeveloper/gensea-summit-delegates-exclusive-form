"use client";

import Link from "next/link";
import { CalendarCheck, Check, Home, Mail, UserCheck } from "lucide-react";
import { BrandMark } from "@/components/shared/brand-mark";

const ADVISOR_LETTER_DEADLINE = "22 May 2026";

export default function IndividualSuccessPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <header className="sticky top-0 z-40 border-b border-navy/10 bg-cream-50/90 backdrop-blur">
        <div className="container-page flex items-center justify-between py-4">
          <Link href="/" aria-label="Gen SEA Summit home">
            <BrandMark />
          </Link>
        </div>
      </header>

      <main id="main" className="container-page max-w-2xl pb-32 pt-16 sm:pt-24">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-coral-500/15 text-coral-700">
            <Check className="h-7 w-7" strokeWidth={2.4} aria-hidden="true" />
          </span>
          <div>
            <h1 className="font-display text-3xl font-bold text-navy sm:text-4xl">
              Application received.
            </h1>
            <p className="mt-3 text-lg text-navy/85">
              You&apos;re in the Gen SEA Bootcamp. Top 50 selection happens after the Capstone.
            </p>
          </div>

          <div className="mt-2 w-full rounded-2xl border border-navy/10 bg-white p-6 shadow-soft">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-coral-700">
              What happens next
            </h2>
            <ul className="mt-4 space-y-4 text-sm text-navy">
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-coral-700" aria-hidden="true" />
                <div>
                  <strong className="block text-navy">Bootcamp access — sent to your inbox</strong>
                  <span className="text-navy/75">
                    A confirmation email with your Gen SEA Bootcamp (GVP) enrollment link and Team
                    Flow workspace invite is on its way.
                  </span>
                </div>
              </li>
              <li className="flex gap-3">
                <UserCheck className="mt-0.5 h-4 w-4 shrink-0 text-coral-700" aria-hidden="true" />
                <div>
                  <strong className="block text-navy">
                    Advisor letter — they&apos;ll get a private link
                  </strong>
                  <span className="text-navy/75">
                    We&apos;ve emailed your advisor a unique upload link. They have until{" "}
                    <strong className="text-navy">{ADVISOR_LETTER_DEADLINE}</strong> to submit the
                    recommendation letter.
                  </span>
                </div>
              </li>
              <li className="flex gap-3">
                <CalendarCheck
                  className="mt-0.5 h-4 w-4 shrink-0 text-coral-700"
                  aria-hidden="true"
                />
                <div>
                  <strong className="block text-navy">Bootcamp Capstone — 6 June</strong>
                  <span className="text-navy/75">
                    Top 50 Delegates announced 7 June. Block out 16–18 July in Khon Kaen, just in
                    case.
                  </span>
                </div>
              </li>
            </ul>
          </div>

          <Link href="/" className="btn-primary mt-2">
            <Home className="h-4 w-4" aria-hidden="true" /> Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
