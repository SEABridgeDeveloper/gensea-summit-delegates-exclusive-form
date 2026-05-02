import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/client";
import {
  individualConfirmationEmail,
  advisorRequestEmail,
} from "@/lib/email/templates";
import { fileToSheetFile, writeSheetRow } from "@/lib/sheets/client";

// TODO(you): if the program shifts dates, update this in one place.
const ADVISOR_LETTER_DEADLINE = "22 May 2026";

function appBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
""
  );
}

function makeId(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 16);
}

/**
 * POST /api/apply/individual
 *
 * Receives multipart form-data from `/apply/delegate`.
 * Side effects:
 *   1. Append a row to the "individual" tab in the Google Sheet (Apps Script).
 *   2. Email the applicant: bootcamp + Team Flow access link.
 *   3. Email the advisor: private upload link with deadline.
 *
 * All three side effects run in parallel; a single failure does not block
 * the others or the HTTP 200 response — we don't want a flaky third party
 * to leave the applicant thinking their submission failed.
 */
export async function POST(req: Request) {
  const form = await req.formData();
  const get = (k: string) => (form.get(k) as string | null) ?? "";
  const cv = form.get("cv") as File | null;

  const applicationId = makeId();
  const advisorToken = makeId();

  const applicantName = get("fullName");
  const applicantEmail = get("email");
  const advisorName = get("advisorName");
  const advisorEmail = get("advisorEmail");

  // TODO(you): if GVP wants a different param than ?id=, change here.
  const bootcampBase =
    process.env.GVP_BOOTCAMP_ENROLL_URL ?? `${appBaseUrl()}/bootcamp/enroll`;
  const teamFlowBase =
    process.env.TEAM_FLOW_INVITE_URL ?? `${appBaseUrl()}/team-flow`;

  const sep = (url: string) => (url.includes("?") ? "&" : "?");
  const bootcampUrl = `${bootcampBase}${sep(bootcampBase)}id=${applicationId}`;
  const teamFlowUrl = `${teamFlowBase}${sep(teamFlowBase)}id=${applicationId}`;
  const advisorUploadUrl = `${appBaseUrl()}/advisor/upload?token=${advisorToken}`;

  // Convert the uploaded file to base64 for the Apps Script (Drive upload).
  const cvFile = await fileToSheetFile(cv);

  // Side effect 1 — Google Sheet row
  const sheetPromise = writeSheetRow({
    tab: "youth-summit-individual",
    row: {
      submittedAt: new Date().toISOString(),
      applicationId,
      advisorToken,
      fullName: applicantName,
      age: get("age"),
      nationality: get("nationality"),
      email: applicantEmail,
      phone: get("phone"),
      linkedinUrl: get("linkedinUrl"),
      university: get("university"),
      // Free-text fallback when university === "other".
      universityOther: get("universityOther"),
      faculty: get("faculty"),
      // Faculty-referral fields (UI label) — schema field names retained.
      advisorName,
      advisorEmail,
      motivation: get("motivation"),
      cv: cvFile, // Apps Script uploads to Drive and writes a URL
      cvUrl: get("cvUrl"),
      bootcampUrl,
      teamFlowUrl,
      advisorUploadUrl,
      advisorLetterDeadline: ADVISOR_LETTER_DEADLINE,
      advisorLetterStatus: "pending",
    },
  });

  // Side effect 2 — applicant confirmation email
  const applicantEmailPromise = sendEmail({
    to: applicantEmail,
    tag: "individual-confirmation",
    ...individualConfirmationEmail({
      applicantName,
      applicantEmail,
      bootcampUrl,
      teamFlowUrl,
      advisorLetterDeadline: ADVISOR_LETTER_DEADLINE,
      advisorEmail,
    }),
  });

  // Side effect 3 — advisor recommendation request email
  const advisorEmailPromise = sendEmail({
    to: advisorEmail,
    tag: "advisor-request",
    ...advisorRequestEmail({
      advisorName,
      applicantName,
      uploadUrl: advisorUploadUrl,
      deadline: ADVISOR_LETTER_DEADLINE,
    }),
  });

  const [sheetResult, applicantResult, advisorResult] = await Promise.allSettled([
    sheetPromise,
    applicantEmailPromise,
    advisorEmailPromise,
  ]);

  console.log("[apply/individual]", {
    applicationId,
    sheet: sheetResult.status === "fulfilled" ? sheetResult.value : sheetResult.reason,
    applicantEmail:
      applicantResult.status === "fulfilled" ? applicantResult.value : applicantResult.reason,
    advisorEmail:
      advisorResult.status === "fulfilled" ? advisorResult.value : advisorResult.reason,
  });

  return NextResponse.json({
    ok: true,
    applicationId,
    advisorLetterDeadline: ADVISOR_LETTER_DEADLINE,
  });
}
