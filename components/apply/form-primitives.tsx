"use client";

import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import {
  cloneElement,
  isValidElement,
  useId,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from "react-hook-form";
import { cn } from "@/lib/cn";
import { FormError } from "./field-error";

/**
 * Field — wraps a single input with a properly-associated <label htmlFor>.
 * Auto-generates an id via useId() when the caller doesn't pass one and
 * clones the child input to inject the id, so screen readers always pair
 * the label with the input.
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
  const autoId = useId();
  const id = htmlFor ?? autoId;

  // Inject id into the first valid React element child if it doesn't already have one.
  let injectedChildren: ReactNode = children;
  if (isValidElement(children)) {
    const childEl = children as ReactElement<{ id?: string; "aria-invalid"?: boolean }>;
    if (!childEl.props.id) {
      injectedChildren = cloneElement(childEl, {
        id,
        "aria-invalid": error ? true : childEl.props["aria-invalid"],
      });
    }
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-navy">
          {label}
          {required && (
            <span className="ml-0.5 text-brand-red" aria-hidden="true">
              *
            </span>
          )}
          {required && <span className="sr-only"> (required)</span>}
        </label>
        {hint && <span className="text-xs font-normal text-navy/70">{hint}</span>}
      </div>
      {injectedChildren}
      {error && <FormError error={{ message: error }} />}
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
  helper,
}: {
  primaryLabel: string;
  backLabel?: string;
  canSubmit?: boolean;
  onBack?: () => void;
  submitting?: boolean;
  submittingLabel?: string;
  helper?: ReactNode;
}) {
  return (
    <div className="flex flex-col-reverse gap-4 border-t border-navy/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
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
        ) : null}
        {helper && <span className="text-xs text-navy/70">{helper}</span>}
      </div>
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
  return (
    <fieldset>
      <legend className="field-label">
        {label}
        {required && (
          <span className="ml-0.5 text-brand-red" aria-hidden="true">
            *
          </span>
        )}
        {required && <span className="sr-only"> (required)</span>}
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
                data-checked={field.value === v ? "true" : undefined}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-navy/20 bg-white px-4 py-3 transition has-[:checked]:border-coral-500 has-[:checked]:bg-coral-500/5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-coral-500 has-[:focus-visible]:ring-offset-2"
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
      {error && <FormError error={{ message: error }} />}
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
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-navy/20 bg-white p-4 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-coral-500 has-[:focus-visible]:ring-offset-2">
      <input
        type="checkbox"
        aria-required={required}
        {...register(name)}
        className="mt-1 h-4 w-4 flex-shrink-0 rounded accent-coral-500"
      />
      <div className="flex-1">
        <p className="text-sm leading-relaxed text-navy">
          {required && (
            <span className="mr-1 font-semibold text-brand-red" aria-hidden="true">
              *
            </span>
          )}
          {label}
          {required && <span className="sr-only"> (required)</span>}
        </p>
        {error && <FormError error={{ message: error }} />}
      </div>
    </label>
  );
}
