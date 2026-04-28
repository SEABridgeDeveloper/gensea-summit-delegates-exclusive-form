"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import en from "@/messages/en.json";
import th from "@/messages/th.json";

export type Locale = "th" | "en";

type Messages = Record<string, unknown>;

const dictionaries: Record<Locale, Messages> = { en, th };

type LocaleContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (path: string, vars?: Record<string, string | number>) => string;
  tArray: (path: string) => string[];
  tRaw: <T = unknown>(path: string) => T;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const STORAGE_KEY = "1967-locale";

function detectInitialLocale(): Locale {
  if (typeof window === "undefined") return "th";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "th") return stored;
  const browser = window.navigator.language?.toLowerCase() ?? "";
  if (browser.startsWith("en")) return "en";
  return "th";
}

function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k: string) => (vars[k] !== undefined ? String(vars[k]) : `{${k}}`));
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("th");

  useEffect(() => {
    setLocaleState(detectInitialLocale());
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
      document.documentElement.dataset.locale = locale;
    }
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, l);
    }
  }, []);

  const value = useMemo<LocaleContextValue>(() => {
    const dict = dictionaries[locale];
    return {
      locale,
      setLocale,
      t: (path, vars) => {
        const value = getByPath(dict, path);
        if (typeof value === "string") return interpolate(value, vars);
        // Fallback to other locale
        const fallback = getByPath(dictionaries[locale === "th" ? "en" : "th"], path);
        if (typeof fallback === "string") return interpolate(fallback, vars);
        return path;
      },
      tArray: (path) => {
        const value = getByPath(dict, path);
        if (Array.isArray(value)) return value as string[];
        return [];
      },
      tRaw: <T,>(path: string) => {
        return getByPath(dict, path) as T;
      },
    };
  }, [locale, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
