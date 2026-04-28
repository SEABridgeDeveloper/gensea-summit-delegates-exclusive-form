"use client";

import { useLocale } from "@/lib/i18n/provider";
import { cn } from "@/lib/cn";

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      role="group"
      aria-label={t("languageToggle.label")}
      className={cn(
        "inline-flex items-center rounded-full border border-navy/15 bg-cream-50 p-1 text-xs font-semibold tracking-wide",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setLocale("th")}
        aria-pressed={locale === "th"}
        className={cn(
          "rounded-full px-3 py-1.5 transition",
          locale === "th" ? "bg-navy text-cream-50 shadow-sm" : "text-navy/60 hover:text-navy",
        )}
      >
        {t("languageToggle.th")}
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={cn(
          "rounded-full px-3 py-1.5 transition",
          locale === "en" ? "bg-navy text-cream-50 shadow-sm" : "text-navy/60 hover:text-navy",
        )}
      >
        {t("languageToggle.en")}
      </button>
    </div>
  );
}
