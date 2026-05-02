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
import { Field } from "@/components/apply/form-primitives";
import { DraftIndicator, type DraftState } from "@/components/apply/draft-indicator";

const DRAFT_KEY = "gen-sea-startup-draft-v3";
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
      sector: undefined as unknown as StartupApplicationValues["sector"],
      founderName: "",
      founderEmail: "",
      founderPhone: "",
      founderAge: undefined as unknown as number,
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

  // When validation rejects the submit, scroll the first invalid field into
  // view so users can see what's wrong instead of "nothing happened".
  const onInvalid = () => {
    setSubmitError(null);
    if (typeof document === "undefined") return;
    requestAnimationFrame(() => {
      const firstInvalid = document.querySelector<HTMLElement>('[aria-invalid="true"]');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
        firstInvalid.focus({ preventScroll: true });
      }
    });
  };

  const errorCount = Object.keys(errors).length;

  return (
    <div className="min-h-screen bg-ink">
      <header className="sticky top-0 z-40 border-b border-bone-hairline bg-ink/90 backdrop-blur">
        <div className="container-page flex items-center justify-between py-4">
          <Link href="/" className="inline-flex items-center gap-3" aria-label="Gen SEA Summit home">
            <BrandMark />
          </Link>
          <Link href="/?track=startup#tracks" className="btn-ghost">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Back</span>
          </Link>
        </div>
      </header>

      <main id="main" className="container-page max-w-3xl pb-24 pt-10 sm:pt-16">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div>
            <span className="eyebrow">Apply as a Startup</span>
            <h1 className="mt-2 font-display text-3xl font-bold text-bone sm:text-4xl">
              Gen SEA Ventures 33
            </h1>
            <p className="mt-3 max-w-2xl text-base text-bone-muted">
              Application deadline: <strong className="text-bone">{APPLICATION_DEADLINE}</strong>.
              All required fields are below — you can see the full scope before you start. We email
              your bootcamp access immediately on submit.
            </p>
          </div>
          <DraftIndicator state={draftState} className="shrink-0" />
        </div>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="space-y-10 rounded-3xl border border-sunset-500/20 bg-ink-elevated p-6 shadow-ink sm:p-10"
        >
          <fieldset className="space-y-5">
            <SectionHeader title="Company info" />
            <Field label="Venture name" required error={errors.legalName?.message}>
              <input
                type="text"
                className="field-input"
                placeholder="As registered"
                {...register("legalName")}
              />
            </Field>

            <fieldset>
              <legend className="mb-1.5 text-sm font-medium text-bone">
                Sector
                <span className="ml-0.5 text-sunset-400" aria-hidden="true">*</span>
                <span className="sr-only"> (required)</span>
              </legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {SECTORS.map((s) => (
                  <label
                    key={s}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-bone-hairline bg-ink-elevated px-4 py-3 text-sm font-medium text-bone transition has-[:checked]:border-sunset-500 has-[:checked]:bg-sunset-500/10 has-[:checked]:text-sunset-400 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sunset-500 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-ink"
                  >
                    <input
                      type="radio"
                      value={s}
                      className="h-4 w-4 accent-sunset-500"
                      {...register("sector")}
                    />
                    {SECTOR_LABELS[s]}
                  </label>
                ))}
              </div>
              {errors.sector && (
                <p role="alert" className="field-error">
                  {String(errors.sector.message ?? "Required")}
                </p>
              )}
            </fieldset>
          </fieldset>

          <fieldset className="space-y-5">
            <SectionHeader
              title="Founder details"
              hint="At least one founder must be aged 18–30 and have graduated within the last 5 years. The person below is that founder."
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Founder full name" required error={errors.founderName?.message}>
                <input
                  type="text"
                  className="field-input"
                  placeholder="Lead founder applying"
                  autoComplete="name"
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
                  autoComplete="email"
                  className="field-input"
                  placeholder="founder@company.com"
                  {...register("founderEmail")}
                />
              </Field>
              <Field label="Founder phone" required error={errors.founderPhone?.message}>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  className="field-input"
                  placeholder="+66 81 234 5678"
                  {...register("founderPhone")}
                />
              </Field>
            </div>
          </fieldset>

          <fieldset className="space-y-5">
            <SectionHeader title="Pitch deck & video" />
            <Field
              label="Pitch deck"
              required
              error={errors.pitchDeck?.message as string | undefined}
              hint="PDF · max 10MB"
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

            <div className="rounded-xl border border-bone-hairline bg-ink-subtle/40 p-5">
              <p className="text-sm font-semibold text-bone">
                2-minute video pitch{" "}
                <span className="font-normal text-bone-subtle">(recommended, not required)</span>
              </p>
              <p className="mt-1 text-xs text-bone-subtle">
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
          </fieldset>

          {errorCount > 0 && (
            <p
              role="alert"
              aria-live="polite"
              className="rounded-xl border border-sunset-500/40 bg-sunset-500/10 p-4 text-sm text-sunset-400"
            >
              Please fix the {errorCount === 1 ? "highlighted field" : `${errorCount} highlighted fields`} above before submitting.
            </p>
          )}

          {submitError && (
            <p
              role="alert"
              aria-live="polite"
              className="rounded-xl border border-sunset-500/40 bg-sunset-500/10 p-4 text-sm text-sunset-400"
            >
              {submitError}
            </p>
          )}

          <div className="flex flex-col-reverse gap-4 border-t border-bone-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-bone-subtle">
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
    <legend className="block">
      <span className="block font-display text-2xl font-bold text-bone sm:text-3xl">
        {title}
      </span>
      {hint && <span className="mt-2 block text-sm text-bone-muted">{hint}</span>}
    </legend>
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
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-bone-hairline bg-ink-subtle/50 px-4 py-3 transition hover:border-sunset-500/50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sunset-500 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-ink">
      <span className="flex items-center gap-3 text-sm text-bone-muted">
        <Upload className="h-4 w-4" aria-hidden="true" />
        {file ? (
          <span className="text-bone">
            {file.name}{" "}
            <span className="text-bone-subtle">({Math.round(file.size / 1024)} KB)</span>
          </span>
        ) : (
          <span>{label}</span>
        )}
      </span>
      <span className="text-xs font-semibold text-sunset-400">
        {file ? "Replace" : "Browse"}
      </span>
      <input
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => onChange(e.target.files?.[0])}
      />
    </label>
  );
}
