"use client"

import { useFormContext, Controller } from "react-hook-form"
import { useI18n } from "@/lib/i18n"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Upload, FileText, X } from "lucide-react"
import { useRef, useState } from "react"
import type { ApplicationFormData } from "@/lib/form-schema"

export function RecommenderStep() {
  const { t, messages } = useI18n()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileSize, setFileSize] = useState<string | null>(null)

  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<ApplicationFormData>()

  const titleOptions = messages.apply.step3.titles

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setValue("letterFile", file, { shouldValidate: true })
      setFileName(file.name)
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`)
    }
  }

  const handleRemoveFile = () => {
    setValue("letterFile", undefined as unknown as File, { shouldValidate: true })
    setFileName(null)
    setFileSize(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{t("apply.step3.title")}</h2>

      {/* Professor's full name */}
      <div className="space-y-2">
        <Label htmlFor="profName">
          {t("apply.step3.profName")} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="profName"
          placeholder="e.g. Dr. Somchai Prasert"
          {...register("profName")}
          aria-required="true"
          aria-invalid={!!errors.profName}
        />
        {errors.profName && (
          <p className="text-sm text-red-500" role="alert">
            {errors.profName.message}
          </p>
        )}
      </div>

      {/* Professor's institutional email */}
      <div className="space-y-2">
        <Label htmlFor="profEmail">
          {t("apply.step3.profEmail")} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="profEmail"
          type="email"
          placeholder="somchai.p@chula.ac.th"
          {...register("profEmail")}
          aria-required="true"
          aria-invalid={!!errors.profEmail}
        />
        {errors.profEmail && (
          <p className="text-sm text-red-500" role="alert">
            {t("apply.step3.profEmailError")}
          </p>
        )}
      </div>

      {/* Professor's title */}
      <div className="space-y-2">
        <Label>
          {t("apply.step3.profTitle")} <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="profTitle"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger aria-required="true" aria-invalid={!!errors.profTitle}>
                <SelectValue placeholder="Select title" />
              </SelectTrigger>
              <SelectContent>
                {titleOptions.map((title, index) => (
                  <SelectItem key={index} value={title}>
                    {title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.profTitle && (
          <p className="text-sm text-red-500" role="alert">
            {errors.profTitle.message}
          </p>
        )}
      </div>

      {/* Recommendation letter */}
      <div className="space-y-2">
        <Label>
          {t("apply.step3.letter")} <span className="text-red-500">*</span>
        </Label>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileSelect}
          className="hidden"
          aria-label="Upload recommendation letter"
        />

        {fileName ? (
          <div className="flex items-center gap-4 p-4 border border-border rounded-lg bg-muted/50">
            <FileText className="h-8 w-8 text-gold-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{fileName}</p>
              <p className="text-sm text-muted-foreground">{fileSize}</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemoveFile}
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-24 border-dashed flex flex-col gap-2"
            aria-invalid={!!errors.letterFile}
          >
            <Upload className="h-6 w-6 text-muted-foreground" />
            <span className="text-muted-foreground">
              Click to upload PDF
            </span>
          </Button>
        )}

        <p className="text-sm text-muted-foreground">
          {t("apply.step3.letterHelper")}
        </p>
        {errors.letterFile && (
          <p className="text-sm text-red-500" role="alert">
            {errors.letterFile.message as string}
          </p>
        )}
      </div>
    </div>
  )
}
