"use client"

import { useI18n } from "@/lib/i18n"
import { useEffect, useRef, useState } from "react"

export function ThemeSection() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="theme"
      ref={sectionRef}
      className="py-24 md:py-32 bg-navy-900"
    >
      <div className="container mx-auto px-4">
        <div
          className={`max-w-4xl mx-auto text-center space-y-8 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Title */}
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              {t("theme.title")}
            </h2>
            <p className="text-xl md:text-2xl text-gold-500 font-medium">
              {t("theme.subtitle")}
            </p>
          </div>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gold-500/30" />
            <div className="h-2 w-2 rounded-full bg-gold-500" />
            <div className="h-px w-16 bg-gold-500/30" />
          </div>

          {/* Body text */}
          <p className="text-lg md:text-xl text-navy-100 leading-relaxed">
            {t("theme.body")}
          </p>
        </div>
      </div>
    </section>
  )
}
