"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandMark } from "./brand-mark";

/**
 * Landing header — mirrors the structure of the apply pages so the
 * shell feels consistent across the whole site:
 *
 *   sticky · ink/90 · bone-hairline border · backdrop-blur
 *   ┌──────────────┐                          ┌─────────┐
 *   │  BrandMark   │                          │  Apply  │
 *   └──────────────┘                          └─────────┘
 *
 * The Apply pill jumps to #tracks (the audience toggle) instead of
 * pretending to be a multi-link nav — there's no real navigation on
 * a single-page landing.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-bone-hairline bg-ink/85 backdrop-blur-md">
      <div className="container-page flex items-center justify-between py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-3"
          aria-label="Gen SEA Summit home"
        >
          <BrandMark />
        </Link>
        <Link
          href="#tracks"
          className="group inline-flex items-center gap-2 rounded-full border border-sunset-500/40 bg-sunset-500/10 px-4 py-2 text-sm font-semibold text-sunset-400 transition hover:border-sunset-500/70 hover:bg-sunset-500/20 hover:text-sunset-300 sm:px-5"
        >
          Apply
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </header>
  );
}
