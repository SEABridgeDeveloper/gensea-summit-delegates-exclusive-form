import { Suspense } from "react";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { Hero } from "@/components/landing/hero";
import { StatsStrip } from "@/components/landing/stats-strip";
import { ThemeSection } from "@/components/landing/theme-section";
import { SectorsGrid } from "@/components/landing/sectors-grid";
import { FinalCta } from "@/components/landing/final-cta";
import { TracksArea } from "@/components/landing/tracks-area";
import { SkipToContent } from "@/components/shared/skip-to-content";

export default function HomePage() {
  return (
    <>
      <SkipToContent />
      <Header />
      <main id="main">
        <Hero />
        <StatsStrip />
        <ThemeSection />
        <SectorsGrid />
        <Suspense fallback={<div className="min-h-[24rem] bg-ink" aria-hidden />}>
          <TracksArea />
        </Suspense>
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
