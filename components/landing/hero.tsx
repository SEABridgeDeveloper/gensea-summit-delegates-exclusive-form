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
      {/* Background with gradient overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1563492065599-3520f775eeed?q=80&w=2574&auto=format&fit=crop')`,
        }}
      >
        {/* Navy gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/80 to-navy-900/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
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
            className={`text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("hero.headline")}
          </h1>

          {/* Sub-headline */}
          <p
            className={`text-2xl md:text-4xl lg:text-5xl font-semibold text-white/90 transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("hero.subHeadline")}
          </p>

          {/* Tertiary line */}
          <p
            className={`text-lg md:text-2xl text-white/80 transition-all duration-700 delay-300 ${
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
            <p className="text-sm md:text-base font-medium tracking-widest">
              <span className="text-white">GEN SEA SUMMIT</span>{" "}
              <span className="text-gold-500">2026</span>{" "}
              <span className="text-white">— DELEGATES</span>
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
              className="bg-red-500 hover:bg-red-600 text-white font-medium px-8 py-6 text-base"
            >
              <Link href="/apply">
                {t("hero.primaryCta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-base"
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
        <ChevronDown className="h-6 w-6 text-white/50" />
      </div>
    </section>
  )
}
