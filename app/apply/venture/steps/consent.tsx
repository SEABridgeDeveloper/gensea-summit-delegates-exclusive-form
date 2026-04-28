"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLocale } from "@/lib/i18n/provider";
import { consentSchema, type ConsentValues } from "@/lib/schemas";
import {
  ConsentCheckbox,
  Field,
  FormFooter,
  YesNo,
} from "@/components/apply/form-primitives";

interface Props {
  defaultValues?: Partial<ConsentValues>;
  onSubmit: (values: ConsentValues) => void | Promise<void>;
  onBack: () => void;
  isSubmitting?: boolean;
}

const DIETARY_OPTIONS = [
  "vegetarian",
  "vegan",
  "halal",
  "no_pork",
  "no_beef",
  "gluten_free",
] as const;

export function ConsentStep({
  defaultValues,
  onSubmit,
  onBack,
  isSubmitting = false,
}: Props) {
  const { t } = useLocale();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ConsentValues>({
    resolver: zodResolver(consentSchema),
    mode: "onBlur",
    defaultValues: {
      needAccommodation: false,
      interestedInDemoSlot: false,
      dietary: [],
      ...defaultValues,
    } as ConsentValues,
  });

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <header>
        <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">
          {t("apply.venture.consent.title")}
        </h2>
        <p className="mt-2 text-base text-navy/70">
          {t("apply.venture.consent.subtitle")}
        </p>
      </header>

      {/* Logistics */}
      <section className="space-y-5">
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-navy/55">
          {t("apply.venture.consent.logistics")}
        </h3>

        <YesNo
          label={t("apply.venture.consent.needAccommodation")}
          hint={t("apply.venture.consent.accommodationHint")}
          name="needAccommodation"
          control={control}
          yesLabel={t("common.yes")}
          noLabel={t("common.no")}
        />

        <YesNo
          label={t("apply.venture.consent.availableAllDays")}
          hint={t("apply.venture.consent.availableHint")}
          name="availableAllDays"
          control={control}
          required
          error={
            errors.availableAllDays?.message &&
            t(errors.availableAllDays.message)
          }
          yesLabel={t("common.yes")}
          noLabel={t("common.no")}
        />

        <YesNo
          label={t("apply.venture.consent.interestedInDemoSlot")}
          hint={t("apply.venture.consent.demoSlotHint")}
          name="interestedInDemoSlot"
          control={control}
          yesLabel={t("common.yes")}
          noLabel={t("common.no")}
        />

        <fieldset>
          <legend className="field-label">
            {t("apply.venture.consent.dietary")}
          </legend>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {DIETARY_OPTIONS.map((opt) => (
              <label
                key={opt}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-navy/15 bg-white px-4 py-2.5 transition has-[:checked]:border-coral-500 has-[:checked]:bg-coral-500/5"
              >
                <input
                  type="checkbox"
                  value={opt}
                  {...register("dietary")}
                  className="h-4 w-4 rounded accent-coral-500"
                />
                <span className="text-sm text-navy">
                  {t(`apply.venture.consent.dietaryOptions.${opt}`)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <Field label={t("apply.venture.consent.allergies")}>
          <input {...register("allergies")} className="field-input" />
        </Field>

        <Field label={t("apply.venture.consent.accessibilityNeeds")}>
          <input
            {...register("accessibilityNeeds")}
            className="field-input"
          />
        </Field>
      </section>

      {/* Consent */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-navy/55">
          {t("apply.venture.consent.legalAndConsent")}
        </h3>

        <ConsentCheckbox
          label={t("apply.venture.consent.pdpaConsent")}
          required
          register={register}
          name="pdpaConsent"
          error={errors.pdpaConsent?.message && t(errors.pdpaConsent.message)}
        />

        <ConsentCheckbox
          label={t("apply.venture.consent.ipShareConsent")}
          required
          register={register}
          name="ipShareConsent"
          error={
            errors.ipShareConsent?.message && t(errors.ipShareConsent.message)
          }
        />

        <ConsentCheckbox
          label={t("apply.venture.consent.truthfulnessConfirm")}
          required
          register={register}
          name="truthfulnessConfirm"
          error={
            errors.truthfulnessConfirm?.message &&
            t(errors.truthfulnessConfirm.message)
          }
        />

        <ConsentCheckbox
          label={t("apply.venture.consent.photoConsent")}
          register={register}
          name="photoConsent"
        />
      </section>

      <FormFooter
        primaryLabel={t("apply.venture.consent.submit")}
        submittingLabel={t("apply.submitting")}
        backLabel={t("apply.back")}
        onBack={onBack}
        submitting={isSubmitting}
      />
    </form>
  );
}
