/**
 * Gen SEA Summit 2026 — application sink (Google Apps Script)
 *
 * Receives JSON from the Next.js API routes. Three actions:
 *
 *   - (default, no `action`)  → append a row to a tab + upload files to Drive
 *   - "lookup_advisor"        → return applicant context for an advisor token
 *   - "submit_letter"         → upload letter PDF + mark row as submitted
 *
 * SETUP — fill these two constants before deploying:
 */

// TODO(you): paste the Drive folder ID where uploaded files should land.
const UPLOAD_FOLDER_ID = "PASTE_DRIVE_FOLDER_ID_HERE";

// TODO(you): invent a random ~32-char string. Paste the SAME string into your
// Next.js .env.local as GSHEET_SHARED_SECRET.
const SHARED_SECRET = "PASTE_RANDOM_SECRET_HERE";


// ─────────────────────────────────────────────────────────────────────────────
// Below this line: no edits needed for normal use.
// ─────────────────────────────────────────────────────────────────────────────

const INDIVIDUAL_TAB = "individual";
const STARTUP_TAB = "startup";
const ADVISOR_TOKEN_COL = "advisorToken";

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);

    if (payload.secret !== SHARED_SECRET) {
      return jsonResponse({ ok: false, error: "Forbidden" });
    }

    switch (payload.action) {
      case "lookup_advisor":
        return handleLookupAdvisor(payload);
      case "submit_letter":
        return handleSubmitLetter(payload);
      default:
        return handleWriteRow(payload);
    }
  } catch (err) {
    console.error(err);
    return jsonResponse({ ok: false, error: String(err) });
  }
}

// ── Action 1: append a row ────────────────────────────────────────────────

function handleWriteRow(payload) {
  const tab = String(payload.tab || "");
  if (![INDIVIDUAL_TAB, STARTUP_TAB, "advisor_letter"].indexOf(tab) === -1) {
    // (typo guard — fall through and let getSheetByName fail below)
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(tab);
  if (!sheet) sheet = ss.insertSheet(tab);

  const row = payload.row || {};

  // Resolve any file uploads to Drive URLs first.
  Object.keys(row).forEach(function (key) {
    var val = row[key];
    if (val && typeof val === "object" && val.base64 && val.fileName) {
      row[key] = uploadToDrive(val);
    }
  });

  const headers = ensureHeaders(sheet, Object.keys(row));
  const values = headers.map(function (h) {
    return formatCell(row[h]);
  });
  sheet.appendRow(values);

  return jsonResponse({ ok: true, row: sheet.getLastRow() });
}

// ── Action 2: lookup advisor context by token ────────────────────────────

function handleLookupAdvisor(payload) {
  const token = String(payload.token || "");
  if (!token) return jsonResponse({ ok: false, error: "Missing token" });

  const found = findRowByToken(token);
  if (!found) return jsonResponse({ ok: false, error: "Token not found" });

  const r = found.rowObject;

  return jsonResponse({
    ok: true,
    context: {
      applicantName: r.fullName || "",
      applicantEmail: r.email || "",
      university: r.university || "",
      faculty: r.faculty || "",
      advisorName: r.advisorName || "",
      advisorEmail: r.advisorEmail || "",
      deadline: r.advisorLetterDeadline || "",
      status: r.advisorLetterStatus === "submitted" ? "submitted" : "pending",
    },
  });
}

// ── Action 3: submit advisor letter ──────────────────────────────────────

function handleSubmitLetter(payload) {
  const token = String(payload.token || "");
  if (!token) return jsonResponse({ ok: false, error: "Missing token" });

  const file = payload.file;
  if (!file || !file.base64 || !file.fileName) {
    return jsonResponse({ ok: false, error: "Missing letter file" });
  }

  const found = findRowByToken(token);
  if (!found) return jsonResponse({ ok: false, error: "Token not found" });

  const url = uploadToDrive(file);
  const note = String(payload.note || "");
  const submittedAt = new Date().toISOString();

  // Update / add the relevant columns on the matching row.
  setRowColumns(found.sheet, found.rowIndex, {
    advisorLetterStatus: "submitted",
    advisorLetterUrl: url,
    advisorLetterSubmittedAt: submittedAt,
    advisorLetterNote: note,
  });

  return jsonResponse({
    ok: true,
    applicantName: found.rowObject.fullName || "",
    advisorEmail: found.rowObject.advisorEmail || "",
  });
}

// ── Helpers ──────────────────────────────────────────────────────────────

/**
 * Walk every row in the `individual` tab looking for `advisorToken === token`.
 * Returns { sheet, rowIndex, rowObject } or null.
 */
function findRowByToken(token) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(INDIVIDUAL_TAB);
  if (!sheet || sheet.getLastRow() < 2) return null;

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const tokenCol = headers.indexOf(ADVISOR_TOKEN_COL);
  if (tokenCol === -1) return null;

  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues();
  for (let i = 0; i < data.length; i++) {
    if (String(data[i][tokenCol]) === token) {
      const rowObject = {};
      headers.forEach(function (h, j) {
        rowObject[h] = data[i][j];
      });
      return { sheet: sheet, rowIndex: i + 2, rowObject: rowObject };
    }
  }
  return null;
}

/**
 * Set named columns on a row, adding new columns to the header if needed.
 */
function setRowColumns(sheet, rowIndex, updates) {
  const lastCol = sheet.getLastColumn();
  let headers =
    lastCol === 0
      ? []
      : sheet.getRange(1, 1, 1, lastCol).getValues()[0].filter(Boolean);

  const newHeaders = Object.keys(updates).filter(function (k) {
    return headers.indexOf(k) === -1;
  });
  if (newHeaders.length) {
    sheet
      .getRange(1, headers.length + 1, 1, newHeaders.length)
      .setValues([newHeaders])
      .setFontWeight("bold")
      .setBackground("#FBF1E1");
    headers = headers.concat(newHeaders);
  }

  Object.keys(updates).forEach(function (k) {
    const col = headers.indexOf(k) + 1;
    if (col > 0) sheet.getRange(rowIndex, col).setValue(formatCell(updates[k]));
  });
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

  const missing = incomingKeys.filter(function (k) {
    return existing.indexOf(k) === -1;
  });
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
  driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return driveFile.getUrl();
}

function jsonResponse(obj) {
  const out = ContentService.createTextOutput(JSON.stringify(obj));
  out.setMimeType(ContentService.MimeType.JSON);
  return out;
}
