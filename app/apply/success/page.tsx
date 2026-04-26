"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/shared/header"
import { Footer } from "@/components/shared/footer"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowLeft } from "lucide-react"

export default function SuccessPage() {
  const { t } = useI18n()
  const [email, setEmail] = useState<string>("")

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("applicantEmail")
    if (storedEmail) {
      setEmail(storedEmail)
      sessionStorage.removeItem("applicantEmail")
    }
  }, [])

  return (
    <>
      <Header />
      <main className="min-h-[80vh] flex items-center justify-center bg-cream-50 py-12">
        <div className="container mx-auto px-4 max-w-lg">
          <div className="text-center space-y-6">
            {/* Large gold checkmark icon */}
            <div className="flex justify-center">
              <div className="h-24 w-24 rounded-full bg-gold-500/20 flex items-center justify-center">
                <CheckCircle className="h-14 w-14 text-gold-500" />
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-3xl md:text-4xl font-bold text-navy-900">
              {t("success.title")}
            </h1>

            {/* Body */}
            <p className="text-lg text-navy-700 leading-relaxed">
              {t("success.body", { email: email || "your email" })}
            </p>

            {/* Button */}
            <div className="pt-4">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-navy-900 text-navy-900 hover:bg-navy-900/5"
              >
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t("success.button")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
