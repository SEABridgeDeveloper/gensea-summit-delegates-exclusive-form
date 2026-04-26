"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import thMessages from "@/messages/th.json"
import enMessages from "@/messages/en.json"

type Locale = "th" | "en"
type Messages = typeof thMessages

const messages: Record<Locale, Messages> = {
  th: thMessages,
  en: enMessages,
}

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, replacements?: Record<string, string>) => string
  messages: Messages
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("th")

  const t = useCallback(
    (key: string, replacements?: Record<string, string>): string => {
      const keys = key.split(".")
      let value: unknown = messages[locale]

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = (value as Record<string, unknown>)[k]
        } else {
          return key
        }
      }

      if (typeof value !== "string") {
        return key
      }

      if (replacements) {
        return Object.entries(replacements).reduce(
          (acc, [k, v]) => acc.replace(`{${k}}`, v),
          value
        )
      }

      return value
    },
    [locale]
  )

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, messages: messages[locale] }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}

export function useLocale() {
  const { locale, setLocale } = useI18n()
  return { locale, setLocale }
}

export function useTranslations() {
  const { t, messages } = useI18n()
  return { t, messages }
}
