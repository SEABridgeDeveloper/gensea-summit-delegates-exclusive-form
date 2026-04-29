import { NextResponse } from "next/server";
import { lookupAdvisorByToken } from "@/lib/sheets/client";

/**
 * GET /api/advisor/lookup?token=...
 *
 * Resolves the advisor token (sent in the recommendation-request email) to the
 * applicant context the upload page needs to render: applicant name + faculty,
 * letter deadline, and current submission status.
 *
 * Returns 404 if the token doesn't match any row.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";

  if (!token) {
    return NextResponse.json({ ok: false, error: "Missing token" }, { status: 400 });
  }

  const result = await lookupAdvisorByToken(token);

  if (!result.ok) {
    return NextResponse.json(result, { status: 404 });
  }

  return NextResponse.json(result);
}
