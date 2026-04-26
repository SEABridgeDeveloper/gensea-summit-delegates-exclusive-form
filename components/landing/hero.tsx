"use client"

import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"

export function Hero() {
  const { t } = useI18n()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background with warm cream gradient overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1563492065599-3520f775eeed?q=80&w=2574&auto=format&fit=crop')`,
        }}
      >
        {/* Warm sunset cream gradient overlay - preserving golden hour warmth */}
        <div className="absolute inset-0 bg-gradient-to-t from-cream-50 via-cream-50/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-16">
        <div
          className={`space-y-6 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Eyebrow */}
          <p className="text-gold-500 text-sm md:text-base uppercase tracking-widest font-medium">
            {t("hero.eyebrow")}
          </p>

          {/* Headline */}
          <h1
            className={`text-5xl md:text-7xl lg:text-8xl font-bold text-navy-900 tracking-tight transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("hero.headline")}
          </h1>

          {/* Sub-headline */}
          <p
            className={`text-2xl md:text-4xl lg:text-5xl font-semibold text-navy-700 transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("hero.subHeadline")}
          </p>

          {/* Tertiary line */}
          <p
            className={`text-lg md:text-2xl text-navy-700 transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("hero.tertiary")}
          </p>

          {/* Brand mark */}
          <div
            className={`pt-4 transition-all duration-700 delay-400 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <p className="text-base md:text-lg font-bold tracking-widest uppercase">
              <span className="text-navy-900">GEN SEA SUMMIT</span>{" "}
              <span className="text-red-500">2026</span>{" "}
              <span className="text-navy-900">DELEGATES</span>
            </p>
          </div>

          {/* CTAs */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 transition-all duration-700 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Button
              asChild
              size="lg"
              className="bg-red-500 hover:bg-red-600 text-white font-medium px-8 py-6 text-base rounded-md"
            >
              <Link href="/apply">
                {t("hero.primaryCta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-navy-900 text-navy-900 hover:bg-navy-900/5 px-8 py-6 text-base rounded-md"
              onClick={() => {
                document
                  .getElementById("stats")
                  ?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              {t("hero.secondaryCta")}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-6 w-6 text-navy-300" />
      </div>
    </section>
  )
}
