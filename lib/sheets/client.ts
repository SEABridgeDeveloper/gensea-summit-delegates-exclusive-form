/**
 * Google Sheets persistence via Apps Script Web App.
 *
 * No database, no service-account JSON keys. The Sheet owner deploys an Apps
 * Script web app that exposes a single `doPost` endpoint, and we POST JSON to
 * it with an `action` discriminator. Three actions are supported:
 *
 *   - (no action / default) → write a row to a tab    → writeSheetRow
 *   - "lookup_advisor"      → fetch applicant context  → lookupAdvisorByToken
 *   - "submit_letter"       → upload letter + status   → submitAdvisorLetter
 *
 * See `docs/apps-script.md` for setup. Once deployed, paste the web-app URL
 * into GSHEET_WEBHOOK_URL.
 */

export type SheetTab = "individual" | "startup" | "advisor_letter";

export type SheetFile = {
  fileName: string;
  mimeType: string;
  base64: string;
};

export type SheetWriteResult =
  | { ok: true; rowNumber?: number }
  | { ok: false; error: string };

export type AdvisorContext = {
  applicantName: string;
  applicantEmail?: string;
  university?: string;
  faculty?: string;
  advisorName?: string;
  advisorEmail?: string;
  deadline: string;
  status: "pending" | "submitted";
};

export type AdvisorLookupResult =
  | { ok: true; context: AdvisorContext }
  | { ok: false; error: string };

const WEBHOOK_TIMEOUT_MS = 30_000;

function getConfig() {
  return {
    url: process.env.GSHEET_WEBHOOK_URL,
    secret: process.env.GSHEET_SHARED_SECRET ?? "",
  };
}

async function callAppsScript<T>(body: object): Promise<T | { ok: false; error: string }> {
  const { url, secret } = getConfig();

  if (!url) {
    console.warn("[sheets] GSHEET_WEBHOOK_URL not configured.");
    return { ok: false, error: "Sheets webhook not configured" };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, ...body }),
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[sheets] Apps Script rejected:", res.status, detail);
      return { ok: false, error: `Sheets ${res.status}: ${detail}` };
    }

    return (await res.json()) as T;
  } catch (err) {
    console.error("[sheets] Network error:", err);
    return { ok: false, error: String(err) };
  }
}

// ── 1. Write row ──────────────────────────────────────────────────────────

export type SheetRowInput = {
  tab: SheetTab;
  row: Record<string, string | number | boolean | SheetFile | undefined | null>;
};

export async function writeSheetRow(input: SheetRowInput): Promise<SheetWriteResult> {
  return callAppsScript<SheetWriteResult>({
    tab: input.tab,
    row: input.row,
  });
}

// ── 2. Lookup advisor by token ────────────────────────────────────────────

export async function lookupAdvisorByToken(token: string): Promise<AdvisorLookupResult> {
  return callAppsScript<AdvisorLookupResult>({
    action: "lookup_advisor",
    token,
  });
}

// ── 3. Submit advisor letter ──────────────────────────────────────────────

export async function submitAdvisorLetter(input: {
  token: string;
  file: SheetFile;
  note?: string;
}): Promise<SheetWriteResult & { applicantName?: string; advisorEmail?: string }> {
  return callAppsScript({
    action: "submit_letter",
    token: input.token,
    file: input.file,
    note: input.note ?? "",
  });
}

// ── File helper ──────────────────────────────────────────────────────────

export async function fileToSheetFile(
  file: File | null | undefined,
): Promise<SheetFile | undefined> {
  if (!file || file.size === 0) return undefined;
  const buf = Buffer.from(await file.arrayBuffer());
  return {
    fileName: file.name,
    mimeType: file.type || "application/octet-stream",
    base64: buf.toString("base64"),
  };
}
