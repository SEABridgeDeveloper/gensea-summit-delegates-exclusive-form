import { Suspense } from "react";
import { AdvisorUploadView } from "./view";

export const metadata = {
  title: "Recommendation letter — Gen SEA Summit 2026",
};

export default function AdvisorUploadPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-ink">
          <span className="text-sm text-bone-muted">Loading…</span>
        </div>
      }
    >
      <AdvisorUploadView />
    </Suspense>
  );
}
