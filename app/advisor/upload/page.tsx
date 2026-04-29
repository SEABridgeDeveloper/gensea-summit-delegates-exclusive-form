import { Suspense } from "react";
import { AdvisorUploadView } from "./view";

export const metadata = {
  title: "Recommendation letter — Gen SEA Summit 2026",
};

export default function AdvisorUploadPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-cream-50">
          <span className="text-sm text-navy/70">Loading…</span>
        </div>
      }
    >
      <AdvisorUploadView />
    </Suspense>
  );
}
