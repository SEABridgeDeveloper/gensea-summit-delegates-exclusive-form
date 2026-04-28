"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLocale } from "@/lib/i18n/provider";
import { founderSchema, type FounderValues } from "@/lib/schemas";
import { Field, FormFooter } from "@/components/apply/form-primitives";

interface Props {
  defaultValues?: Partial<FounderValues>;
  onNext: (values: FounderValues) => void;
}

const ROLE_OPTIONS = ["CEO", "CO_FOUNDER", "CTO", "COO", "OTHER"] as const;

export function FounderStep({ defaultValues, onNext }: Props) {
  const { t } = useLocale();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FounderValues>({
    resolver: zodResolver(founderSchema),
    mode: "onBlur",
    defaultValues: {
      coFounderCount: 0,
      role: "CEO",
      ...defaultValues,
    },
  });

  const role = watch("role");

  return (
    <form noValidate onSubmit={handleSubmit(onNext)} className="space-y-7">
      <header>
        <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">
          {t("apply.venture.founder.title")}
        </h2>
        <p className="mt-2 text-base text-navy/70">
          {t("apply.venture.founder.subtitle")}
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label={t("apply.venture.founder.fullNameTh")}
          required
          error={errors.fullNameTh?.message && t(errors.fullNameTh.message)}
        >
          <input
            {...register("fullNameTh")}
            className="field-input"
            placeholder="ธนกฤต เสริมสุขสันต์"
          />
        </Field>
        <Field
          label={t("apply.venture.founder.fullNameEn")}
          required
          error={errors.fullNameEn?.message && t(errors.fullNameEn.message)}
        >
          <input
            {...register("fullNameEn")}
            className="field-input"
            placeholder="Tanakrit Sermsuksan"
          />
        </Field>

        <Field
          label={t("apply.venture.founder.email")}
          required
          error={errors.email?.message && t(errors.email.message)}
        >
          <input
            type="email"
            inputMode="email"
            {...register("email")}
            className="field-input"
          />
        </Field>
        <Field
          label={t("apply.venture.founder.phone")}
          required
          error={errors.phone?.message && t(errors.phone.message)}
        >
          <input
            type="tel"
            inputMode="tel"
            {...register("phone")}
            className="field-input"
            placeholder="+66"
          />
        </Field>

        <Field label={t("apply.venture.founder.lineId")}>
          <input {...register("lineId")} className="field-input" />
        </Field>

        <Field
          label={t("apply.venture.founder.role")}
          required
          error={errors.role?.message && t(errors.role.message)}
        >
          <select {...register("role")} className="field-input">
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {t(`apply.venture.founder.roles.${r}`)}
              </option>
            ))}
          </select>
        </Field>

        {role === "OTHER" && (
          <Field
            label={t("apply.venture.founder.roleOther")}
            required
            error={errors.roleOther?.message && t(errors.roleOther.message)}
          >
            <input {...register("roleOther")} className="field-input" />
          </Field>
        )}

        <Field
          label={t("apply.venture.founder.coFounderCount")}
          required
          error={
            errors.coFounderCount?.message && t(errors.coFounderCount.message)
          }
        >
          <input
            type="number"
            min={0}
            max={10}
            {...register("coFounderCount")}
            className="field-input"
          />
        </Field>
      </div>

      <FormFooter primaryLabel={t("apply.continue")} />
    </form>
  );
}
