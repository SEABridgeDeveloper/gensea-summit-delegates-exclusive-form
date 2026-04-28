"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, FileText, X } from "lucide-react";

import { useLocale } from "@/lib/i18n/provider";
import { cn } from "@/lib/cn";
import { documentsSchema, type DocumentsValues } from "@/lib/schemas";
import { Field, FormFooter } from "@/components/apply/form-primitives";

interface Props {
  defaultValues?: Partial<DocumentsValues>;
  onNext: (values: DocumentsValues) => void;
  onBack: () => void;
}

const MAX_DECK_SIZE = 10 * 1024 * 1024;

function countWords(s: string) {
  return s.trim() ? s.trim().split(/\s+/).length : 0;
}

export function DocumentsStep({ defaultValues, onNext, onBack }: Props) {
  const { t } = useLocale();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<DocumentsValues>({
    resolver: zodResolver(documentsSchema),
    mode: "onBlur",
    defaultValues,
  });

  const pitchDeck = watch("pitchDeck") as File | undefined;
  const whyGenSea = watch("whyGenSea") ?? "";
  const wordCount = countWords(whyGenSea);
  const wordCountValid = wordCount >= 200 && wordCount <= 500;

  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file?: File) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert(t("validation.pdfOnly"));
      return;
    }
    if (file.size > MAX_DECK_SIZE) {
      alert(t("validation.fileTooLarge"));
      return;
    }
    setValue("pitchDeck", file, { shouldValidate: true });
  };

  return (
    <form noValidate onSubmit={handleSubmit(onNext)} className="space-y-7">
      <header>
        <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">
          {t("apply.venture.documents.title")}
        </h2>
        <p className="mt-2 text-base text-navy/70">
          {t("apply.venture.documents.subtitle")}
        </p>
      </header>

      {/* Pitch deck dropzone */}
      <div>
        <label className="field-label">
          {t("apply.venture.documents.pitchDeck")}
          <span className="ml-0.5 text-brand-red">*</span>
        </label>

        {!pitchDeck ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFile(e.dataTransfer.files?.[0]);
            }}
            className={cn(
              "relative rounded-2xl border-2 border-dashed p-8 text-center transition-colors",
              dragOver
                ? "border-coral-500 bg-coral-500/5"
                : "border-navy/20 bg-cream-100/40 hover:border-navy/30",
            )}
          >
            <Upload className="mx-auto h-10 w-10 text-navy/40" strokeWidth={1.5} />
            <p className="mt-3 text-sm text-navy">
              <span className="font-semibold text-coral-600">
                {t("apply.venture.documents.uploadCta")}
              </span>{" "}
              {t("apply.venture.documents.uploadOrDrop")}
            </p>
            <p className="mt-1 text-xs text-navy/55">
              {t("apply.venture.documents.uploadHint")}
            </p>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFile(e.target.files?.[0])}
              className="absolute inset-0 cursor-pointer opacity-0"
              aria-label={t("apply.venture.documents.pitchDeck")}
            />
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-2xl border border-navy/10 bg-white p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-coral-500/10 text-coral-600">
                <FileText className="h-5 w-5" />
              </span>
              <div>
                <div className="text-sm font-medium text-navy">{pitchDeck.name}</div>
                <div className="text-xs text-navy/50">
                  {(pitchDeck.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                setValue("pitchDeck", undefined as unknown as File, {
                  shouldValidate: true,
                })
              }
              className="rounded-md p-2 text-navy/60 transition hover:bg-cream-100 hover:text-brand-red"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {errors.pitchDeck?.message && (
          <p className="field-error" role="alert">
            {t(errors.pitchDeck.message as string)}
          </p>
        )}
      </div>

      <Field
        label={t("apply.venture.documents.demoVideoUrl")}
        hint={t("apply.venture.documents.optionalHint")}
        error={errors.demoVideoUrl?.message && t(errors.demoVideoUrl.message)}
      >
        <input
          type="url"
          {...register("demoVideoUrl")}
          className="field-input"
          placeholder="https://youtube.com/..."
        />
      </Field>

      <Field
        label={t("apply.venture.documents.nominatedBy")}
        hint={t("apply.venture.documents.nominatedByHint")}
      >
        <input
          {...register("nominatedBy")}
          className="field-input"
          placeholder={t("apply.venture.documents.nominatedByPlaceholder")}
        />
      </Field>

      <Field
        label={t("apply.venture.documents.whyGenSea")}
        required
        error={errors.whyGenSea?.message && t(errors.whyGenSea.message)}
        hint={
          <span className={wordCountValid ? "text-navy/50" : "text-brand-red"}>
            {wordCount} / 200–500 {t("common.words")}
          </span>
        }
      >
        <textarea
          {...register("whyGenSea")}
          rows={8}
          className="field-input resize-y leading-relaxed"
          placeholder={t("apply.venture.documents.whyGenSeaPlaceholder")}
        />
      </Field>

      <FormFooter
        primaryLabel={t("apply.continue")}
        backLabel={t("apply.back")}
        canSubmit={isValid && wordCountValid}
        onBack={onBack}
      />
    </form>
  );
}
