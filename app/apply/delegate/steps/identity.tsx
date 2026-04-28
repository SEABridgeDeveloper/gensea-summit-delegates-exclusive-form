"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { identitySchema, type IdentityValues } from "@/lib/schemas";
import { useLocale } from "@/lib/i18n/provider";
import { FormError } from "@/components/apply/field-error";

type Props = {
  defaultValues?: Partial<IdentityValues>;
  onValid: (values: IdentityValues) => void;
};

export function IdentityStep({ defaultValues, onValid }: Props) {
  const { t } = useLocale();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IdentityValues>({
    resolver: zodResolver(identitySchema),
    mode: "onBlur",
    defaultValues: {
      fullNameTh: "",
      fullNameEn: "",
      email: "",
      phone: "",
      line: "",
      discord: "",
      ...defaultValues,
    },
  });

  return (
    <form noValidate onSubmit={handleSubmit(onValid)} className="space-y-7">
      <header>
        <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">
          {t("apply.identity.heading")}
        </h2>
        <p className="mt-2 text-base text-navy/70">{t("apply.identity.subhead")}</p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fullNameTh" className="field-label">
            {t("apply.identity.fields.fullNameTh")}
          </label>
          <input
            id="fullNameTh"
            type="text"
            placeholder={t("apply.identity.fields.fullNameThPlaceholder")}
            className="field-input"
            {...register("fullNameTh")}
          />
          <p className="field-help">{t("apply.identity.fields.fullNameThHelp")}</p>
        </div>
        <div>
          <label htmlFor="fullNameEn" className="field-label">
            {t("apply.identity.fields.fullNameEn")} <span className="text-brand-red">*</span>
          </label>
          <input
            id="fullNameEn"
            type="text"
            aria-required
            aria-invalid={!!errors.fullNameEn}
            placeholder={t("apply.identity.fields.fullNameEnPlaceholder")}
            className="field-input"
            {...register("fullNameEn")}
          />
          <FormError error={errors.fullNameEn} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="field-label">
            {t("apply.identity.fields.email")} <span className="text-brand-red">*</span>
          </label>
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            aria-required
            aria-invalid={!!errors.email}
            placeholder={t("apply.identity.fields.emailPlaceholder")}
            className="field-input"
            {...register("email")}
          />
          {errors.email ? (
            <FormError error={errors.email} />
          ) : (
            <p className="field-help">{t("apply.identity.fields.emailHelp")}</p>
          )}
        </div>
        <div>
          <label htmlFor="phone" className="field-label">
            {t("apply.identity.fields.phone")} <span className="text-brand-red">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            aria-required
            aria-invalid={!!errors.phone}
            placeholder={t("apply.identity.fields.phonePlaceholder")}
            className="field-input"
            {...register("phone")}
          />
          <FormError error={errors.phone} />
        </div>
      </div>

      <fieldset className="rounded-2xl border border-navy/10 bg-cream-100/60 p-5">
        <legend className="px-2 text-sm font-semibold text-navy">
          {t("apply.identity.fields.contactGroupHelp")}
        </legend>
        <div className="mt-3 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="line" className="field-label">
              {t("apply.identity.fields.line")}
            </label>
            <input
              id="line"
              type="text"
              aria-invalid={!!errors.line}
              placeholder={t("apply.identity.fields.linePlaceholder")}
              className="field-input"
              {...register("line")}
            />
            <FormError error={errors.line} />
          </div>
          <div>
            <label htmlFor="discord" className="field-label">
              {t("apply.identity.fields.discord")}
            </label>
            <input
              id="discord"
              type="text"
              aria-invalid={!!errors.discord}
              placeholder={t("apply.identity.fields.discordPlaceholder")}
              className="field-input"
              {...register("discord")}
            />
            <FormError error={errors.discord} />
          </div>
        </div>
      </fieldset>

      <div className="flex items-center justify-between pt-2">
        <span />
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {t("apply.actions.next")} <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
