import { NextResponse } from "next/server";

const ADVISOR_LETTER_DEADLINE = "22 May 2026";
const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://gensea-summit-delegates-exclusive-f.vercel.app";

function makeId() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 16);
}

export async function POST(req: Request) {
  const form = await req.formData();

  const get = (k: string) => (form.get(k) as string | null) ?? "";
  const cv = form.get("cv") as File | null;

  const applicationId = makeId();
  const advisorToken = makeId();

  const applicantEmail = get("email");
  const advisorEmail = get("advisorEmail");

  const advisorUploadUrl = `${APP_BASE_URL}/advisor/upload?token=${advisorToken}`;
  const bootcampAccessUrl = `${APP_BASE_URL}/bootcamp/enroll?id=${applicationId}`;
  const teamFlowUrl = `${APP_BASE_URL}/team-flow?id=${applicationId}`;

  // TODO(integrations): replace these console logs with actual transactional
  // email sends (e.g. Resend / Postmark). Persist the application + advisor
  // token to the database so the advisor upload page can validate it.
  console.log("[gen-sea] individual application received", {
    applicationId,
    fullName: get("fullName"),
    age: get("age"),
    nationality: get("nationality"),
    email: applicantEmail,
    phone: get("phone"),
    university: get("university"),
    faculty: get("faculty"),
    advisorName: get("advisorName"),
    advisorEmail,
    motivation: get("motivation"),
    contribution: get("contribution"),
    cv: cv ? { name: cv.name, size: cv.size, type: cv.type } : null,
  });

  console.log("[gen-sea] >> email applicant", {
    to: applicantEmail,
    subject: "Welcome to Gen SEA Summit 2026 — your bootcamp access",
    bootcampAccessUrl,
    teamFlowUrl,
  });

  console.log("[gen-sea] >> email advisor", {
    to: advisorEmail,
    subject: `Recommendation request — ${get("fullName")}`,
    advisorUploadUrl,
    deadline: ADVISOR_LETTER_DEADLINE,
  });

  return NextResponse.json({
    ok: true,
    applicationId,
    advisorLetterDeadline: ADVISOR_LETTER_DEADLINE,
  });
}
