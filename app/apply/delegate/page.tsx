"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2, Upload } from "lucide-react";
import {
  individualApplicationSchema,
  type IndividualApplicationValues,
} from "@/lib/schemas/individual";
import { BrandMark } from "@/components/shared/brand-mark";
import { Field } from "@/components/apply/form-primitives";
import { PhoneInput } from "@/components/apply/phone-input";
import { UniversityCombobox } from "@/components/apply/university-combobox";
import { DraftIndicator, type DraftState } from "@/components/apply/draft-indicator";
import { getFacultiesFor } from "@/lib/data/faculties";

const DRAFT_KEY = "gen-sea-individual-draft-v4";
const ADVISOR_LETTER_DEADLINE = "22 May 2026";
const APPLICATION_DEADLINE = "15 May 2026";

type DraftShape = Omit<IndividualApplicationValues, "cv" | "age"> & {
  age?: string | number;
  cv?: { name: string; size: number; type: string };
};

export default function IndividualApplyPage() {
  const router = useRouter();
  const [draftState, setDraftState] = useState<DraftState>("idle");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const form = useForm<IndividualApplicationValues>({
    resolver: zodResolver(individualApplicationSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      age: undefined as unknown as number,
      nationality: "",
      email: "",
      phone: "",
      university: "",
      universityOther: "",
      faculty: "",
      cv: undefined,
      cvUrl: "",
      linkedinUrl: "",
      advisorName: "",
      advisorEmail: "",
      motivation: "",
    },
  });

  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;

  const universityId = watch("university");
  const cvFile = watch("cv") as File | undefined;
  const faculties = useMemo(() => getFacultiesFor(universityId), [universityId]);
  const isOtherUniversity = universityId === "other";

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as DraftShape;
      (Object.keys(draft) as (keyof DraftShape)[]).forEach((k) => {
        const v = draft[k];
        if (k === "cv") return;
        if (v !== undefined && v !== null) {
          setValue(k as keyof IndividualApplicationValues, v as never, {
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
          cv:
            values.cv instanceof File
              ? { name: values.cv.name, size: values.cv.size, type: values.cv.type }
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

  const lastUniversityRef = useRef(universityId);
  useEffect(() => {
    if (lastUniversityRef.current !== universityId) {
      lastUniversityRef.current = universityId;
      setValue("faculty", "", { shouldValidate: false });
      // Clear the manual override when switching off "Other".
      if (universityId !== "other") {
        setValue("universityOther", "", { shouldValidate: false });
      }
    }
  }, [universityId, setValue]);

  const onSubmit = async (values: IndividualApplicationValues) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (v instanceof File) fd.append(k, v);
        else if (v !== undefined && v !== null && v !== "") fd.append(k, String(v));
      });
      const res = await fetch("/api/apply/individual", { method: "POST", body: fd });
      if (!res.ok) throw new Error(`Submit failed: ${res.status}`);
      if (typeof window !== "undefined") window.localStorage.removeItem(DRAFT_KEY);
      router.push("/apply/delegate/success");
    } catch (err) {
      console.error(err);
      setSubmitError(
        "We couldn't submit your application. Please check your connection and try again.",
      );
      setSubmitting(false);
    }
  };

  // When validation rejects the submit, scroll the first invalid field into
  // view so users see the error instead of "nothing happened".
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
          <Link href="/?track=individual#tracks" className="btn-ghost">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Back</span>
          </Link>
        </div>
      </header>

      <main id="main" className="container-page max-w-3xl pb-24 pt-10 sm:pt-16">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div>
            <span className="eyebrow">Apply as an Individual</span>
            <h1 className="mt-2 font-display text-3xl font-bold text-bone sm:text-4xl">
              Gen SEA Delegates 2026
            </h1>
            <p className="mt-3 max-w-2xl text-base text-bone-muted">
              Application deadline: <strong className="text-bone">{APPLICATION_DEADLINE}</strong>.
              Once you submit, we&apos;ll send you bootcamp access immediately and email your
              faculty reference a private upload link for the recommendation letter.
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
            <SectionHeader title="Personal info" />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" required error={errors.fullName?.message}>
                <input
                  type="text"
                  className="field-input"
                  placeholder="Full name"
                  autoComplete="name"
                  {...register("fullName")}
                />
              </Field>
              <Field label="Age" required error={errors.age?.message}>
                <input
                  type="number"
                  inputMode="numeric"
                  min={18}
                  max={30}
                  className="field-input"
                  {...register("age")}
                />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nationality" required error={errors.nationality?.message}>
                <input
                  type="text"
                  className="field-input"
                  placeholder="e.g. Thai, Vietnamese, Filipino"
                  {...register("nationality")}
                />
              </Field>
              <Field label="Email" required error={errors.email?.message}>
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  className="field-input"
                  placeholder="you@example.com"
                  {...register("email")}
                />
              </Field>
            </div>
            <Field label="Phone" required error={errors.phone?.message}>
              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <PhoneInput
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    invalid={!!errors.phone}
                    placeholder="81 234 5678"
                  />
                )}
              />
            </Field>
            <Field
              label="LinkedIn"
              hint="Optional"
              error={errors.linkedinUrl?.message}
            >
              <input
                type="url"
                inputMode="url"
                className="field-input"
                placeholder="https://linkedin.com/in/yourprofile"
                {...register("linkedinUrl")}
              />
            </Field>
          </fieldset>

          <fieldset className="space-y-5">
            <SectionHeader
              title="University & faculty"
              hint="If your institution isn't in the list, pick Other / Not listed and type the name below."
            />
            <Field label="University" required error={errors.university?.message}>
              <Controller
                control={control}
                name="university"
                render={({ field }) => (
                  <UniversityCombobox
                    value={field.value}
                    onChange={field.onChange}
                    invalid={!!errors.university}
                  />
                )}
              />
            </Field>
            {isOtherUniversity && (
              <Field
                label="Specify your university"
                required
                error={errors.universityOther?.message}
                hint="Type the full name as it appears on your transcript"
              >
                <input
                  type="text"
                  className="field-input"
                  placeholder="e.g. University of Yangon"
                  autoComplete="organization"
                  {...register("universityOther")}
                />
              </Field>
            )}
            <Field label="Faculty / School" required error={errors.faculty?.message}>
              {isOtherUniversity ? (
                <input
                  type="text"
                  className="field-input"
                  placeholder="e.g. Faculty of Engineering"
                  {...register("faculty")}
                />
              ) : (
                <select
                  disabled={!universityId}
                  aria-required="true"
                  className="field-input"
                  {...register("faculty")}
                >
                  <option value="">
                    {universityId ? "Pick your faculty" : "Choose a university first"}
                  </option>
                  {faculties.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              )}
            </Field>
          </fieldset>

          <fieldset className="space-y-5">
            <SectionHeader
              title="CV"
              hint="Either upload a PDF or paste a public link (LinkedIn, Drive, Notion). Optional."
            />
            <Field label="Upload CV (PDF)" hint="Optional · max 5MB" error={errors.cv?.message as string | undefined}>
              <FileInput
                accept="application/pdf"
                file={cvFile instanceof File ? cvFile : undefined}
                onChange={(f) =>
                  setValue("cv", f as unknown as IndividualApplicationValues["cv"], {
                    shouldValidate: true,
                  })
                }
              />
            </Field>
            <Field label="Or link to your CV" hint="Optional" error={errors.cvUrl?.message}>
              <input
                type="url"
                inputMode="url"
                className="field-input"
                placeholder="https://drive.google.com/…"
                {...register("cvUrl")}
              />
            </Field>
          </fieldset>

          <fieldset className="space-y-5">
            <SectionHeader
              title="Faculty Referral"
              hint={`After you submit, we'll automatically email your faculty reference a private link to upload their recommendation letter. They have until ${ADVISOR_LETTER_DEADLINE} to submit it via the link we send them.`}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Reference's full name" required error={errors.advisorName?.message}>
                <input
                  type="text"
                  className="field-input"
                  placeholder="e.g. Asst. Prof. Wirat Chai"
                  {...register("advisorName")}
                />
              </Field>
              <Field
                label="Reference's institutional email"
                required
                error={errors.advisorEmail?.message}
              >
                <input
                  type="email"
                  inputMode="email"
                  className="field-input"
                  placeholder="reference@university.ac.th"
                  {...register("advisorEmail")}
                />
              </Field>
            </div>
          </fieldset>

          <fieldset className="space-y-5">
            <SectionHeader title="Short answer" />
            <Field
              label="Why do you want to attend Gen SEA Summit 2026?"
              required
              error={errors.motivation?.message}
            >
              <textarea
                rows={5}
                className="field-input resize-y"
                placeholder="Short answer."
                {...register("motivation")}
              />
            </Field>
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
