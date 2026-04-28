"use client";

import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, FileText, Upload } from "lucide-react";
import { recommenderSchema, type RecommenderValues } from "@/lib/schemas";
import { useLocale } from "@/lib/i18n/provider";
import { FormError } from "@/components/apply/field-error";

type Props = {
  defaultValues?: Partial<RecommenderValues> & { letterName?: string };
  onValid: (values: RecommenderValues) => void;
  onBack: () => void;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function RecommenderStep({ defaultValues, onValid, onBack }: Props) {
  const { t, tArray } = useLocale();
  const titleOptions = tArray("apply.recommender.fields.titleOptions");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileMeta, setFileMeta] = useState<{ name: string; size: number } | null>(
    defaultValues?.letterName
      ? { name: defaultValues.letterName, size: (defaultValues as { letterSize?: number }).letterSize ?? 0 }
      : null,
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RecommenderValues>({
    resolver: zodResolver(recommenderSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      title: "",
      email: "",
      letter: undefined,
      ...defaultValues,
    },
  });

  return (
    <form noValidate onSubmit={handleSubmit(onValid)} className="space-y-7">
      <header>
        <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">
          {t("apply.recommender.heading")}
        </h2>
        <p className="mt-2 text-base text-navy/70">{t("apply.recommender.subhead")}</p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="recName" className="field-label">
            {t("apply.recommender.fields.name")} <span className="text-brand-red">*</span>
          </label>
          <input
            id="recName"
            type="text"
            aria-required
            aria-invalid={!!errors.name}
            placeholder={t("apply.recommender.fields.namePlaceholder")}
            className="field-input"
            {...register("name")}
          />
          <FormError error={errors.name} />
        </div>
        <div>
          <label htmlFor="recTitle" className="field-label">
            {t("apply.recommender.fields.title")} <span className="text-brand-red">*</span>
          </label>
          <select
            id="recTitle"
            aria-required
            aria-invalid={!!errors.title}
            className="field-input"
            {...register("title")}
          >
            <option value="">{t("apply.recommender.fields.titlePlaceholder")}</option>
            {titleOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <FormError error={errors.title} />
        </div>
      </div>

      <div>
        <label htmlFor="recEmail" className="field-label">
          {t("apply.recommender.fields.email")} <span className="text-brand-red">*</span>
        </label>
        <input
          id="recEmail"
          type="email"
          inputMode="email"
          aria-required
          aria-invalid={!!errors.email}
          placeholder={t("apply.recommender.fields.emailPlaceholder")}
          className="field-input"
          {...register("email")}
        />
        {errors.email ? (
          <FormError error={errors.email} />
        ) : (
          <p className="field-help">{t("apply.recommender.fields.emailHelp")}</p>
        )}
      </div>

      <div>
        <label className="field-label">
          {t("apply.recommender.fields.letter")} <span className="text-brand-red">*</span>
        </label>
        <Controller
          control={control}
          name="letter"
          render={({ field }) => (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  field.onChange(file);
                  setFileMeta(file ? { name: file.name, size: file.size } : null);
                }}
              />
              <div className="flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-navy/20 bg-cream-100/40 p-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-ghost"
                >
                  <Upload className="h-4 w-4" />
                  {fileMeta
                    ? t("apply.recommender.fields.letterReplace")
                    : t("apply.recommender.fields.letterCta")}
                </button>
                {fileMeta ? (
                  <span className="inline-flex items-center gap-2 text-sm text-navy">
                    <FileText className="h-4 w-4 text-coral-600" />
                    <span className="font-medium">{fileMeta.name}</span>
                    {fileMeta.size > 0 && (
                      <span className="text-navy/50">· {formatBytes(fileMeta.size)}</span>
                    )}
                  </span>
                ) : (
                  <span className="text-sm text-navy/50">
                    {t("apply.recommender.fields.letterEmpty")}
                  </span>
                )}
              </div>
            </div>
          )}
        />
        <FormError error={errors.letter as never} />
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
