"use client";

import { useEffect, useRef, useState } from "react";
import {
  Ticket,
  Users,
  GraduationCap,
  Trophy,
  Rocket,
  MapPin,
} from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";

const benefitIcons = [Ticket, Users, GraduationCap, Trophy, Rocket, MapPin];

type Benefit = { value: string; label: string };

export function BenefitsList() {
  const { t, tRaw } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const benefits = tRaw<Benefit[]>("benefits.items") ?? [];
  const heading = t("benefits.heading");
  const safeHeading = heading.startsWith("benefits.") ? "" : heading;

  if (benefits.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="border-y border-cream-200/70 bg-white py-16 sm:py-20"
    >
      <div className="container mx-auto px-4">
        {safeHeading && (
          <h2
            className={`mb-12 text-center font-display text-3xl font-bold text-navy transition-all duration-700 md:text-4xl ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            {safeHeading}
          </h2>
        )}

        {/* Horizontal stats strip — scrolls horizontally on mobile, fits in row on lg+ */}
        <div className="overflow-x-auto -mx-4 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="mx-auto flex min-w-max items-start justify-between gap-6 sm:gap-8 lg:min-w-0 lg:max-w-6xl lg:gap-4">
            {benefits.map((benefit, index) => {
              const Icon = benefitIcons[index] ?? Ticket;
              return (
                <li
                  key={benefit.label}
                  className={`flex w-32 flex-col items-center text-center transition-all duration-500 sm:w-36 lg:w-auto lg:flex-1 ${
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  {/* Coral icon halo */}
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-coral-500 shadow-sm">
                    <Icon
                      className="h-6 w-6 text-navy"
                      strokeWidth={1.75}
                    />
                  </div>

                  {/* Big value */}
                  <p className="mt-4 font-display text-2xl font-extrabold leading-tight text-navy sm:text-3xl">
                    {benefit.value}
                  </p>

                  {/* Small label */}
                  <p className="mt-2 max-w-[12rem] text-sm leading-snug text-navy/65">
                    {benefit.label}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}