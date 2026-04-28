"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";
import { ApplyProgress } from "@/components/apply/progress";
import { BrandMark } from "@/components/shared/brand-mark";
import { LanguageToggle } from "@/components/shared/language-toggle";
import { IdentityStep } from "./steps/identity";
import { AcademicStep } from "./steps/academic";
import { RecommenderStep } from "./steps/recommender";
import { EssayStep } from "./steps/essay";
import { LogisticsStep } from "./steps/logistics";
import type {
  IdentityValues,
  AcademicValues,
  RecommenderValues,
  EssayValues,
  LogisticsValues,
} from "@/lib/schemas";

type WizardData = {
  identity?: IdentityValues;
  academic?: AcademicValues;
  recommender?: RecommenderValues;
  essay?: EssayValues;
  logistics?: LogisticsValues;
};

const STORAGE_KEY = "1967-application-draft";

export default function ApplyPage() {
  const { t } = useLocale();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>({});
  const [submitting, setSubmitting] = useState(false);

  // Restore non-file fields from localStorage on mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setData(JSON.parse(raw));
    } catch {
      // ignore corrupt drafts
    }
  }, []);

  // Persist (sans File) on every change.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const persistable: WizardData = {
      ...data,
      recommender: data.recommender
        ? { ...data.recommender, letter: undefined as unknown as File }
        : undefined,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
  }, [data]);

  // Scroll to top when changing step.
  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmitFinal = async (logistics: LogisticsValues) => {
    const payload: WizardData = { ...data, logistics };
    setSubmitting(true);
    // Mock submit — log payload to console (with redacted file metadata) and redirect.
    const logSafe = {
      ...payload,
      recommender: payload.recommender
        ? {
            ...payload.recommender,
            letter:
              payload.recommender.letter instanceof File
                ? {
                    name: payload.recommender.letter.name,
                    size: payload.recommender.letter.size,
                    type: payload.recommender.letter.type,
                  }
                : payload.recommender.letter,
          }
        : undefined,
    };
    // eslint-disable-next-line no-console
    console.log("[1967] application submitted", logSafe);
    await new Promise((r) => setTimeout(r, 400));
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
    router.push("/apply/delegate/success");
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
            <Link href="/" className="btn-ghost hidden sm:inline-flex">
              <ArrowLeft className="h-4 w-4" /> {t("apply.header.back")}
            </Link>
          </div>
        </div>
      </header>

      <main className="container-page max-w-3xl pb-24 pt-10 sm:pt-16">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-navy sm:text-5xl">
            {t("apply.header.title")}
          </h1>
          <p className="mt-3 max-w-2xl text-base text-navy/70">{t("apply.header.subtitle")}</p>
        </div>

        <div className="mb-10  top-[68px] z-20 -mx-5 bg-cream-50/90 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8">
          <ApplyProgress current={step} />
        </div>

        <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-soft sm:p-10">
          {step === 1 && (
            <IdentityStep
              defaultValues={data.identity}
              onValid={(v) => {
                setData((d) => ({ ...d, identity: v }));
                setStep(2);
              }}
            />
          )}
          {step === 2 && (
            <AcademicStep
              defaultValues={data.academic}
              onValid={(v) => {
                setData((d) => ({ ...d, academic: v }));
                setStep(3);
              }}
              onBack={goBack}
            />
          )}
          {step === 3 && (
            <RecommenderStep
              defaultValues={data.recommender}
              onValid={(v) => {
                setData((d) => ({ ...d, recommender: v }));
                setStep(4);
              }}
              onBack={goBack}
            />
          )}
          {step === 4 && (
            <EssayStep
              defaultValues={data.essay}
              onValid={(v) => {
                setData((d) => ({ ...d, essay: v }));
                setStep(5);
              }}
              onBack={goBack}
            />
          )}
          {step === 5 && (
            <LogisticsStep
              defaultValues={data.logistics}
              onValid={handleSubmitFinal}
              onBack={goBack}
              submitting={submitting}
            />
          )}
        </div>
      </main>
    </div>
  );
}
