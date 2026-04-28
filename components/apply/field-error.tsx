"use client";

import { useLocale } from "@/lib/i18n/provider";
import type { FieldError } from "react-hook-form";

export function FormError({
  error,
  min,
}: {
  error?: Pick<FieldError, "message"> | { message?: string; type?: string };
  min?: number;
}) {
  const { t, tRaw } = useLocale();
  if (!error?.message) return null;

  const key = String(error.message);

  // Try apply.errors.<key> first; fall back to "required" if unknown.
  const candidate = tRaw<unknown>(`apply.errors.${key}`);
  const path =
    typeof candidate === "string" ? `apply.errors.${key}` : "apply.errors.required";

  return (
    <p className="field-error" role="alert">
      {t(path, min !== undefined ? { min } : undefined)}
    </p>
  );
}
