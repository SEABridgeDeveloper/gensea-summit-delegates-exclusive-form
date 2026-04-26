"use client"

import { useLocale } from "@/lib/i18n"
import { Button } from "@/components/ui/button"

export function LanguageToggle() {
  const { locale, setLocale } = useLocale()

  return (
    <div className="flex items-center rounded-full border border-border bg-muted p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLocale("th")}
        className={`h-7 rounded-full px-3 text-xs font-medium transition-colors ${
          locale === "th"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
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
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </Button>
    </div>
  )
}
