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
    <section id="stats" className="py-8 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto gap-6 pb-4 md:pb-0 md:grid md:grid-cols-6 md:gap-4 scrollbar-hide">
          {statItems.map((stat) => (
            <div
              key={stat.key}
              className="flex-shrink-0 flex flex-col items-center text-center gap-2 min-w-[140px] md:min-w-0"
            >
              <stat.icon className="h-6 w-6 text-gold-500" />
              <p className="text-lg md:text-xl font-bold text-foreground whitespace-nowrap">
                {stat.value}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground leading-tight">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
