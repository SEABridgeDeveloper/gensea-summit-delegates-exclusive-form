"use client"

import { useI18n } from "@/lib/i18n"
import { useEffect, useRef, useState } from "react"
import {
  Ticket,
  Users,
  GraduationCap,
  Trophy,
  Rocket,
  MapPin,
} from "lucide-react"

const benefitIcons = [Ticket, Users, GraduationCap, Trophy, Rocket, MapPin]

export function BenefitsList() {
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

  const benefits = messages.benefits.items

  return (
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2
          className={`text-3xl md:text-4xl font-bold text-navy-900 text-center mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {t("benefits.title")}
        </h2>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefitIcons[index] || Ticket
              return (
                <div
                  key={index}
                  className={`flex items-start gap-4 transition-all duration-500 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Coral icon halo - matching the warm sun-icon style from the poster */}
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-coral-500 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-navy-900" strokeWidth={1.75} />
                  </div>
                  <p className="text-lg text-navy-900 pt-2">{benefit}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
