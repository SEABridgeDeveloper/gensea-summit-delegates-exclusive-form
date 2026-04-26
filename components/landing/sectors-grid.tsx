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
    <section id="sectors" ref={sectionRef} className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section title */}
        <h2
          className={`text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {t("sectors.title")}
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectors.map((sector, index) => {
            const Icon = sectorIcons[index]
            return (
              <div
                key={index}
                className={`group p-8 rounded-xl border border-border bg-card hover:border-gold-500 transition-all duration-300 hover:-translate-y-0.5 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Icon className="h-12 w-12 text-gold-500 mb-6" />
                <h3 className="text-xl font-semibold mb-2">{sector.name}</h3>
                <p className="text-muted-foreground">{sector.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
