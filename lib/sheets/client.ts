/**
 * Google Sheets persistence via Apps Script Web App.
 *
 * No database, no service-account JSON keys. The Sheet owner deploys an Apps
 * Script web app that exposes a single `doPost` endpoint, and we POST JSON to
 * it. The Apps Script writes one row per submission to the appropriate tab.
 *
 * See `docs/apps-script.md` (or the file printed alongside) for the script
 * source and step-by-step setup. Once deployed, paste the web-app URL into
 * GSHEET_WEBHOOK_URL.
 *
 * Files (CV, pitch deck, video) are sent as base64 strings; the Apps Script
 * uploads them to a Drive folder and writes the resulting URL into the row.
 */

export type SheetTab = "individual" | "startup" | "advisor_letter";

export type SheetRowInput = {
  tab: SheetTab;
  /**
   * Object of column -> value pairs. Values can be strings, numbers, booleans,
   * or { fileName, mimeType, base64 } for file uploads.
   */
  row: Record<string, string | number | boolean | SheetFile | undefined | null>;
};

export type SheetFile = {
  fileName: string;
  mimeType: string;
  base64: string;
};

export type SheetWriteResult =
  | { ok: true; rowNumber?: number }
  | { ok: false; error: string };

export async function writeSheetRow(input: SheetRowInput): Promise<SheetWriteResult> {
  const url = process.env.GSHEET_WEBHOOK_URL;
  const sharedSecret = process.env.GSHEET_SHARED_SECRET;

  if (!url) {
    console.warn(
      "[sheets] GSHEET_WEBHOOK_URL not configured — skipping sheet write.",
      { tab: input.tab },
    );
    return { ok: false, error: "Sheets webhook not configured" };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Apps Script web apps are stateless — we authenticate via a shared
      // secret in the body so a leaked URL alone can't append rows.
      body: JSON.stringify({
        secret: sharedSecret ?? "",
        tab: input.tab,
        row: input.row,
      }),
      // Apps Script may take a few seconds; raise the default fetch timeout.
      signal: AbortSignal.timeout(30_000),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[sheets] Apps Script rejected:", res.status, detail);
      return { ok: false, error: `Sheets ${res.status}: ${detail}` };
    }

    const body = (await res.json()) as { ok?: boolean; row?: number; error?: string };
    if (!body.ok) {
      return { ok: false, error: body.error ?? "Unknown Apps Script error" };
    }
    return { ok: true, rowNumber: body.row };
  } catch (err) {
    console.error("[sheets] Network error writing row:", err);
    return { ok: false, error: String(err) };
  }
}

/**
 * Convert a browser File (already on the server thanks to FormData) into the
 * shape the Apps Script expects. Returns undefined for falsy input.
 */
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
