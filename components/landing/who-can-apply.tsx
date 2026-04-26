"use client"

import { useI18n } from "@/lib/i18n"
import { useEffect, useRef, useState } from "react"

export function WhoCanApply() {
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
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 bg-cream-50">
      <div className="container mx-auto px-4">
        <div
          className={`max-w-2xl mx-auto text-center space-y-6 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900">
            {t("whoCanApply.title")}
          </h2>
          <div className="space-y-2">
            <p className="text-xl md:text-2xl text-navy-700 font-medium">
              {t("whoCanApply.line1")}
            </p>
            <p className="text-lg text-navy-700">
              {t("whoCanApply.line2")}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
