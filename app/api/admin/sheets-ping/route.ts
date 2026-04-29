import { NextResponse } from "next/server";

/**
 * GET /api/admin/sheets-ping
 *
 * Diagnostic endpoint — does NOT expose any secret values, only whether they
 * are present. Use this to verify env-var wiring on Vercel without trawling
 * function logs.
 *
 * Optional query: ?token=<intentionally-wrong-token> will also POST to the
 * Apps Script webhook to verify reachability + secret match. Returns:
 *   - { sheetsReachable: true }                 → secret matches, webhook reachable
 *   - { sheetsReachable: false, error: "..." }  → secret mismatch / unreachable
 *
 * IMPORTANT: this returns whether-set, not the values themselves. Even so,
 * consider gating it behind an admin check before going to public production
 * if your Vercel preview URLs are publicly indexable.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const ping = url.searchParams.get("ping") === "1";

  const config = {
    NEXT_PUBLIC_APP_URL: !!process.env.NEXT_PUBLIC_APP_URL,
    GSHEET_WEBHOOK_URL: !!process.env.GSHEET_WEBHOOK_URL,
    GSHEET_SHARED_SECRET: !!process.env.GSHEET_SHARED_SECRET,
    GSHEET_SHARED_SECRET_length: process.env.GSHEET_SHARED_SECRET?.length ?? 0,
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    EMAIL_FROM: !!process.env.EMAIL_FROM,
    EMAIL_REPLY_TO: !!process.env.EMAIL_REPLY_TO,
    EMAIL_LOGO_URL: !!process.env.EMAIL_LOGO_URL,
    GVP_BOOTCAMP_ENROLL_URL: !!process.env.GVP_BOOTCAMP_ENROLL_URL,
    TEAM_FLOW_INVITE_URL: !!process.env.TEAM_FLOW_INVITE_URL,
  };

  if (!ping) {
    return NextResponse.json({ config });
  }

  // Probe the Apps Script with a known-bad token. Expected outcomes:
  //   ok:false, error:"Token not found"    → secret matches →
  //   ok:false, error:"Forbidden"          → secret mismatch →
  //   network error / timeout              → URL wrong or Apps Script down
  const webhookUrl = process.env.GSHEET_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({
      config,
      sheetsReachable: false,
      error: "GSHEET_WEBHOOK_URL not set",
    });
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.GSHEET_SHARED_SECRET ?? "",
        action: "lookup_advisor",
        token: "__sheets_ping_diagnostic__",
      }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) {
      return NextResponse.json({
        config,
        sheetsReachable: false,
        httpStatus: res.status,
        error: `Apps Script returned HTTP ${res.status}`,
      });
    }

    const body = (await res.json()) as { ok?: boolean; error?: string };

    if (body.ok === false && body.error === "Forbidden") {
      return NextResponse.json({
        config,
        sheetsReachable: true,
        secretMatches: false,
        diagnosis:
          "Apps Script reachable but rejected the request with Forbidden. " +
          "GSHEET_SHARED_SECRET does NOT match the SHARED_SECRET in the " +
          "deployed Apps Script. Did you redeploy after editing the script?",
      });
    }

    if (body.ok === false && body.error === "Token not found") {
      return NextResponse.json({
        config,
        sheetsReachable: true,
        secretMatches: true,
        diagnosis: "All systems go — webhook reachable and secret matches.",
      });
    }

    return NextResponse.json({ config, sheetsReachable: true, response: body });
  } catch (err) {
    return NextResponse.json({
      config,
      sheetsReachable: false,
      error: String(err),
    });
  }
}
