"use client";

import Link from "next/link";
import { Check, Home, Mail } from "lucide-react";
import { BrandMark } from "@/components/shared/brand-mark";

const ADVISOR_LETTER_DEADLINE = "22 May 2026";

export default function IndividualSuccessPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <header className="border-b border-navy/10 bg-cream-50/80 backdrop-blur">
        <div className="container-page flex items-center justify-between py-4">
          <Link href="/" className="inline-flex items-center gap-3">
            <BrandMark />
          </Link>
        </div>
      </header>

      <main className="container-page max-w-2xl pb-32 pt-20 sm:pt-28">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-coral-500/15 text-coral-600">
            <Check className="h-7 w-7" strokeWidth={2.4} />
          </span>
          <div>
            <h1 className="font-display text-4xl font-bold text-navy sm:text-5xl">
              Application received.
            </h1>
            <p className="mt-3 text-lg text-navy/75">
              You&apos;re in the Gen SEA Bootcamp. Top 50 selection happens after the Capstone.
            </p>
          </div>

          <div className="mt-2 w-full rounded-2xl border border-navy/10 bg-white p-6 shadow-soft">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-coral-600">
              What happens next
            </h2>
            <ul className="mt-4 space-y-4 text-sm text-navy">
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-coral-500" />
                <div>
                  <strong className="block text-navy">Bootcamp access — sent to your inbox</strong>
                  <span className="text-navy/70">
                    A confirmation email with your Gen SEA Bootcamp (GVP) enrollment link and Team
                    Flow workspace invite is on its way.
                  </span>
                </div>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-coral-500" />
                <div>
                  <strong className="block text-navy">Advisor letter — they&apos;ll get a private link</strong>
                  <span className="text-navy/70">
                    We&apos;ve emailed your advisor a unique upload link. They have until{" "}
                    <strong className="text-navy">{ADVISOR_LETTER_DEADLINE}</strong> to submit the
                    recommendation letter.
                  </span>
                </div>
              </li>
              <li className="flex gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-coral-500" />
                <div>
                  <strong className="block text-navy">Bootcamp Capstone — 6 June</strong>
                  <span className="text-navy/70">
                    Top 50 Delegates announced 7 June. Block out 16–18 July in Khon Kaen, just in
                    case.
                  </span>
                </div>
              </li>
            </ul>
          </div>

          <Link href="/" className="btn-primary mt-2">
            <Home className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
