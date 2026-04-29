import { Suspense } from "react";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Hero } from "@/components/landing/hero";
import { ThemeSection } from "@/components/landing/theme-section";
import { FinalCta } from "@/components/landing/final-cta";
import { TracksArea } from "@/components/landing/tracks-area";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <ThemeSection />
        <Suspense fallback={<div className="min-h-[24rem] bg-cream-50" aria-hidden />}>
          <TracksArea />
        </Suspense>
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
