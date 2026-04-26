"use client"

import { useI18n } from "@/lib/i18n"
import { useEffect, useRef, useState } from "react"
import { Star } from "lucide-react"

export function HowToGetIn() {
  const { t, messages } = useI18n()
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

  const steps = messages.howToGetIn.steps

  return (
    <section ref={sectionRef} className="py-24 bg-cream-100">
      <div className="container mx-auto px-4">
        <h2
          className={`text-3xl md:text-4xl font-bold text-navy-900 text-center mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {t("howToGetIn.title")}
        </h2>

        <div className="max-w-3xl mx-auto">
          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-start gap-6 transition-all duration-500 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Red circle numeral - matches poster */}
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-lg">
                  {index + 1}
                </div>
                {/* Content */}
                <div>
                  <h3 className="text-xl font-semibold text-navy-900 mb-1">{step.title}</h3>
                  <p className="text-navy-700">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Caveat box - gold-500 left border */}
          <div
            className={`mt-12 p-6 rounded-r-xl bg-cream-50 border-l-4 border-gold-500 flex items-start gap-4 transition-all duration-700 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Star className="h-5 w-5 text-gold-500 flex-shrink-0 mt-0.5" fill="currentColor" />
            <p className="text-navy-900 font-medium">
              {t("howToGetIn.caveat")}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
