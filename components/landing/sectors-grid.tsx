"use client"

import { useI18n } from "@/lib/i18n"
import { Heart, Utensils, Cpu, Palette, BookOpen } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const sectorIcons = [Heart, Utensils, Cpu, Palette, BookOpen]

export function SectorsGrid() {
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

  const sectors = messages.sectors.items

  return (
    <section id="sectors" ref={sectionRef} className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section title */}
        <h2
          className={`text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {t("sectors.title")}
        </h2>

        {/* Grid - 2-2-1 layout on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {sectors.map((sector, index) => {
            const Icon = sectorIcons[index]
            return (
              <div
                key={index}
                className={`group p-8 rounded-xl border border-cream-200 bg-white hover:border-coral-500 transition-all duration-300 hover:-translate-y-0.5 ${
                  index === 4 ? "lg:col-start-2" : ""
                } ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Coral icon halo */}
                <div className="w-16 h-16 rounded-full bg-coral-500 flex items-center justify-center mb-6">
                  <Icon className="h-8 w-8 text-navy-900" strokeWidth={1.75} />
                </div>
                <h3 className="text-xl font-semibold text-navy-900 mb-2">{sector.name}</h3>
                <p className="text-navy-700">{sector.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
