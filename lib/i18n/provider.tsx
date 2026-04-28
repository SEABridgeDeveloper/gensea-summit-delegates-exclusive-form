"use client";

import { createContext, useContext, useMemo } from "react";
import en from "@/messages/en.json";

type Messages = Record<string, unknown>;

type LocaleContextValue = {
  locale: "en";
  setLocale: (l: "en") => void;
  t: (path: string, vars?: Record<string, string | number>) => string;
  tArray: (path: string) => string[];
  tRaw: <T = unknown>(path: string) => T;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

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
  return template.replace(/\{(\w+)\}/g, (_, k: string) =>
    vars[k] !== undefined ? String(vars[k]) : `{${k}}`,
  );
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo<LocaleContextValue>(() => {
    const dict = en as Messages;
    return {
      locale: "en",
      setLocale: () => {},
      t: (path, vars) => {
        const v = getByPath(dict, path);
        return typeof v === "string" ? interpolate(v, vars) : path;
      },
      tArray: (path) => {
        const v = getByPath(dict, path);
        return Array.isArray(v) ? (v as string[]) : [];
      },
      tRaw: <T,>(path: string) => getByPath(dict, path) as T,
    };
  }, []);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
