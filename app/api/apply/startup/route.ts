import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/client";
import { startupConfirmationEmail } from "@/lib/email/templates";
import { fileToSheetFile, writeSheetRow } from "@/lib/sheets/client";

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
 * POST /api/apply/startup
 *
 * Receives multipart form-data from `/apply/venture`.
 * Side effects:
 *   1. Append a row to the "startup" tab in the Google Sheet.
 *   2. Email the founder: bootcamp + Team Flow access link.
 */
export async function POST(req: Request) {
  const form = await req.formData();
  const get = (k: string) => (form.get(k) as string | null) ?? "";
  const pitchDeck = form.get("pitchDeck") as File | null;
  const videoFile = form.get("videoFile") as File | null;

  const applicationId = makeId();
  const founderName = get("founderName");
  const founderEmail = get("founderEmail");
  const ventureName = get("legalName");

  // TODO(you): same env vars as individual route. Reuse so both tracks share
  // the same GVP/Team Flow setup.
  const bootcampBase =
    process.env.GVP_BOOTCAMP_ENROLL_URL ?? `${appBaseUrl()}/bootcamp/enroll`;
  const teamFlowBase =
    process.env.TEAM_FLOW_INVITE_URL ?? `${appBaseUrl()}/team-flow`;

  const sep = (url: string) => (url.includes("?") ? "&" : "?");
  const bootcampUrl = `${bootcampBase}${sep(bootcampBase)}id=${applicationId}`;
  const teamFlowUrl = `${teamFlowBase}${sep(teamFlowBase)}id=${applicationId}`;

  const pitchDeckFile = await fileToSheetFile(pitchDeck);
  const videoFileEntry = await fileToSheetFile(videoFile);

  const sheetPromise = writeSheetRow({
    tab: "youth-summit-startup",
    row: {
      submittedAt: new Date().toISOString(),
      applicationId,
      ventureName,
      foundingDate: get("foundingDate"),
      incorporationCountry: get("incorporationCountry"),
      sector: get("sector"),
      founderName,
      founderEmail,
      founderPhone: get("founderPhone"),
      founderAge: get("founderAge"),
      videoUrl: get("videoUrl"),
      pitchDeck: pitchDeckFile,
      videoFile: videoFileEntry,
      bootcampUrl,
      teamFlowUrl,
    },
  });

  const founderEmailPromise = sendEmail({
    to: founderEmail,
    tag: "startup-confirmation",
    ...startupConfirmationEmail({
      founderName,
      ventureName,
      bootcampUrl,
      teamFlowUrl,
    }),
  });

  const [sheetResult, founderResult] = await Promise.allSettled([
    sheetPromise,
    founderEmailPromise,
  ]);

  console.log("[apply/startup]", {
    applicationId,
    sheet: sheetResult.status === "fulfilled" ? sheetResult.value : sheetResult.reason,
    founderEmail:
      founderResult.status === "fulfilled" ? founderResult.value : founderResult.reason,
  });

  return NextResponse.json({ ok: true, applicationId });
}
