"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Check,
  CircleAlert,
  Loader2,
  Upload,
} from "lucide-react";
import { BrandMark } from "@/components/shared/brand-mark";
import { Field } from "@/components/apply/form-primitives";

type Context = {
  applicantName: string;
  university?: string;
  faculty?: string;
  deadline: string;
  status: "pending" | "submitted";
};

type LookupState =
  | { kind: "loading" }
  | { kind: "ready"; context: Context }
  | { kind: "error"; message: string };

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; applicantName: string }
  | { kind: "error"; message: string };

export function AdvisorUploadView() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const [lookup, setLookup] = useState<LookupState>({ kind: "loading" });
  const [submitState, setSubmitState] = useState<SubmitState>({ kind: "idle" });
  const [letter, setLetter] = useState<File | undefined>();
  const [note, setNote] = useState("");
  const [fileError, setFileError] = useState<string | undefined>();

  // Resolve the token to applicant context on mount.
  useEffect(() => {
    if (!token) {
      setLookup({ kind: "error", message: "This link is missing a token." });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/advisor/lookup?token=${encodeURIComponent(token)}`,
        );
        const body = await res.json();
        if (cancelled) return;
        if (!res.ok || !body.ok) {
          setLookup({ kind: "error", message: humanizeLookupError(body.error) });
          return;
        }
        setLookup({ kind: "ready", context: body.context });
      } catch (e) {
        if (cancelled) return;
        setLookup({
          kind: "error",
          message: "We couldn't reach the server. Please try again in a moment.",
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  // Map the raw error string from the API to a recipient-friendly message.
  // The raw error is still in server logs for debugging.
  // (Defined inline so it shares the component's copy tone.)

  const onFileChange = (f: File | undefined) => {
    setFileError(undefined);
    if (!f) {
      setLetter(undefined);
      return;
    }
    if (f.type !== "application/pdf") {
      setFileError("Letter must be a PDF.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setFileError("Letter must be 5MB or smaller.");
      return;
    }
    setLetter(f);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!letter) {
      setFileError("Please attach the recommendation letter.");
      return;
    }
    setSubmitState({ kind: "submitting" });
    try {
      const fd = new FormData();
      fd.set("token", token);
      fd.set("letter", letter);
      if (note.trim()) fd.set("note", note);
      const res = await fetch("/api/advisor/submit", { method: "POST", body: fd });
      const body = await res.json();
      if (!res.ok || !body.ok) {
        setSubmitState({
          kind: "error",
          message:
            body.error ?? "Submission failed. Please try again or email team@seabridge.space.",
        });
        return;
      }
      setSubmitState({ kind: "success", applicantName: body.applicantName });
    } catch (e) {
      setSubmitState({
        kind: "error",
        message:
          "We couldn't submit your letter. Please check your connection and try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="sticky top-0 z-40 border-b border-navy/10 bg-cream-50/90 backdrop-blur">
        <div className="container-page flex items-center justify-between py-4">
          <Link href="/" aria-label="Gen SEA Summit home">
            <BrandMark />
          </Link>
        </div>
      </header>

      <main id="main" className="container-page max-w-2xl pb-24 pt-10 sm:pt-16">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-coral-700">
            Gen SEA Summit 2026
          </span>
          <h1 className="mt-2 font-display text-3xl font-bold text-navy sm:text-4xl">
            Recommendation letter
          </h1>
        </div>

        {lookup.kind === "loading" && <LoadingCard />}
        {lookup.kind === "error" && <ErrorCard message={lookup.message} />}

        {lookup.kind === "ready" && submitState.kind !== "success" && (
          <FormCard
            context={lookup.context}
            letter={letter}
            note={note}
            fileError={fileError}
            submitState={submitState}
            onFileChange={onFileChange}
            onNoteChange={setNote}
            onSubmit={onSubmit}
          />
        )}

        {submitState.kind === "success" && (
          <SuccessCard applicantName={submitState.applicantName} />
        )}
      </main>
    </div>
  );
}

// ── Cards ─────────────────────────────────────────────────────────────────

function LoadingCard() {
  return (
    <div className="rounded-3xl border border-navy/10 bg-white p-8 text-center shadow-soft">
      <Loader2 className="mx-auto h-6 w-6 animate-spin text-coral-700" aria-hidden="true" />
      <p className="mt-3 text-sm text-navy/75">Looking up the applicant…</p>
    </div>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-brand-red/30 bg-brand-red/5 p-8 shadow-soft">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
        <CircleAlert className="h-5 w-5" aria-hidden="true" />
      </span>
      <h2 className="mt-4 font-display text-xl font-bold text-navy">
        We couldn&apos;t open this link
      </h2>
      <p className="mt-2 text-sm text-navy/85">{message}</p>
      <p className="mt-4 text-sm text-navy/75">
        Need help? Email{" "}
        <a href="mailto:team@seabridge.space" className="font-semibold text-brand-red hover:underline">
          team@seabridge.space
        </a>
        .
      </p>
    </div>
  );
}

function FormCard(props: {
  context: Context;
  letter: File | undefined;
  note: string;
  fileError: string | undefined;
  submitState: SubmitState;
  onFileChange: (f: File | undefined) => void;
  onNoteChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const {
    context,
    letter,
    note,
    fileError,
    submitState,
    onFileChange,
    onNoteChange,
    onSubmit,
  } = props;

  const submitting = submitState.kind === "submitting";
  const errorMessage = submitState.kind === "error" ? submitState.message : undefined;

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="space-y-8 rounded-3xl border border-navy/10 bg-white p-6 shadow-soft sm:p-10"
    >
      {/* Applicant context */}
      <section>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-navy/70">
          Recommendation for
        </span>
        <p className="mt-1 font-display text-2xl font-bold text-navy sm:text-3xl">
          {context.applicantName}
        </p>
        {(context.university || context.faculty) && (
          <p className="mt-1 text-sm text-navy/75">
            {[context.faculty, context.university].filter(Boolean).join(" · ")}
          </p>
        )}
        {context.status === "submitted" && (
          <div className="mt-4 rounded-xl border border-coral-500/30 bg-coral-500/10 p-3 text-sm text-navy/85">
            A letter was already submitted for this applicant. You can replace it by uploading a
            new one below.
          </div>
        )}
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-xs font-semibold text-navy">
          Deadline: {context.deadline}
        </div>
      </section>

      {/* Guidance */}
      <section className="rounded-2xl border border-navy/10 bg-cream-100/60 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-navy/70">
          What to include
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-navy/85">
          <li className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-coral-500" aria-hidden="true" />
            <span>Your role and how you know the applicant.</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-coral-500" aria-hidden="true" />
            <span>
              Specific examples of leadership, initiative, or impact you&apos;ve seen first-hand.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-coral-500" aria-hidden="true" />
            <span>Why this applicant would benefit the room and contribute to ASEAN&apos;s next decade.</span>
          </li>
        </ul>
        <p className="mt-3 text-xs text-navy/70">
          One page is plenty. Submit as a PDF — max 5MB.
        </p>
      </section>

      {/* Upload */}
      <Field
        label="Recommendation letter (PDF)"
        required
        error={fileError}
      >
        <FileInput
          accept="application/pdf"
          file={letter}
          onChange={onFileChange}
        />
      </Field>

      {/* Optional note */}
      <Field
        label="Brief note to the program team"
        hint="Optional"
      >
        <textarea
          rows={4}
          className="field-input resize-y"
          placeholder="Anything we should know that isn't in the letter."
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
        />
      </Field>

      {errorMessage && (
        <p
          role="alert"
          aria-live="polite"
          className="rounded-xl border border-brand-red/30 bg-brand-red/5 p-4 text-sm text-brand-red"
        >
          {errorMessage}
        </p>
      )}

      <div className="flex flex-col-reverse gap-4 border-t border-navy/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs text-navy/70">
          We&apos;ll email you a confirmation once it&apos;s in.
        </span>
        <button
          type="submit"
          disabled={submitting || !letter}
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Submitting…
            </>
          ) : (
            <>
              Submit letter
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function SuccessCard({ applicantName }: { applicantName: string }) {
  return (
    <div className="rounded-3xl border border-navy/10 bg-white p-8 shadow-soft">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-coral-500/15 text-coral-700">
        <Check className="h-6 w-6" strokeWidth={2.4} aria-hidden="true" />
      </span>
      <h2 className="mt-4 font-display text-2xl font-bold text-navy sm:text-3xl">
        Letter received.
      </h2>
      <p className="mt-2 text-base text-navy/85">
        Thank you for taking the time to recommend{" "}
        <strong className="text-navy">{applicantName}</strong>. We&apos;ve shared your letter with
        the program selection team. A confirmation email is on its way.
      </p>
      <p className="mt-4 text-sm text-navy/70">You can close this page now.</p>
    </div>
  );
}

// Map machine-readable errors to user-friendly copy.
function humanizeLookupError(raw: string | undefined): string {
  if (!raw) {
    return "We couldn't find an application for this link. Please check the email and try again.";
  }
  if (raw === "Token not found") {
    return "This link doesn't match any applicant on file. The applicant may have used a different email address — please ask them to resend you the recommendation request.";
  }
  if (raw === "Missing token") {
    return "This link is missing a token. Please use the exact URL from the email we sent you.";
  }
  // Anything else (Forbidden, Sheets webhook not configured, network errors,
  // etc.) is an operational problem on our side — don't leak the raw string.
  return "Our system can't reach the application database right now. The team has been notified — please email team@seabridge.space and we'll process your letter manually.";
}

// ── File input (matches the apply forms) ─────────────────────────────────

function FileInput({
  accept,
  file,
  onChange,
}: {
  accept: string;
  file: File | undefined;
  onChange: (file: File | undefined) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-navy/30 bg-cream-100/50 px-4 py-3 transition hover:border-navy/50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-coral-500 has-[:focus-visible]:ring-offset-2">
      <span className="flex items-center gap-3 text-sm text-navy/85">
        <Upload className="h-4 w-4" aria-hidden="true" />
        {file ? (
          <span className="text-navy">
            {file.name}{" "}
            <span className="text-navy/70">({Math.round(file.size / 1024)} KB)</span>
          </span>
        ) : (
          <span>Click to upload PDF</span>
        )}
      </span>
      <span className="text-xs font-semibold text-coral-700">
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
