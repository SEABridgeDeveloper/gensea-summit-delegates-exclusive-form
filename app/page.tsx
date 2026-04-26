"use client"

import { Header } from "@/components/shared/header"
import { Hero } from "@/components/landing/hero"
import { StatsStrip } from "@/components/landing/stats-strip"
import { ThemeSection } from "@/components/landing/theme-section"
import { SectorsGrid } from "@/components/landing/sectors-grid"
import { WhoCanApply } from "@/components/landing/who-can-apply"
import { BenefitsList } from "@/components/landing/benefits-list"
import { HowToGetIn } from "@/components/landing/how-to-get-in"
import { Timeline } from "@/components/landing/timeline"
import { FinalCta } from "@/components/landing/final-cta"
import { Footer } from "@/components/shared/footer"

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <StatsStrip />
      <ThemeSection />
      <SectorsGrid />
      <WhoCanApply />
      <BenefitsList />
      <HowToGetIn />
      <Timeline />
      <FinalCta />
      <Footer />
    </main>
  )
}
