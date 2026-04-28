"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { essaySchema, type EssayValues, countWords } from "@/lib/schemas";
import { useLocale } from "@/lib/i18n/provider";
import { FormError } from "@/components/apply/field-error";
import { cn } from "@/lib/cn";

type Props = {
  defaultValues?: Partial<EssayValues>;
  onValid: (values: EssayValues) => void;
  onBack: () => void;
};

export function EssayStep({ defaultValues, onValid, onBack }: Props) {
  const { t, tArray } = useLocale();
  const bullets = tArray("apply.essay.promptBullets");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EssayValues>({
    resolver: zodResolver(essaySchema),
    mode: "onBlur",
    defaultValues: { essay: "", ...defaultValues },
  });

  const essay = watch("essay") ?? "";
  const wordCount = countWords(essay);
  const overLimit = wordCount > 500;
  const underMin = wordCount > 0 && wordCount < 200;

  return (
    <form noValidate onSubmit={handleSubmit(onValid)} className="space-y-7">
      <header>
        <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">
          {t("apply.essay.heading")}
        </h2>
        <p className="mt-2 text-base text-navy/70">{t("apply.essay.subhead")}</p>
      </header>

      <div className="rounded-2xl border border-coral-500/30 bg-coral-500/5 p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-coral-600">
          <Sparkles className="h-4 w-4" />
          {t("apply.essay.promptTitle")}
        </div>
        <ul className="mt-3 space-y-2 text-base text-navy">
          {bullets.map((b) => (
            <li key={b} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral-500" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <label htmlFor="essay" className="field-label">
          {t("apply.essay.fields.essay")} <span className="text-brand-red">*</span>
        </label>
        <textarea
          id="essay"
          rows={12}
          aria-required
          aria-invalid={!!errors.essay}
          placeholder={t("apply.essay.fields.essayPlaceholder")}
          className="field-input min-h-[260px] resize-y leading-relaxed"
          {...register("essay")}
        />
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className={cn("text-navy/55", underMin && "text-brand-red")}>
            {t("apply.essay.fields.wordCountMin")}
          </span>
          <span
            className={cn(
              "font-medium tabular-nums",
              overLimit ? "text-brand-red" : "text-navy/65",
            )}
          >
            {t("apply.essay.fields.wordCount", { count: wordCount })}
          </span>
        </div>
        <FormError error={errors.essay} />
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
