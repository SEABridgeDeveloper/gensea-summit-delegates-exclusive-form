import { NextResponse } from "next/server";

const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://gensea-summit-delegates-exclusive-f.vercel.app";

function makeId() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 16);
}

export async function POST(req: Request) {
  const form = await req.formData();
  const get = (k: string) => (form.get(k) as string | null) ?? "";
  const pitchDeck = form.get("pitchDeck") as File | null;
  const videoFile = form.get("videoFile") as File | null;

  const applicationId = makeId();
  const founderEmail = get("founderEmail");

  const bootcampAccessUrl = `${APP_BASE_URL}/bootcamp/enroll?id=${applicationId}`;
  const teamFlowUrl = `${APP_BASE_URL}/team-flow?id=${applicationId}`;

  // TODO(integrations): replace with real transactional email + storage.
  console.log("[gen-sea] startup application received", {
    applicationId,
    legalName: get("legalName"),
    foundingDate: get("foundingDate"),
    incorporationCountry: get("incorporationCountry"),
    sector: get("sector"),
    founderName: get("founderName"),
    founderEmail,
    founderPhone: get("founderPhone"),
    founderAge: get("founderAge"),
    founderGraduatedWithin5: get("founderGraduatedWithin5") === "true",
    videoUrl: get("videoUrl"),
    pitchDeck: pitchDeck
      ? { name: pitchDeck.name, size: pitchDeck.size, type: pitchDeck.type }
      : null,
    videoFile: videoFile
      ? { name: videoFile.name, size: videoFile.size, type: videoFile.type }
      : null,
  });

  console.log("[gen-sea] >> email founder", {
    to: founderEmail,
    subject: "Welcome to Gen SEA Ventures 33 — your bootcamp access",
    bootcampAccessUrl,
    teamFlowUrl,
  });

  return NextResponse.json({ ok: true, applicationId });
}
