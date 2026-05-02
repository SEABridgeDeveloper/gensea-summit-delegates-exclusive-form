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
        
      </div>
    </header>
  );
}
