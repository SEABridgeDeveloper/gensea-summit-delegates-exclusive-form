"use client"

import { useI18n } from "@/lib/i18n"
import { useEffect, useRef, useState } from "react"

export function Timeline() {
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

  const milestones = messages.timeline.milestones

  return (
    <section id="timeline" ref={sectionRef} className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2
          className={`text-3xl md:text-4xl font-bold text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {t("timeline.title")}
        </h2>

        {/* Desktop horizontal timeline */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />

            {/* Milestones */}
            <div className="relative flex justify-between">
              {milestones.map((milestone, index) => {
                const isLast = index === milestones.length - 1
                return (
                  <div
                    key={index}
                    className={`flex flex-col items-center transition-all duration-500 ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                    style={{
                      transitionDelay: `${index * 100}ms`,
                      width: `${100 / milestones.length}%`,
                    }}
                  >
                    {/* Dot */}
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center z-10 ${
                        isLast
                          ? "bg-red-500"
                          : "bg-gold-500"
                      }`}
                    >
                      <div className="h-3 w-3 rounded-full bg-white" />
                    </div>
                    {/* Date */}
                    <p
                      className={`mt-4 text-sm font-semibold ${
                        isLast ? "text-red-500" : "text-gold-500"
                      }`}
                    >
                      {milestone.date}
                    </p>
                    {/* Label */}
                    <p
                      className={`mt-2 text-center text-sm ${
                        isLast ? "font-bold" : "text-muted-foreground"
                      }`}
                    >
                      {milestone.label}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Mobile vertical timeline */}
        <div className="md:hidden">
          <div className="relative pl-8">
            {/* Line */}
            <div className="absolute top-0 bottom-0 left-3 w-0.5 bg-border" />

            {/* Milestones */}
            <div className="space-y-8">
              {milestones.map((milestone, index) => {
                const isLast = index === milestones.length - 1
                return (
                  <div
                    key={index}
                    className={`relative transition-all duration-500 ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {/* Dot */}
                    <div
                      className={`absolute -left-5 h-6 w-6 rounded-full flex items-center justify-center ${
                        isLast ? "bg-red-500" : "bg-gold-500"
                      }`}
                    >
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                    {/* Content */}
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          isLast ? "text-red-500" : "text-gold-500"
                        }`}
                      >
                        {milestone.date}
                      </p>
                      <p
                        className={`mt-1 ${
                          isLast ? "font-bold" : "text-muted-foreground"
                        }`}
                      >
                        {milestone.label}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
