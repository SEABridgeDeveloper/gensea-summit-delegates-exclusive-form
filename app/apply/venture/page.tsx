"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2, Upload } from "lucide-react";
import {
  startupApplicationSchema,
  SECTORS,
  type StartupApplicationValues,
} from "@/lib/schemas/startup";
import { BrandMark } from "@/components/shared/brand-mark";
import { FormError } from "@/components/apply/field-error";
import { DraftIndicator, type DraftState } from "@/components/apply/draft-indicator";

const DRAFT_KEY = "gen-sea-startup-draft-v2";
const APPLICATION_DEADLINE = "23 May 2026";

const SECTOR_LABELS: Record<(typeof SECTORS)[number], string> = {
  wellness: "Wellness",
  food: "Food",
  ai: "AI",
  creative: "Creative",
  education: "Education",
};

type DraftShape = Omit<StartupApplicationValues, "pitchDeck" | "videoFile" | "founderAge"> & {
  founderAge?: string | number;
  pitchDeck?: { name: string; size: number; type: string };
  videoFile?: { name: string; size: number; type: string };
};

export default function StartupApplyPage() {
  const router = useRouter();
  const [draftState, setDraftState] = useState<DraftState>("idle");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const form = useForm<StartupApplicationValues>({
    resolver: zodResolver(startupApplicationSchema),
    mode: "onBlur",
    defaultValues: {
      legalName: "",
      foundingDate: "",
      incorporationCountry: "",
      sector: undefined as unknown as StartupApplicationValues["sector"],
      founderName: "",
      founderEmail: "",
      founderPhone: "",
      founderAge: undefined as unknown as number,
      founderGraduatedWithin5: false,
      pitchDeck: undefined,
      videoUrl: "",
      videoFile: undefined,
    },
  });

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;

  const pitchDeck = watch("pitchDeck") as File | undefined;
  const videoFile = watch("videoFile") as File | undefined;

  // Restore draft on mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as DraftShape;
      (Object.keys(draft) as (keyof DraftShape)[]).forEach((k) => {
        const v = draft[k];
        if (k === "pitchDeck" || k === "videoFile") return;
        if (v !== undefined && v !== null) {
          setValue(k as keyof StartupApplicationValues, v as never, {
            shouldValidate: false,
          });
        }
      });
    } catch {}
  }, [setValue]);

  // Persist on change (debounced).
  useEffect(() => {
    const sub = watch((values) => {
      setDraftState("saving");
      if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
      draftTimerRef.current = setTimeout(() => {
        if (typeof window === "undefined") return;
        const persistable = {
          ...values,
          pitchDeck:
            values.pitchDeck instanceof File
              ? {
                  name: values.pitchDeck.name,
                  size: values.pitchDeck.size,
                  type: values.pitchDeck.type,
                }
              : undefined,
          videoFile:
            values.videoFile instanceof File
              ? {
                  name: values.videoFile.name,
                  size: values.videoFile.size,
                  type: values.videoFile.type,
                }
              : undefined,
        };
        try {
          window.localStorage.setItem(DRAFT_KEY, JSON.stringify(persistable));
          setDraftState("saved");
        } catch {
          setDraftState("idle");
        }
      }, 400);
    });
    return () => {
      sub.unsubscribe();
      if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    };
  }, [watch]);

  const onSubmit = async (values: StartupApplicationValues) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (v instanceof File) fd.append(k, v);
        else if (typeof v === "boolean") fd.append(k, String(v));
        else if (v !== undefined && v !== null && v !== "") fd.append(k, String(v));
      });
      const res = await fetch("/api/apply/startup", { method: "POST", body: fd });
      if (!res.ok) throw new Error(`Submit failed: ${res.status}`);
      if (typeof window !== "undefined") window.localStorage.removeItem(DRAFT_KEY);
      router.push("/apply/venture/success");
    } catch (err) {
      console.error(err);
      setSubmitError(
        "We couldn't submit your application. Please check your connection and try again.",
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="border-b border-navy/10 bg-cream-50/80 backdrop-blur">
        <div className="container-page flex items-center justify-between py-4">
          <Link href="/" className="inline-flex items-center gap-3">
            <BrandMark />
          </Link>
          <Link href="/?track=startup#tracks" className="btn-ghost hidden sm:inline-flex">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
      </header>

      <main className="container-page max-w-3xl pb-24 pt-10 sm:pt-16">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
              Apply as a Startup
            </span>
            <h1 className="mt-2 font-display text-4xl font-bold text-navy sm:text-5xl">
              Gen SEA Ventures 33
            </h1>
            <p className="mt-3 max-w-2xl text-base text-navy/70">
              Application deadline: <strong className="text-navy">{APPLICATION_DEADLINE}</strong>.
              All required fields are below — you can see the full scope before you start. We email
              your bootcamp access immediately on submit.
            </p>
          </div>
          <DraftIndicator state={draftState} className="mt-2 shrink-0" />
        </div>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-10 rounded-3xl border border-navy/10 bg-white p-6 shadow-soft sm:p-10"
        >
          {/* Company info */}
          <section className="space-y-5">
            <SectionHeader title="Company info" />
            <Field label="Venture Name" required error={errors.legalName?.message}>
              <input
                className="field-input"
                placeholder="As registered"
                {...register("legalName")}
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Founding date" required error={errors.foundingDate?.message}>
                <input type="date" className="field-input" {...register("foundingDate")} />
              </Field>
              <Field
                label="Country of incorporation"
                required
                error={errors.incorporationCountry?.message}
              >
                <input
                  className="field-input"
                  placeholder="e.g. Thailand"
                  {...register("incorporationCountry")}
                />
              </Field>
            </div>
            <Field label="Sector" required error={errors.sector?.message}>
              <div className="grid gap-2 sm:grid-cols-3">
                {SECTORS.map((s) => (
                  <label
                    key={s}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm font-medium text-navy transition has-[:checked]:border-brand-red has-[:checked]:bg-brand-red/5 has-[:checked]:text-brand-red"
                  >
                    <input
                      type="radio"
                      value={s}
                      className="h-4 w-4 accent-brand-red"
                      {...register("sector")}
                    />
                    {SECTOR_LABELS[s]}
                  </label>
                ))}
              </div>
            </Field>
          </section>

          {/* Founder details */}
          <section className="space-y-5">
            <SectionHeader
              title="Founder details"
              hint="At least one founder must be aged 18–30 and have graduated within the last 5 years. The person below is that founder."
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Founder full name" required error={errors.founderName?.message}>
                <input
                  className="field-input"
                  placeholder="Lead founder applying"
                  {...register("founderName")}
                />
              </Field>
              <Field label="Founder age" required error={errors.founderAge?.message}>
                <input
                  type="number"
                  inputMode="numeric"
                  min={18}
                  max={30}
                  className="field-input"
                  {...register("founderAge")}
                />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Founder email" required error={errors.founderEmail?.message}>
                <input
                  type="email"
                  inputMode="email"
                  className="field-input"
                  placeholder="founder@company.com"
                  {...register("founderEmail")}
                />
              </Field>
              <Field label="Founder phone" required error={errors.founderPhone?.message}>
                <input
                  type="tel"
                  inputMode="tel"
                  className="field-input"
                  placeholder="+66 81 234 5678"
                  {...register("founderPhone")}
                />
              </Field>
            </div>

            {/* <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-navy/15 bg-cream-100/50 p-4">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 flex-shrink-0 rounded accent-brand-red"
                {...register("founderGraduatedWithin5")}
              />
              <span className="flex-1 text-sm leading-relaxed text-navy">
                <span className="mr-1 font-semibold text-brand-red">*</span>I confirm that this
                founder graduated within the last 5 years.
              </span>
            </label> */}
            {errors.founderGraduatedWithin5 && (
              <FormError error={{ message: errors.founderGraduatedWithin5.message }} />
            )}
          </section>

          {/* Documents */}
          <section className="space-y-5">
            <SectionHeader title="Pitch deck & video" />
            <Field
              label="Pitch deck (PDF, max 10MB)"
              required
              error={errors.pitchDeck?.message as string | undefined}
            >
              <FileInput
                accept="application/pdf"
                file={pitchDeck instanceof File ? pitchDeck : undefined}
                onChange={(f) =>
                  setValue("pitchDeck", f as unknown as StartupApplicationValues["pitchDeck"], {
                    shouldValidate: true,
                  })
                }
              />
            </Field>

            <div className="rounded-xl border border-navy/10 bg-cream-100/40 p-5">
              <p className="text-sm font-semibold text-navy">
                2-minute video pitch{" "}
                <span className="font-normal text-navy/55">(recommended, not required)</span>
              </p>
              <p className="mt-1 text-xs text-navy/55">
                Provide a link (YouTube, Loom, Vimeo, Drive) or upload a file.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Video URL" error={errors.videoUrl?.message}>
                  <input
                    type="url"
                    className="field-input"
                    placeholder="https://…"
                    {...register("videoUrl")}
                  />
                </Field>
                <Field
                  label="Or upload video"
                  error={errors.videoFile?.message as string | undefined}
                >
                  <FileInput
                    accept="video/*"
                    file={videoFile instanceof File ? videoFile : undefined}
                    onChange={(f) =>
                      setValue(
                        "videoFile",
                        f as unknown as StartupApplicationValues["videoFile"],
                        { shouldValidate: true },
                      )
                    }
                    label="Click to upload video"
                  />
                </Field>
              </div>
            </div>
          </section>

          {submitError && (
            <p className="rounded-xl border border-brand-red/30 bg-brand-red/5 p-4 text-sm text-brand-red">
              {submitError}
            </p>
          )}

          <div className="flex items-center justify-between border-t border-navy/10 pt-6">
            <span className="text-xs text-navy/55">
              Drafts save automatically to this browser.
            </span>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  Submit application
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

function SectionHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">{title}</h2>
      {hint && <p className="mt-2 text-sm text-navy/65">{hint}</p>}
    </div>
  );
}

function Field({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-navy">
          {label}
          {required && <span className="ml-0.5 text-brand-red">*</span>}
        </label>
        {hint && <span className="text-xs font-normal text-navy/50">{hint}</span>}
      </div>
      {children}
      {error && <FormError error={{ message: error }} />}
    </div>
  );
}

function FileInput({
  accept,
  file,
  onChange,
  label = "Click to upload PDF",
}: {
  accept: string;
  file?: File;
  onChange: (file: File | undefined) => void;
  label?: string;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-navy/25 bg-cream-100/50 px-4 py-3 transition hover:border-navy/45">
      <span className="flex items-center gap-3 text-sm text-navy/70">
        <Upload className="h-4 w-4" />
        {file ? (
          <span className="text-navy">
            {file.name}{" "}
            <span className="text-navy/50">({Math.round(file.size / 1024)} KB)</span>
          </span>
        ) : (
          <span>{label}</span>
        )}
      </span>
      <span className="text-xs font-semibold text-coral-600">
        {file ? "Replace" : "Browse"}
      </span>
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0])}
      />
    </label>
  );
}
