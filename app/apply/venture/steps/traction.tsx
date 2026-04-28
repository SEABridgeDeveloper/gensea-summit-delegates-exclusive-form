"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLocale } from "@/lib/i18n/provider";
import { tractionSchema, type TractionValues } from "@/lib/schemas";
import { Field, FormFooter, YesNo } from "@/components/apply/form-primitives";

interface Props {
  defaultValues?: Partial<TractionValues>;
  onNext: (values: TractionValues) => void;
  onBack: () => void;
}

export function TractionStep({ defaultValues, onNext, onBack }: Props) {
  const { t } = useLocale();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<TractionValues>({
    resolver: zodResolver(tractionSchema),
    mode: "onBlur",
    defaultValues: {
      hasLaunched: false,
      ...defaultValues,
    },
  });

  const hasLaunched = watch("hasLaunched");
  const milestones = watch("milestones") ?? "";

  return (
    <form noValidate onSubmit={handleSubmit(onNext)} className="space-y-7">
      <header>
        <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">
          {t("apply.venture.traction.title")}
        </h2>
        <p className="mt-2 text-base text-navy/70">
          {t("apply.venture.traction.subtitle")}
        </p>
      </header>

      <div className="space-y-5 rounded-2xl border border-navy/10 bg-cream-100/50 p-5">
        <YesNo
          label={t("apply.venture.traction.hasLaunched")}
          name="hasLaunched"
          register={register}
          yesLabel={t("common.yes")}
          noLabel={t("common.no")}
        />
        {hasLaunched && (
          <Field label={t("apply.venture.traction.launchedDate")}>
            <input
              type="month"
              {...register("launchedDate")}
              className="field-input"
            />
          </Field>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field
          label={t("apply.venture.traction.activeUsers")}
          hint={t("apply.venture.traction.optionalHint")}
        >
          <input
            type="number"
            min={0}
            {...register("activeUsers")}
            className="field-input"
            placeholder="0"
          />
        </Field>

        <Field
          label={t("apply.venture.traction.monthlyRevenueUsd")}
          hint={t("apply.venture.traction.optionalHint")}
        >
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-navy/50">
              $
            </span>
            <input
              type="number"
              min={0}
              {...register("monthlyRevenueUsd")}
              className="field-input pl-8"
              placeholder="0"
            />
          </div>
        </Field>

        <Field
          label={t("apply.venture.traction.totalFundingUsd")}
          hint={t("apply.venture.traction.optionalHint")}
        >
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-navy/50">
              $
            </span>
            <input
              type="number"
              min={0}
              {...register("totalFundingUsd")}
              className="field-input pl-8"
              placeholder="0"
            />
          </div>
        </Field>
      </div>

      <Field
        label={t("apply.venture.traction.partnerships")}
        hint={t("apply.venture.traction.optionalHint")}
      >
        <textarea
          {...register("partnerships")}
          rows={3}
          maxLength={500}
          className="field-input resize-y leading-relaxed"
          placeholder={t("apply.venture.traction.partnershipsPlaceholder")}
        />
      </Field>

      <Field
        label={t("apply.venture.traction.milestones")}
        required
        error={errors.milestones?.message && t(errors.milestones.message)}
        hint={`${milestones.length} / 1000`}
      >
        <textarea
          {...register("milestones")}
          rows={5}
          maxLength={1000}
          className="field-input resize-y leading-relaxed"
          placeholder={t("apply.venture.traction.milestonesPlaceholder")}
        />
      </Field>

      <FormFooter
        primaryLabel={t("apply.continue")}
        backLabel={t("apply.back")}
        canSubmit={isValid}
        onBack={onBack}
      />
    </form>
  );
}
