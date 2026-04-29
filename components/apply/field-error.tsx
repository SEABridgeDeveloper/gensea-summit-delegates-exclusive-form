"use client";

import { useLocale } from "@/lib/i18n/provider";

export function FormError({
  error,
  min,
}: {
  error?: { message?: string };
  min?: number;
}) {
  const { t, tRaw } = useLocale();
  if (!error?.message) return null;

  const key = String(error.message);
  // If the message is a known translation key under apply.errors, translate it.
  // Otherwise render the literal message — keeps developer-supplied messages legible.
  const translation = tRaw<unknown>(`apply.errors.${key}`);
  const text =
    typeof translation === "string"
      ? t(`apply.errors.${key}`, min !== undefined ? { min } : undefined)
      : key;

  return (
    <p className="field-error" role="alert">
      {text}
    </p>
  );
}
