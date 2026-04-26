"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Header } from "@/components/shared/header"
import { Footer } from "@/components/shared/footer"
import { useI18n } from "@/lib/i18n"
import { applicationFormSchema, type ApplicationFormData } from "@/lib/form-schema"
import { IdentityStep } from "./steps/identity"
import { AcademicStep } from "./steps/academic"
import { RecommenderStep } from "./steps/recommender"
import { EssayStep } from "./steps/essay"
import { LogisticsStep } from "./steps/logistics"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"

const TOTAL_STEPS = 5

export default function ApplyPage() {
  const { t, messages } = useI18n()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const methods = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationFormSchema),
    mode: "onChange",
    defaultValues: {
      nameTh: "",
      nameEn: "",
      email: "",
      phone: "",
      lineId: "",
      discord: "",
      universityId: "",
      faculty: "",
      department: "",
      yearOfStudy: "",
      gpa: "",
      profName: "",
      profEmail: "",
      profTitle: "",
      letterFile: undefined,
      essay: "",
      needAccommodation: undefined,
      dietary: [],
      allergies: "",
      accessibility: "",
      emergencyName: "",
      emergencyPhone: "",
      emergencyRelation: "",
      consent1: false,
      consent2: false,
      consent3: false,
    },
  })

  const stepFields: Record<number, (keyof ApplicationFormData)[]> = {
    1: ["nameTh", "nameEn", "email", "phone", "lineId", "discord"],
    2: ["universityId", "faculty", "department", "yearOfStudy", "gpa"],
    3: ["profName", "profEmail", "profTitle", "letterFile"],
    4: ["essay"],
    5: [
      "needAccommodation",
      "dietary",
      "allergies",
      "accessibility",
      "emergencyName",
      "emergencyPhone",
      "emergencyRelation",
      "consent1",
      "consent2",
      "consent3",
    ],
  }

  const validateCurrentStep = async () => {
    const fields = stepFields[currentStep]
    const result = await methods.trigger(fields)
    return result
  }

  const handleNext = async () => {
    const isValid = await validateCurrentStep()
    if (isValid && currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true)
    console.log("Application submitted:", data)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Store email for success page
    sessionStorage.setItem("applicantEmail", data.email)

    router.push("/apply/success")
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <IdentityStep />
      case 2:
        return <AcademicStep />
      case 3:
        return <RecommenderStep />
      case 4:
        return <EssayStep />
      case 5:
        return <LogisticsStep />
      default:
        return null
    }
  }

  const stepNames = messages.apply.steps

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-navy-900 text-center mb-8">
            {t("apply.title")}
          </h1>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {stepNames.map((name, index) => (
                <span
                  key={index}
                  className={`text-xs md:text-sm font-medium ${
                    index + 1 <= currentStep
                      ? "text-gold-500"
                      : "text-navy-300"
                  }`}
                >
                  <span className="hidden md:inline">{name}</span>
                  <span className="md:hidden">{index + 1}</span>
                </span>
              ))}
            </div>
            <Progress value={(currentStep / TOTAL_STEPS) * 100} className="h-2" />
            <p className="text-center text-sm text-navy-700 mt-2">
              {currentStep} / {TOTAL_STEPS}
            </p>
          </div>

          {/* Form */}
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
              {/* Current step */}
              <div className="bg-white border border-cream-200 rounded-xl p-6 md:p-8">
                {renderStep()}
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="flex-1 border-navy-900 text-navy-900 hover:bg-navy-900/5"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t("apply.back")}
                </Button>

                {currentStep < TOTAL_STEPS ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  >
                    {t("apply.continue")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        {t("apply.submit")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </FormProvider>
        </div>
      </main>
      <Footer />
    </>
  )
}
