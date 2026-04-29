/**
 * Gen SEA Summit 2026 — application sink (Google Apps Script)
 *
 * Receives JSON from the Next.js API routes and:
 *   1. Appends a row to the matching tab (individual / startup / advisor_letter).
 *   2. Uploads any files (CV, pitch deck, video) to a Drive folder and writes
 *      the resulting file URL into the row.
 *   3. Auto-creates the header row on first write so the API route can add new
 *      fields without a schema migration.
 *
 * SETUP — fill these two constants before deploying:
 */

// TODO(you): paste the Drive folder ID where uploaded files should land.
// Get it from the folder URL: drive.google.com/drive/folders/<THIS_PART>
const UPLOAD_FOLDER_ID = "PASTE_DRIVE_FOLDER_ID_HERE";

// TODO(you): invent a random string (~32 chars) and paste it here.
// Then paste the SAME string into your Next.js .env.local as GSHEET_SHARED_SECRET.
const SHARED_SECRET = "PASTE_RANDOM_SECRET_HERE";


// ─────────────────────────────────────────────────────────────────────────────
// Below this line: no edits needed for normal use.
// ─────────────────────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);

    if (payload.secret !== SHARED_SECRET) {
      return jsonResponse({ ok: false, error: "Forbidden" }, 403);
    }

    const tab = String(payload.tab || "");
    if (!["individual", "startup", "advisor_letter"].includes(tab)) {
      return jsonResponse({ ok: false, error: "Unknown tab: " + tab }, 400);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(tab);
    if (!sheet) sheet = ss.insertSheet(tab);

    const row = payload.row || {};

    // Resolve any file uploads to Drive URLs first.
    Object.keys(row).forEach((key) => {
      const val = row[key];
      if (val && typeof val === "object" && val.base64 && val.fileName) {
        row[key] = uploadToDrive(val);
      }
    });

    // Auto-discover headers: first write determines column order. New keys on
    // later writes get appended as new columns.
    const headers = ensureHeaders(sheet, Object.keys(row));
    const values = headers.map((h) => formatCell(row[h]));
    sheet.appendRow(values);

    return jsonResponse({ ok: true, row: sheet.getLastRow() });
  } catch (err) {
    console.error(err);
    return jsonResponse({ ok: false, error: String(err) }, 500);
  }
}

function ensureHeaders(sheet, incomingKeys) {
  const lastCol = sheet.getLastColumn();
  let existing =
    lastCol === 0 ? [] : sheet.getRange(1, 1, 1, lastCol).getValues()[0].filter(Boolean);

  if (existing.length === 0) {
    sheet.getRange(1, 1, 1, incomingKeys.length).setValues([incomingKeys]);
    sheet.setFrozenRows(1);
    sheet
      .getRange(1, 1, 1, incomingKeys.length)
      .setFontWeight("bold")
      .setBackground("#FBF1E1");
    return incomingKeys;
  }

  // Add any new keys at the end of the header row.
  const missing = incomingKeys.filter((k) => existing.indexOf(k) === -1);
  if (missing.length) {
    sheet
      .getRange(1, existing.length + 1, 1, missing.length)
      .setValues([missing])
      .setFontWeight("bold")
      .setBackground("#FBF1E1");
    existing = existing.concat(missing);
  }
  return existing;
}

function formatCell(v) {
  if (v === undefined || v === null) return "";
  if (typeof v === "boolean") return v ? "TRUE" : "FALSE";
  return v;
}

function uploadToDrive(file) {
  if (UPLOAD_FOLDER_ID === "PASTE_DRIVE_FOLDER_ID_HERE") {
    throw new Error("UPLOAD_FOLDER_ID not configured in Apps Script.");
  }
  const folder = DriveApp.getFolderById(UPLOAD_FOLDER_ID);
  const blob = Utilities.newBlob(
    Utilities.base64Decode(file.base64),
    file.mimeType || "application/octet-stream",
    file.fileName,
  );
  const driveFile = folder.createFile(blob);
  // Anyone with the link can view — adjust to your privacy needs.
  driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return driveFile.getUrl();
}

function jsonResponse(obj, status) {
  const out = ContentService.createTextOutput(JSON.stringify(obj));
  out.setMimeType(ContentService.MimeType.JSON);
  // Apps Script ContentService doesn't expose status codes — Next.js treats
  // 200 + ok:false as a logical failure, which is fine.
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// Optional helper: advisor uploads their letter through a small page. If you
// build /advisor/upload as another POST endpoint, route it through the same
// shared secret + the "advisor_letter" tab.
// ─────────────────────────────────────────────────────────────────────────────
