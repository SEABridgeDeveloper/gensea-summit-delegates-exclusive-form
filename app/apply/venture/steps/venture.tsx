"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLocale } from "@/lib/i18n/provider";
import {
  ventureSchema,
  SECTORS,
  STAGES,
  type VentureValues,
} from "@/lib/schemas";
import { Field, FormFooter } from "@/components/apply/form-primitives";

interface Props {
  defaultValues?: Partial<VentureValues>;
  onNext: (values: VentureValues) => void;
  onBack: () => void;
}

export function VentureStep({ defaultValues, onNext, onBack }: Props) {
  const { t } = useLocale();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<VentureValues>({
    resolver: zodResolver(ventureSchema),
    mode: "onBlur",
    defaultValues: {
      sector: "ai",
      stage: "pre_seed",
      foundedYear: new Date().getFullYear(),
      ...defaultValues,
    },
  });

  const oneLiner = watch("oneLiner") ?? "";
  const problem = watch("problem") ?? "";
  const solution = watch("solution") ?? "";

  return (
    <form noValidate onSubmit={handleSubmit(onNext)} className="space-y-7">
      <header>
        <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">
          {t("apply.venture.venture.title")}
        </h2>
        <p className="mt-2 text-base text-navy/70">
          {t("apply.venture.venture.subtitle")}
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label={t("apply.venture.venture.name")}
          required
          error={errors.name?.message && t(errors.name.message)}
        >
          <input {...register("name")} className="field-input" />
        </Field>
        <Field
          label={t("apply.venture.venture.websiteUrl")}
          error={errors.websiteUrl?.message && t(errors.websiteUrl.message)}
        >
          <input
            type="url"
            {...register("websiteUrl")}
            className="field-input"
            placeholder="https://"
          />
        </Field>

        <Field
          label={t("apply.venture.venture.sector")}
          required
          error={errors.sector?.message && t(errors.sector.message)}
        >
          <select {...register("sector")} className="field-input">
            {SECTORS.map((s) => (
              <option key={s} value={s}>
                {t(`sectors.items.${s}.title`)}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label={t("apply.venture.venture.stage")}
          required
          error={errors.stage?.message && t(errors.stage.message)}
        >
          <select {...register("stage")} className="field-input">
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {t(`apply.venture.venture.stages.${s}`)}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label={t("apply.venture.venture.foundedYear")}
          required
          error={errors.foundedYear?.message && t(errors.foundedYear.message)}
        >
          <input
            type="number"
            min={2015}
            max={new Date().getFullYear()}
            {...register("foundedYear")}
            className="field-input"
          />
        </Field>

        <Field
          label={t("apply.venture.venture.hqCountry")}
          required
          error={errors.hqCountry?.message && t(errors.hqCountry.message)}
        >
          <input {...register("hqCountry")} className="field-input" />
        </Field>

        <Field
          label={t("apply.venture.venture.hqCity")}
          required
          error={errors.hqCity?.message && t(errors.hqCity.message)}
        >
          <input {...register("hqCity")} className="field-input" />
        </Field>
      </div>

      <Field
        label={t("apply.venture.venture.oneLiner")}
        required
        error={errors.oneLiner?.message && t(errors.oneLiner.message)}
        hint={`${oneLiner.length} / 140`}
      >
        <input
          {...register("oneLiner")}
          maxLength={140}
          className="field-input"
          placeholder={t("apply.venture.venture.oneLinerPlaceholder")}
        />
      </Field>

      <Field
        label={t("apply.venture.venture.problem")}
        required
        error={errors.problem?.message && t(errors.problem.message)}
        hint={`${problem.length} / 800`}
      >
        <textarea
          {...register("problem")}
          rows={4}
          maxLength={800}
          className="field-input resize-y leading-relaxed"
          placeholder={t("apply.venture.venture.problemPlaceholder")}
        />
      </Field>

      <Field
        label={t("apply.venture.venture.solution")}
        required
        error={errors.solution?.message && t(errors.solution.message)}
        hint={`${solution.length} / 800`}
      >
        <textarea
          {...register("solution")}
          rows={4}
          maxLength={800}
          className="field-input resize-y leading-relaxed"
          placeholder={t("apply.venture.venture.solutionPlaceholder")}
        />
      </Field>

      <FormFooter
        primaryLabel={t("apply.continue")}
        backLabel={t("apply.back")}
        onBack={onBack}
      />
    </form>
  );
}
