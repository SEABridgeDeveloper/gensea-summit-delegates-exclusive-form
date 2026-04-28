"use client";

import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from "react-hook-form";
import { cn } from "@/lib/cn";

/**
 * Shared form primitives for the apply wizards. Designed to look identical to
 * the inline patterns the delegate flow uses, so the venture flow can reuse
 * them and stay visually consistent.
 */

export function Field({
  label,
  required,
  error,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: ReactNode;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label htmlFor={htmlFor} className="text-sm font-medium text-navy">
          {label}
          {required && <span className="ml-0.5 text-brand-red">*</span>}
        </label>
        {hint && (
          <span className="text-xs font-normal text-navy/50">{hint}</span>
        )}
      </div>
      {children}
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function FormFooter({
  primaryLabel,
  backLabel,
  canSubmit = true,
  onBack,
  submitting,
  submittingLabel,
}: {
  primaryLabel: string;
  backLabel?: string;
  canSubmit?: boolean;
  onBack?: () => void;
  submitting?: boolean;
  submittingLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between pt-2">
      {onBack && backLabel ? (
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="btn-ghost"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </button>
      ) : (
        <span />
      )}
      <button
        type="submit"
        disabled={!canSubmit || submitting}
        className={cn(
          "btn-primary",
          (!canSubmit || submitting) && "cursor-not-allowed opacity-60",
        )}
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {submittingLabel ?? primaryLabel}
          </>
        ) : (
          <>
            {primaryLabel}
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </div>
  );
}

export function YesNo<T extends FieldValues>({
  label,
  hint,
  name,
  required,
  error,
  control,
  yesLabel = "Yes",
  noLabel = "No",
}: {
  label: string;
  hint?: string;
  name: Path<T>;
  required?: boolean;
  error?: string;
  control: Control<T>;
  yesLabel?: string;
  noLabel?: string;
}) {
  // Use Controller (not register) so that the stored value is the boolean we
  // pass to onChange — register on radios stores the `value` attribute as a
  // string, which breaks `z.boolean()` validation and `if (value)` checks.
  return (
    <fieldset>
      <legend className="field-label">
        {label}
        {required && <span className="ml-0.5 text-brand-red">*</span>}
      </legend>
      {hint && <p className="field-help mb-2 mt-0">{hint}</p>}
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { v: true, l: yesLabel },
              { v: false, l: noLabel },
            ].map(({ v, l }) => (
              <label
                key={String(v)}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-navy/15 bg-white px-4 py-3 transition has-[:checked]:border-coral-500 has-[:checked]:bg-coral-500/5"
              >
                <input
                  type="radio"
                  name={field.name}
                  checked={field.value === v}
                  onChange={() => field.onChange(v)}
                  onBlur={field.onBlur}
                  className="h-4 w-4 accent-coral-500"
                />
                <span className="text-sm text-navy">{l}</span>
              </label>
            ))}
          </div>
        )}
      />
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function ConsentCheckbox<T extends FieldValues>({
  label,
  required,
  name,
  error,
  register,
}: {
  label: string;
  required?: boolean;
  name: Path<T>;
  error?: string;
  register: UseFormRegister<T>;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-navy/15 bg-white p-4">
      <input
        type="checkbox"
        {...register(name)}
        className="mt-1 h-4 w-4 flex-shrink-0 rounded accent-coral-500"
      />
      <div className="flex-1">
        <p className="text-sm leading-relaxed text-navy">
          {required && (
            <span className="mr-1 font-semibold text-brand-red">*</span>
          )}
          {label}
        </p>
        {error && (
          <p className="field-error" role="alert">
            {error}
          </p>
        )}
      </div>
    </label>
  );
}
