"use client"

import { useFormContext, Controller } from "react-hook-form"
import { useI18n, useLocale } from "@/lib/i18n"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useMemo } from "react"
import type { ApplicationFormData } from "@/lib/form-schema"
import universitiesData from "@/data/universities.json"

export function AcademicStep() {
  const { t, messages } = useI18n()
  const { locale } = useLocale()
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<ApplicationFormData>()

  const [universityOpen, setUniversityOpen] = useState(false)
  const selectedUniversityId = watch("universityId")

  const universities = universitiesData.universities

  const selectedUniversity = useMemo(() => {
    return universities.find((u) => u.id === selectedUniversityId)
  }, [selectedUniversityId, universities])

  const faculties = useMemo(() => {
    if (!selectedUniversity) return []
    return selectedUniversity.faculties
  }, [selectedUniversity])

  const yearOptions = messages.apply.step2.years

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{t("apply.step2.title")}</h2>

      {/* University - Combobox */}
      <div className="space-y-2">
        <Label>
          {t("apply.step2.university")} <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="universityId"
          control={control}
          render={({ field }) => (
            <Popover open={universityOpen} onOpenChange={setUniversityOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={universityOpen}
                  aria-required="true"
                  aria-invalid={!!errors.universityId}
                  className="w-full justify-between font-normal"
                >
                  {field.value
                    ? universities.find((u) => u.id === field.value)?.name[locale]
                    : t("apply.step2.universityPlaceholder")}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder={t("apply.step2.universityPlaceholder")} />
                  <CommandList>
                    <CommandEmpty>No university found.</CommandEmpty>
                    <CommandGroup>
                      {universities.map((university) => (
                        <CommandItem
                          key={university.id}
                          value={university.name[locale]}
                          onSelect={() => {
                            field.onChange(university.id)
                            setUniversityOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === university.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {university.name[locale]}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.universityId && (
          <p className="text-sm text-red-500" role="alert">
            {errors.universityId.message}
          </p>
        )}
      </div>

      {/* Faculty */}
      <div className="space-y-2">
        <Label>
          {t("apply.step2.faculty")} <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="faculty"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={!selectedUniversityId}
            >
              <SelectTrigger aria-required="true" aria-invalid={!!errors.faculty}>
                <SelectValue placeholder={t("apply.step2.facultyPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {faculties.map((faculty, index) => (
                  <SelectItem key={index} value={faculty[locale]}>
                    {faculty[locale]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.faculty && (
          <p className="text-sm text-red-500" role="alert">
            {errors.faculty.message}
          </p>
        )}
      </div>

      {/* Department / Major */}
      <div className="space-y-2">
        <Label htmlFor="department">
          {t("apply.step2.department")} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="department"
          placeholder="e.g. Computer Engineering"
          {...register("department")}
          aria-required="true"
          aria-invalid={!!errors.department}
        />
        {errors.department && (
          <p className="text-sm text-red-500" role="alert">
            {errors.department.message}
          </p>
        )}
      </div>

      {/* Year of study */}
      <div className="space-y-2">
        <Label>
          {t("apply.step2.yearOfStudy")} <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="yearOfStudy"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger aria-required="true" aria-invalid={!!errors.yearOfStudy}>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year, index) => (
                  <SelectItem key={index} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.yearOfStudy && (
          <p className="text-sm text-red-500" role="alert">
            {errors.yearOfStudy.message}
          </p>
        )}
      </div>

      {/* GPA */}
      <div className="space-y-2">
        <Label htmlFor="gpa">{t("apply.step2.gpa")}</Label>
        <Input
          id="gpa"
          type="number"
          step="0.01"
          min="0"
          max="4"
          placeholder="3.50"
          {...register("gpa")}
        />
        <p className="text-sm text-muted-foreground">
          {t("apply.step2.gpaHelper")}
        </p>
      </div>
    </div>
  )
}
