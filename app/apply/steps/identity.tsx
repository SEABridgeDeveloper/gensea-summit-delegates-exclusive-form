"use client"

import { useFormContext } from "react-hook-form"
import { useI18n } from "@/lib/i18n"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ApplicationFormData } from "@/lib/form-schema"

export function IdentityStep() {
  const { t } = useI18n()
  const {
    register,
    formState: { errors },
  } = useFormContext<ApplicationFormData>()

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{t("apply.step1.title")}</h2>

      {/* Full name (Thai) */}
      <div className="space-y-2">
        <Label htmlFor="nameTh">
          {t("apply.step1.nameTh")} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="nameTh"
          placeholder={t("apply.step1.nameThPlaceholder")}
          {...register("nameTh")}
          aria-required="true"
          aria-invalid={!!errors.nameTh}
        />
        {errors.nameTh && (
          <p className="text-sm text-red-500" role="alert">
            {errors.nameTh.message}
          </p>
        )}
      </div>

      {/* Full name (English) */}
      <div className="space-y-2">
        <Label htmlFor="nameEn">
          {t("apply.step1.nameEn")} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="nameEn"
          placeholder={t("apply.step1.nameEnPlaceholder")}
          {...register("nameEn")}
          aria-required="true"
          aria-invalid={!!errors.nameEn}
        />
        <p className="text-sm text-muted-foreground">
          {t("apply.step1.nameEnHelper")}
        </p>
        {errors.nameEn && (
          <p className="text-sm text-red-500" role="alert">
            {errors.nameEn.message}
          </p>
        )}
      </div>

      {/* University email */}
      <div className="space-y-2">
        <Label htmlFor="email">
          {t("apply.step1.email")} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="tanakrit.s@student.chula.ac.th"
          {...register("email")}
          aria-required="true"
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-sm text-red-500" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Mobile phone */}
      <div className="space-y-2">
        <Label htmlFor="phone">
          {t("apply.step1.phone")} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+66 81 234 5678"
          {...register("phone")}
          aria-required="true"
          aria-invalid={!!errors.phone}
        />
        {errors.phone && (
          <p className="text-sm text-red-500" role="alert">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* LINE ID & Discord */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lineId">{t("apply.step1.lineId")}</Label>
          <Input
            id="lineId"
            placeholder="tanakrit_s"
            {...register("lineId")}
            aria-invalid={!!errors.lineId}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="discord">{t("apply.step1.discord")}</Label>
          <Input
            id="discord"
            placeholder="tanakrit#1234"
            {...register("discord")}
            aria-invalid={!!errors.discord}
          />
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        {t("apply.step1.contactHelper")}
      </p>
      {errors.lineId && (
        <p className="text-sm text-red-500" role="alert">
          {errors.lineId.message}
        </p>
      )}
    </div>
  )
}
