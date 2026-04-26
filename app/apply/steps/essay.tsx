"use client"

import { useFormContext } from "react-hook-form"
import { useI18n } from "@/lib/i18n"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useMemo } from "react"
import type { ApplicationFormData } from "@/lib/form-schema"

export function EssayStep() {
  const { t } = useI18n()
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<ApplicationFormData>()

  const essayValue = watch("essay") || ""

  const wordCount = useMemo(() => {
    return essayValue.trim().split(/\s+/).filter(Boolean).length
  }, [essayValue])

  const isWordCountValid = wordCount >= 200 && wordCount <= 500
  const wordCountColor = isWordCountValid
    ? "text-green-600 dark:text-green-400"
    : "text-red-500"

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{t("apply.step4.title")}</h2>

      <div className="space-y-2">
        <Label htmlFor="essay">
          {t("apply.step4.prompt")} <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="essay"
          rows={12}
          placeholder="Write your essay here..."
          {...register("essay")}
          aria-required="true"
          aria-invalid={!!errors.essay}
          className="resize-none"
        />

        {/* Word counter */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t("apply.step4.helper")}
          </p>
          <p className={`text-sm font-medium ${wordCountColor}`}>
            {t("apply.step4.wordCount")}: {wordCount} / 200-500
          </p>
        </div>

        {errors.essay && (
          <p className="text-sm text-red-500" role="alert">
            {errors.essay.message}
          </p>
        )}
      </div>
    </div>
  )
}
