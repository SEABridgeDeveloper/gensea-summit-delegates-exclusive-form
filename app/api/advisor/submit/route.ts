import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/client";
import { advisorLetterReceivedEmail } from "@/lib/email/templates";
import {
  fileToSheetFile,
  lookupAdvisorByToken,
  submitAdvisorLetter,
} from "@/lib/sheets/client";

/**
 * POST /api/advisor/submit
 *
 * Multipart body: { token, letter (PDF), note? }
 *
 * Validates the token via Apps Script, uploads the letter to Drive, updates
 * the applicant's row (status = "submitted", letter URL, timestamp), and
 * emails the advisor a confirmation.
 */
export async function POST(req: Request) {
  const form = await req.formData();
  const token = (form.get("token") as string | null) ?? "";
  const letter = form.get("letter") as File | null;
  const note = (form.get("note") as string | null) ?? "";

  if (!token) {
    return NextResponse.json({ ok: false, error: "Missing token" }, { status: 400 });
  }
  if (!letter || letter.size === 0) {
    return NextResponse.json({ ok: false, error: "Missing letter file" }, { status: 400 });
  }
  if (letter.type !== "application/pdf") {
    return NextResponse.json({ ok: false, error: "Letter must be a PDF" }, { status: 400 });
  }
  if (letter.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { ok: false, error: "Letter must be 5MB or smaller" },
      { status: 400 },
    );
  }

  // Look up first so we can fail fast with a clear error if the token is bad,
  // and so we have the applicant + advisor names for the confirmation email.
  const lookup = await lookupAdvisorByToken(token);
  if (!lookup.ok) {
    return NextResponse.json(lookup, { status: 404 });
  }

  const sheetFile = await fileToSheetFile(letter);
  if (!sheetFile) {
    return NextResponse.json({ ok: false, error: "Could not read file" }, { status: 400 });
  }

  const writeResult = await submitAdvisorLetter({ token, file: sheetFile, note });

  if (!writeResult.ok) {
    return NextResponse.json(writeResult, { status: 500 });
  }

  // Confirmation email is best-effort — don't block success if it fails.
  if (lookup.context.advisorEmail && lookup.context.advisorName) {
    sendEmail({
      to: lookup.context.advisorEmail,
      tag: "advisor-letter-received",
      ...advisorLetterReceivedEmail({
        advisorName: lookup.context.advisorName,
        applicantName: lookup.context.applicantName,
      }),
    }).catch((e) => console.error("[advisor-confirm] mail failed", e));
  }

  return NextResponse.json({
    ok: true,
    applicantName: lookup.context.applicantName,
  });
}
