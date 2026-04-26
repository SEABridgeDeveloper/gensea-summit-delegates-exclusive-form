"use client"

import { useLocale } from "@/lib/i18n"
import { Button } from "@/components/ui/button"

export function LanguageToggle() {
  const { locale, setLocale } = useLocale()

  return (
    <div className="flex items-center rounded-full border border-cream-200 bg-cream-100 p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLocale("th")}
        className={`h-7 rounded-full px-3 text-xs font-medium transition-colors ${
          locale === "th"
            ? "bg-white text-navy-900 shadow-sm"
            : "text-navy-700 hover:text-navy-900"
        }`}
      >
        TH
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLocale("en")}
        className={`h-7 rounded-full px-3 text-xs font-medium transition-colors ${
          locale === "en"
            ? "bg-white text-navy-900 shadow-sm"
            : "text-navy-700 hover:text-navy-900"
        }`}
      >
        EN
      </Button>
    </div>
  )
}
