"use client";

import { useLocale } from "@/lib/i18n/provider";
import type { FieldError } from "react-hook-form";

export function FormError({ error, min }: { error?: FieldError; min?: number }) {
  const { t } = useLocale();
  if (!error?.message) return null;

  const key = String(error.message);
  // map a few zod-style codes to translated copy; fall back to required
  const knownKeys = [
    "required",
    "invalidEmail",
    "invalidPhone",
    "contactRequired",
    "essayMin",
    "essayMax",
    "fileType",
    "fileSize",
    "instEmail",
    "consent",
    "tooShort",
    "invalid",
  ];

  const path = knownKeys.includes(key) ? `apply.errors.${key}` : "apply.errors.required";
  return (
    <p className="field-error" role="alert">
      {t(path, min !== undefined ? { min } : undefined)}
    </p>
  );
}
