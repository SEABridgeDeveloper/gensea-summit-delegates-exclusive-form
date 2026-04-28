"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, ChevronDown, Search, X } from "lucide-react";
import { academicSchema, type AcademicValues } from "@/lib/schemas";
import { useLocale } from "@/lib/i18n/provider";
import { FormError } from "@/components/apply/field-error";
import {
  searchUniversities,
  getUniversityById,
  universities,
} from "@/lib/data/universities";
import { getFacultiesFor } from "@/lib/data/faculties";
import { cn } from "@/lib/cn";

type Props = {
  defaultValues?: Partial<AcademicValues>;
  onValid: (values: AcademicValues) => void;
  onBack: () => void;
};

function UniversityCombobox({
  value,
  onChange,
  invalid,
}: {
  value: string;
  onChange: (id: string) => void;
  invalid?: boolean;
}) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selected = getUniversityById(value);
  const results = useMemo(() => searchUniversities(query, 16), [query]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={invalid}
        className={cn(
          "field-input flex items-center justify-between text-left",
          invalid && "border-brand-red focus:border-brand-red focus:ring-brand-red/20",
          !selected && "text-navy/40",
        )}
      >
        <span className="truncate">
          {selected ? (
            <>
              <span className="text-navy">{selected.name}</span>
              {selected.country !== "—" && (
                <span className="ml-2 text-xs text-navy/50">{selected.country}</span>
              )}
            </>
          ) : (
            t("apply.academic.fields.universityPlaceholder")
          )}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-navy/50" />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-navy/15 bg-white shadow-soft">
          <div className="flex items-center gap-2 border-b border-navy/10 px-3 py-2.5">
            <Search className="h-4 w-4 text-navy/50" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("apply.academic.fields.universityPlaceholder")}
              className="w-full bg-transparent text-sm text-navy placeholder:text-navy/40 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear"
                className="text-navy/40 hover:text-navy"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <ul role="listbox" className="max-h-72 overflow-y-auto py-1">
            {results.length === 0 && (
              <li className="px-4 py-3 text-sm text-navy/60">
                {t("apply.academic.fields.universitySearchEmpty")}
              </li>
            )}
            {results.map((u) => (
              <li key={u.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={u.id === value}
                  onClick={() => {
                    onChange(u.id);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={cn(
                    "flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition hover:bg-cream-100",
                    u.id === value && "bg-cream-100",
                  )}
                >
                  <span className="text-navy">{u.name}</span>
                  {u.country !== "—" && (
                    <span className="ml-3 shrink-0 text-xs text-navy/45">{u.country}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t border-navy/10 px-4 py-2 text-[11px] text-navy/45">
            {universities.length}+ ASEAN institutions
          </div>
        </div>
      )}
    </div>
  );
}

export function AcademicStep({ defaultValues, onValid, onBack }: Props) {
  const { t, tArray } = useLocale();
  const yearOptions = tArray("apply.academic.fields.yearOptions");

  const {
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AcademicValues>({
    resolver: zodResolver(academicSchema),
    mode: "onBlur",
    defaultValues: {
      university: "",
      faculty: "",
      yearOfStudy: "",
      gpa: "",
      ...defaultValues,
    },
  });

  const universityId = watch("university");
  const faculties = useMemo(() => getFacultiesFor(universityId), [universityId]);

  // Reset faculty when the university changes (after first render).
  const lastUniversityRef = useRef(universityId);
  useEffect(() => {
    if (lastUniversityRef.current !== universityId) {
      lastUniversityRef.current = universityId;
      setValue("faculty", "", { shouldValidate: false });
    }
  }, [universityId, setValue]);

  return (
    <form noValidate onSubmit={handleSubmit(onValid)} className="space-y-7">
      <header>
        <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">
          {t("apply.academic.heading")}
        </h2>
        <p className="mt-2 text-base text-navy/70">{t("apply.academic.subhead")}</p>
      </header>

      <div>
        <label className="field-label">
          {t("apply.academic.fields.university")} <span className="text-brand-red">*</span>
        </label>
        <Controller
          control={control}
          name="university"
          render={({ field }) => (
            <UniversityCombobox
              value={field.value}
              onChange={field.onChange}
              invalid={!!errors.university}
            />
          )}
        />
        <FormError error={errors.university} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="faculty" className="field-label">
            {t("apply.academic.fields.faculty")} <span className="text-brand-red">*</span>
          </label>
          <select
            id="faculty"
            disabled={!universityId}
            aria-required
            aria-invalid={!!errors.faculty}
            className="field-input"
            {...register("faculty")}
          >
            <option value="">
              {universityId
                ? t("apply.academic.fields.facultyPlaceholder")
                : t("apply.academic.fields.facultyDisabled")}
            </option>
            {faculties.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <FormError error={errors.faculty} />
        </div>
        <div>
          <label htmlFor="yearOfStudy" className="field-label">
            {t("apply.academic.fields.yearOfStudy")} <span className="text-brand-red">*</span>
          </label>
          <select
            id="yearOfStudy"
            aria-required
            aria-invalid={!!errors.yearOfStudy}
            className="field-input"
            {...register("yearOfStudy")}
          >
            <option value="">{t("apply.academic.fields.yearPlaceholder")}</option>
            {yearOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <FormError error={errors.yearOfStudy} />
        </div>
      </div>

      <div className="max-w-xs">
        <label htmlFor="gpa" className="field-label">
          {t("apply.academic.fields.gpa")}
        </label>
        <input
          id="gpa"
          type="text"
          inputMode="decimal"
          placeholder={t("apply.academic.fields.gpaPlaceholder")}
          className="field-input"
          {...register("gpa")}
        />
        {errors.gpa ? (
          <FormError error={errors.gpa} />
        ) : (
          <p className="field-help">{t("apply.academic.fields.gpaHelp")}</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-2">
        <button type="button" onClick={onBack} className="btn-ghost">
          <ArrowLeft className="h-4 w-4" /> {t("apply.actions.back")}
        </button>
        <button type="submit" className="btn-primary">
          {t("apply.actions.next")} <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
