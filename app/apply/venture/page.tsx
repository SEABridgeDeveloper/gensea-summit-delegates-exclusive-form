"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";
import { ApplyProgress } from "@/components/apply/progress";
import { BrandMark } from "@/components/shared/brand-mark";
import { LanguageToggle } from "@/components/shared/language-toggle";
import { FounderStep } from "./steps/founder";
import { VentureStep } from "./steps/venture";
import { TractionStep } from "./steps/traction";
import { DocumentsStep } from "./steps/documents";
import { ConsentStep } from "./steps/consent";
import type {
  FounderValues,
  VentureValues,
  TractionValues,
  DocumentsValues,
  ConsentValues,
} from "@/lib/schemas";

type WizardData = {
  founder?: FounderValues;
  venture?: VentureValues;
  traction?: TractionValues;
  documents?: DocumentsValues;
  consent?: ConsentValues;
};

const STORAGE_KEY = "gen-sea-venture-draft";

export default function VentureApplyPage() {
  const { t } = useLocale();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setData(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Strip File before serialising — pitch deck won't survive JSON round-trip.
    const persistable: WizardData = {
      ...data,
      documents: data.documents
        ? { ...data.documents, pitchDeck: undefined as unknown as File }
        : undefined,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
  }, [data]);

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmitFinal = async (consent: ConsentValues) => {
    const payload: WizardData = { ...data, consent };
    const logSafe = {
      ...payload,
      documents: payload.documents
        ? {
            ...payload.documents,
            pitchDeck:
              payload.documents.pitchDeck instanceof File
                ? {
                    name: payload.documents.pitchDeck.name,
                    size: payload.documents.pitchDeck.size,
                    type: payload.documents.pitchDeck.type,
                  }
                : payload.documents.pitchDeck,
          }
        : undefined,
    };
    // eslint-disable-next-line no-console
    console.log("[gen-sea] venture application submitted", logSafe);
    await new Promise((r) => setTimeout(r, 400));
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
    router.push("/apply/venture/success");
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="border-b border-navy/10 bg-cream-50/80 backdrop-blur">
        <div className="container-page flex items-center justify-between py-4">
          <Link href="/" className="inline-flex items-center gap-3">
            <BrandMark />
          </Link>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Link href="/apply" className="btn-ghost hidden sm:inline-flex">
              <ArrowLeft className="h-4 w-4" /> {t("apply.backToPicker")}
            </Link>
          </div>
        </div>
      </header>

      <main className="container-page max-w-3xl pb-24 pt-10 sm:pt-16">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-navy sm:text-5xl">
            {t("apply.venture.title")}
          </h1>
          <p className="mt-3 max-w-2xl text-base text-navy/70">{t("apply.venture.subtitle")}</p>
        </div>

        <div className="mb-10 top-[68px] z-20 -mx-5 bg-cream-50/90 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8">
          <ApplyProgress current={step} flow="venture" />
        </div>

        <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-soft sm:p-10">
          {step === 1 && (
            <FounderStep
              defaultValues={data.founder}
              onNext={(v) => {
                setData((d) => ({ ...d, founder: v }));
                setStep(2);
              }}
            />
          )}
          {step === 2 && (
            <VentureStep
              defaultValues={data.venture}
              onNext={(v) => {
                setData((d) => ({ ...d, venture: v }));
                setStep(3);
              }}
              onBack={goBack}
            />
          )}
          {step === 3 && (
            <TractionStep
              defaultValues={data.traction}
              onNext={(v) => {
                setData((d) => ({ ...d, traction: v }));
                setStep(4);
              }}
              onBack={goBack}
            />
          )}
          {step === 4 && (
            <DocumentsStep
              defaultValues={data.documents}
              onNext={(v) => {
                setData((d) => ({ ...d, documents: v }));
                setStep(5);
              }}
              onBack={goBack}
            />
          )}
          {step === 5 && (
            <ConsentStep
              defaultValues={data.consent}
              onSubmit={handleSubmitFinal}
              onBack={goBack}
            />
          )}
        </div>
      </main>
    </div>
  );
}
