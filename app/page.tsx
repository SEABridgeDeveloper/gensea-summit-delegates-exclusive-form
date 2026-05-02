import { Suspense } from "react";
import { Footer } from "@/components/shared/footer";
import { Hero } from "@/components/landing/hero";
import { StatsStrip } from "@/components/landing/stats-strip";
import { ThemeSection } from "@/components/landing/theme-section";
import { FinalCta } from "@/components/landing/final-cta";
import { TracksArea } from "@/components/landing/tracks-area";
import { SkipToContent } from "@/components/shared/skip-to-content";

export default function HomePage() {
  return (
    <>
      {/* Skip-to-content lives on the page root now that the sticky header
          is gone. Hidden until focused — keyboard/screen-reader users can
          still jump past the hero straight into <main>. */}
      <SkipToContent />
      <main id="main">
        <Hero />
        <StatsStrip />
        <ThemeSection />
        <Suspense fallback={<div className="min-h-[24rem] bg-ink-900" aria-hidden />}>
          <TracksArea />
        </Suspense>
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
