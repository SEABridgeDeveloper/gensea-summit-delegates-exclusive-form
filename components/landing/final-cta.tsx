"use client"

import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function FinalCta() {
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
    <section ref={sectionRef} className="py-24 bg-red-500">
      <div className="container mx-auto px-4">
        <div
          className={`max-w-2xl mx-auto text-center space-y-6 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            {t("finalCta.heading")}
          </h2>
          <p className="text-lg text-white/90">{t("finalCta.sub")}</p>
          <div className="pt-4">
            {/* Inverted button - white bg, red text */}
            <Button
              asChild
              size="lg"
              className="bg-white hover:bg-cream-100 text-red-500 font-medium px-8 py-6 text-base rounded-md"
            >
              <Link href="/apply">
                {t("finalCta.button")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
