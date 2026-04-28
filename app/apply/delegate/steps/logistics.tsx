"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Send, AlertCircle } from "lucide-react";
import { logisticsSchema, type LogisticsValues } from "@/lib/schemas";
import { useLocale } from "@/lib/i18n/provider";
import { FormError } from "@/components/apply/field-error";

type Props = {
  defaultValues?: Partial<LogisticsValues>;
  onValid: (values: LogisticsValues) => void;
  onBack: () => void;
  submitting?: boolean;
};

export function LogisticsStep({ defaultValues, onValid, onBack, submitting }: Props) {
  const { t, tArray } = useLocale();
  const accommodationOptions = tArray("apply.logistics.accommodation.options");
  const dietaryOptions = tArray("apply.logistics.dietary.options");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LogisticsValues>({
    resolver: zodResolver(logisticsSchema),
    mode: "onBlur",
    defaultValues: {
      dietary: [],
      allergies: "",
      accessibility: "",
      emergencyName: "",
      emergencyPhone: "",
      emergencyRelationship: "",
      consentPdpa: false,
      consentPhoto: false,
      consentTruthful: false,
      ...defaultValues,
    },
  });

  return (
    <form noValidate onSubmit={handleSubmit(onValid)} className="space-y-8">
      <header>
        <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">
          {t("apply.logistics.heading")}
        </h2>
        <p className="mt-2 text-base text-navy/70">{t("apply.logistics.subhead")}</p>
      </header>

      {/* Accommodation */}
      <fieldset>
        <legend className="field-label">
          {t("apply.logistics.accommodation.label")} <span className="text-brand-red">*</span>
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {accommodationOptions.map((opt, i) => {
            const value = i === 0 ? "yes" : "no";
            return (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-navy/15 bg-white px-4 py-3 transition has-[:checked]:border-coral-500 has-[:checked]:bg-coral-500/5"
              >
                <input
                  type="radio"
                  value={value}
                  className="h-4 w-4 accent-coral-500"
                  {...register("accommodation")}
                />
                <span className="text-sm text-navy">{opt}</span>
              </label>
            );
          })}
        </div>
        <FormError error={errors.accommodation} />
        <div className="mt-3 flex gap-3 rounded-xl border border-gold-500/40 bg-gold-500/5 p-4 text-sm text-navy/80">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
          <p>{t("apply.logistics.accommodation.disclosure")}</p>
        </div>
      </fieldset>

      {/* Dietary */}
      <fieldset>
        <legend className="field-label">{t("apply.logistics.dietary.label")}</legend>
        <p className="field-help mb-3 mt-0">{t("apply.logistics.dietary.help")}</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {dietaryOptions.map((opt) => (
            <label
              key={opt}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-navy/15 bg-white px-4 py-2.5 transition has-[:checked]:border-coral-500 has-[:checked]:bg-coral-500/5"
            >
              <input
                type="checkbox"
                value={opt}
                className="h-4 w-4 rounded accent-coral-500"
                {...register("dietary")}
              />
              <span className="text-sm text-navy">{opt}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="allergies" className="field-label">
            {t("apply.logistics.allergies.label")} <span className="text-brand-red">*</span>
          </label>
          <input
            id="allergies"
            type="text"
            aria-required
            aria-invalid={!!errors.allergies}
            placeholder={t("apply.logistics.allergies.placeholder")}
            className="field-input"
            {...register("allergies")}
          />
          {errors.allergies ? (
            <FormError error={errors.allergies} />
          ) : (
            <p className="field-help">{t("apply.logistics.allergies.help")}</p>
          )}
        </div>
        <div>
          <label htmlFor="accessibility" className="field-label">
            {t("apply.logistics.accessibility.label")}
          </label>
          <input
            id="accessibility"
            type="text"
            placeholder={t("apply.logistics.accessibility.placeholder")}
            className="field-input"
            {...register("accessibility")}
          />
          <p className="field-help">{t("apply.logistics.accessibility.help")}</p>
        </div>
      </div>

      {/* Emergency */}
      <fieldset className="rounded-2xl border border-navy/10 bg-cream-100/50 p-5">
        <legend className="px-2 text-sm font-semibold text-navy">
          {t("apply.logistics.emergency.label")} <span className="text-brand-red">*</span>
        </legend>
        <div className="mt-3 grid gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="emName" className="field-label">
              {t("apply.logistics.emergency.name")}
            </label>
            <input
              id="emName"
              type="text"
              aria-invalid={!!errors.emergencyName}
              placeholder={t("apply.logistics.emergency.namePlaceholder")}
              className="field-input"
              {...register("emergencyName")}
            />
            <FormError error={errors.emergencyName} />
          </div>
          <div>
            <label htmlFor="emPhone" className="field-label">
              {t("apply.logistics.emergency.phone")}
            </label>
            <input
              id="emPhone"
              type="tel"
              inputMode="tel"
              aria-invalid={!!errors.emergencyPhone}
              placeholder={t("apply.logistics.emergency.phonePlaceholder")}
              className="field-input"
              {...register("emergencyPhone")}
            />
            <FormError error={errors.emergencyPhone} />
          </div>
          <div>
            <label htmlFor="emRel" className="field-label">
              {t("apply.logistics.emergency.relationship")}
            </label>
            <input
              id="emRel"
              type="text"
              aria-invalid={!!errors.emergencyRelationship}
              placeholder={t("apply.logistics.emergency.relationshipPlaceholder")}
              className="field-input"
              {...register("emergencyRelationship")}
            />
            <FormError error={errors.emergencyRelationship} />
          </div>
        </div>
      </fieldset>

      {/* Consent */}
      <fieldset className="space-y-3">
        <legend className="field-label">{t("apply.logistics.consents.heading")}</legend>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-navy/15 bg-white p-4">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded accent-coral-500"
            aria-required
            {...register("consentPdpa")}
          />
          <div>
            <p className="text-sm text-navy">{t("apply.logistics.consents.pdpa")}</p>
            <FormError error={errors.consentPdpa} />
          </div>
        </label>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-navy/15 bg-white p-4">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded accent-coral-500"
            {...register("consentPhoto")}
          />
          <p className="text-sm text-navy">{t("apply.logistics.consents.photo")}</p>
        </label>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-navy/15 bg-white p-4">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded accent-coral-500"
            aria-required
            {...register("consentTruthful")}
          />
          <div>
            <p className="text-sm text-navy">{t("apply.logistics.consents.truthful")}</p>
            <FormError error={errors.consentTruthful} />
          </div>
        </label>
      </fieldset>

      <div className="flex items-center justify-between pt-2">
        <button type="button" onClick={onBack} className="btn-ghost">
          <ArrowLeft className="h-4 w-4" /> {t("apply.actions.back")}
        </button>
        <button type="submit" disabled={submitting} className="btn-primary">
          <Send className="h-4 w-4" />
          {submitting ? t("apply.actions.submitting") : t("apply.actions.submit")}
        </button>
      </div>
    </form>
  );
}
