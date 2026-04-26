"use client"

import { useFormContext, Controller } from "react-hook-form"
import { useI18n } from "@/lib/i18n"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ApplicationFormData } from "@/lib/form-schema"

export function LogisticsStep() {
  const { t, messages } = useI18n()
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ApplicationFormData>()

  const dietaryOptions = messages.apply.step5.dietaryOptions
  const relationOptions = messages.apply.step5.relations
  const selectedDietary = watch("dietary") || []

  const handleDietaryChange = (option: string, checked: boolean) => {
    if (checked) {
      setValue("dietary", [...selectedDietary, option])
    } else {
      setValue(
        "dietary",
        selectedDietary.filter((d) => d !== option)
      )
    }
  }

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">{t("apply.step5.title")}</h2>

      {/* Logistics Section */}
      <div className="space-y-6">
        {/* Accommodation */}
        <div className="space-y-3">
          <Label>
            {t("apply.step5.accommodation")} <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="needAccommodation"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="accommodation-yes" />
                  <Label htmlFor="accommodation-yes" className="font-normal cursor-pointer">
                    {t("apply.step5.accommodationYes")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="accommodation-no" />
                  <Label htmlFor="accommodation-no" className="font-normal cursor-pointer">
                    {t("apply.step5.accommodationNo")}
                  </Label>
                </div>
              </RadioGroup>
            )}
          />
          <p className="text-sm text-red-500/80">
            {t("apply.step5.accommodationHelper")}
          </p>
          {errors.needAccommodation && (
            <p className="text-sm text-red-500" role="alert">
              {errors.needAccommodation.message}
            </p>
          )}
        </div>

        {/* Dietary requirements */}
        <div className="space-y-3">
          <Label>{t("apply.step5.dietary")}</Label>
          <div className="grid grid-cols-2 gap-3">
            {dietaryOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`dietary-${option}`}
                  checked={selectedDietary.includes(option)}
                  onCheckedChange={(checked) =>
                    handleDietaryChange(option, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`dietary-${option}`}
                  className="font-normal cursor-pointer text-sm"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div className="space-y-2">
          <Label htmlFor="allergies">{t("apply.step5.allergies")}</Label>
          <Input
            id="allergies"
            placeholder="e.g. Peanuts, shellfish"
            {...register("allergies")}
          />
        </div>

        {/* Accessibility */}
        <div className="space-y-2">
          <Label htmlFor="accessibility">{t("apply.step5.accessibility")}</Label>
          <Input
            id="accessibility"
            placeholder="e.g. Wheelchair access required"
            {...register("accessibility")}
          />
        </div>
      </div>

      {/* Emergency Contact Section */}
      <div className="space-y-6 pt-6 border-t border-border">
        <h3 className="text-lg font-semibold">Emergency Contact</h3>

        <div className="space-y-2">
          <Label htmlFor="emergencyName">
            {t("apply.step5.emergencyName")} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="emergencyName"
            {...register("emergencyName")}
            aria-required="true"
            aria-invalid={!!errors.emergencyName}
          />
          {errors.emergencyName && (
            <p className="text-sm text-red-500" role="alert">
              {errors.emergencyName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="emergencyPhone">
            {t("apply.step5.emergencyPhone")} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="emergencyPhone"
            type="tel"
            {...register("emergencyPhone")}
            aria-required="true"
            aria-invalid={!!errors.emergencyPhone}
          />
          {errors.emergencyPhone && (
            <p className="text-sm text-red-500" role="alert">
              {errors.emergencyPhone.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>
            {t("apply.step5.emergencyRelation")} <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="emergencyRelation"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger aria-required="true" aria-invalid={!!errors.emergencyRelation}>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  {relationOptions.map((relation, index) => (
                    <SelectItem key={index} value={relation}>
                      {relation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.emergencyRelation && (
            <p className="text-sm text-red-500" role="alert">
              {errors.emergencyRelation.message}
            </p>
          )}
        </div>
      </div>

      {/* Consent Section */}
      <div className="space-y-6 pt-6 border-t border-border">
        <h3 className="text-lg font-semibold">Consent</h3>

        {/* Consent 1 - Required */}
        <div className="space-y-2">
          <div className="flex items-start space-x-3">
            <Controller
              name="consent1"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="consent1"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-required="true"
                />
              )}
            />
            <Label htmlFor="consent1" className="font-normal cursor-pointer leading-relaxed">
              {t("apply.step5.consent1")} <span className="text-red-500">*</span>
            </Label>
          </div>
          {errors.consent1 && (
            <p className="text-sm text-red-500 ml-6" role="alert">
              {errors.consent1.message}
            </p>
          )}
        </div>

        {/* Consent 2 - Optional */}
        <div className="flex items-start space-x-3">
          <Controller
            name="consent2"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="consent2"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="consent2" className="font-normal cursor-pointer leading-relaxed">
            {t("apply.step5.consent2")}
          </Label>
        </div>

        {/* Consent 3 - Required */}
        <div className="space-y-2">
          <div className="flex items-start space-x-3">
            <Controller
              name="consent3"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="consent3"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-required="true"
                />
              )}
            />
            <Label htmlFor="consent3" className="font-normal cursor-pointer leading-relaxed">
              {t("apply.step5.consent3")} <span className="text-red-500">*</span>
            </Label>
          </div>
          {errors.consent3 && (
            <p className="text-sm text-red-500 ml-6" role="alert">
              {errors.consent3.message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
