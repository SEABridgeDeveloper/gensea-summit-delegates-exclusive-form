"use client";

import { useLocale } from "@/lib/i18n/provider";

export function SkipToContent() {
  const { t } = useLocale();
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-sunset-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-cream-50"
    >
      {t("nav.skipToContent")}
    </a>
  );
}
