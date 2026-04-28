"use client";

import { Calendar, Users, BadgeDollarSign, GraduationCap, Rocket, MapPin } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";

const ICONS = [Calendar, Users, BadgeDollarSign, GraduationCap, Rocket, MapPin];

type Item = { label: string; value: string };

export function StatsStrip() {
  const { tRaw } = useLocale();
  const items = tRaw<Item[]>("stats.items") ?? [];

  return (
    <section id="program" className="bg-cream-50">
      <div className="container-page py-16 sm:py-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = ICONS[i] ?? Calendar;
            return (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-2xl border border-navy/10 bg-white p-5 shadow-soft"
              >
                <span className="icon-halo">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <div className="font-display text-2xl font-bold text-navy">{item.value}</div>
                  <div className="text-sm text-navy/65">{item.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
