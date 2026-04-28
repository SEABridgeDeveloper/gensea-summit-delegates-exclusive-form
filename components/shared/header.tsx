"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/provider";
import { cn } from "@/lib/cn";
import { BrandMark } from "./brand-mark";
import { LanguageToggle } from "./language-toggle";

const NAV_LINKS = [
  { href: "/#program", labelKey: "nav.program" },
  { href: "/#sectors", labelKey: "nav.sectors" },
  { href: "/#timeline", labelKey: "nav.timeline" },
];

export function Header() {
  const { t } = useLocale();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-colors",
        scrolled ? "bg-white backdrop-blur-md border-b border-navy/10" : "bg-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-navy focus:px-4 focus:py-2 focus:text-cream-50"
      >
        {t("nav.skipToContent")}
      </a>
      <div className="container-page flex items-center justify-between py-4">
        <Link href="/" aria-label="1967 home">
          <BrandMark />
        </Link>
        {/* <nav className="hidden items-center gap-20 md:flex"  aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-navy/70 transition hover:text-navy"
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </nav> */}
        <div className="flex items-center gap-3">
          <LanguageToggle />
         
        </div>
      </div>
    </header>
  );
}
