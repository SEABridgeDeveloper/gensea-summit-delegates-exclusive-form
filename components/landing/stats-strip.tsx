"use client"

import { useI18n } from "@/lib/i18n"
import { Ticket, Users, GraduationCap, Trophy, Rocket, MapPin } from "lucide-react"

const icons = [Ticket, Users, GraduationCap, Trophy, Rocket, MapPin]

export function StatsStrip() {
  const { messages } = useI18n()
  const stats = messages.stats

  const statItems = [
    { key: "access", icon: icons[0], ...stats.access },
    { key: "attendees", icon: icons[1], ...stats.attendees },
    { key: "bootcamp", icon: icons[2], ...stats.bootcamp },
    { key: "scholarship", icon: icons[3], ...stats.scholarship },
    { key: "fastTrack", icon: icons[4], ...stats.fastTrack },
    { key: "location", icon: icons[5], ...stats.location },
  ]

  return (
    <section id="stats" className="py-12 bg-white border-y border-cream-200">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto gap-8 pb-4 md:pb-0 md:grid md:grid-cols-6 md:gap-6 scrollbar-hide">
          {statItems.map((stat) => (
            <div
              key={stat.key}
              className="flex-shrink-0 flex flex-col items-center text-center gap-3 min-w-[140px] md:min-w-0"
            >
              {/* Coral icon halo - the "sun-warmed circle" style */}
              <div className="w-14 h-14 rounded-full bg-coral-500 flex items-center justify-center">
                <stat.icon className="h-7 w-7 text-navy-900" strokeWidth={1.75} />
              </div>
              <p className="text-lg md:text-xl font-bold text-navy-900 whitespace-nowrap">
                {stat.value}
              </p>
              <p className="text-xs md:text-sm text-navy-700 leading-tight">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
