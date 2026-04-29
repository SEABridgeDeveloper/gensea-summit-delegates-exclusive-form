# Google Sheets persistence via Apps Script

This is the database. No service-account keys, no Postgres, no Supabase — one
Google Sheet plus a small Apps Script web app. The Next.js API routes POST JSON
here; Apps Script writes one row per submission and uploads files to Drive.

## One-time setup (10 minutes)

### 1. Create the Sheet

1. Go to <https://sheets.new>
2. Rename the workbook **Gen SEA Summit 2026 — Applications**
3. Create three tabs (rename "Sheet1" then add two more):
   - `individual`
   - `startup`
   - `advisor_letter`

   The Apps Script auto-creates the header row on first write, so don't pre-fill.

4. **Create a Drive folder** for uploaded files:
   - In Drive, create a folder called `Gen SEA Summit 2026 — Uploads`
   - Open it, copy the folder ID from the URL
     (`https://drive.google.com/drive/folders/<THIS_PART>`)
   - Paste the ID into `UPLOAD_FOLDER_ID` inside the script (next step).

### 2. Add the Apps Script

1. In your Sheet: **Extensions → Apps Script**
2. Delete the boilerplate
3. Paste the entire contents of [`apps-script.gs`](./apps-script.gs) (the file
   alongside this one) into the editor
4. **Top of the script — fill in two values**:
   - `UPLOAD_FOLDER_ID` — the Drive folder ID from step 1.4
   - `SHARED_SECRET` — invent a random string, ~32 chars. Copy it; you'll paste
     it into `.env.local` as `GSHEET_SHARED_SECRET` so the website and the
     script agree.
5. Save (`⌘/Ctrl + S`)

### 3. Deploy as a Web App

1. Click **Deploy → New deployment**
2. Type: **Web app**
3. Description: `Gen SEA Summit application sink`
4. Execute as: **Me** (your account — owns the Sheet & Drive folder)
5. Who has access: **Anyone** (the shared-secret in the body keeps it private)
6. Click **Deploy**
7. Authorize when prompted (Google asks because the script writes to Drive +
   Sheets on your behalf)
8. Copy the **Web app URL** — looks like
   `https://script.google.com/macros/s/AK.../exec`

### 4. Set environment variables

Open `.env.local` (copy from `.env.example` if it doesn't exist) and fill in:

```
GSHEET_WEBHOOK_URL=https://script.google.com/macros/s/AK.../exec
GSHEET_SHARED_SECRET=<the same string you put in the Apps Script>
```

Restart `next dev` so the new env vars are picked up.

### 5. Smoke test

Submit the individual form locally (`/apply/delegate`). Within ~3 seconds:

- A new row should appear in the `individual` tab
- If a CV was uploaded, the `cv` column links to the Drive file
- The applicant's email gets the bootcamp confirmation
- The advisor's email gets the recommendation request

If nothing shows up:
1. Check the dev terminal for `[sheets] Apps Script rejected:` lines
2. In Apps Script editor, click **Executions** (left sidebar) — failed runs
   show the error
3. Common fixes:
   - Wrong `UPLOAD_FOLDER_ID` → script throws on Drive lookup
   - Mismatched `SHARED_SECRET` between env var and script → 403
   - Web app deployed as the wrong account → permission denied on Drive

## Updating the script later

Apps Script web apps don't auto-update. After editing the script:

1. **Deploy → Manage deployments**
2. Click the pencil icon on the existing deployment
3. Version → **New version**
4. Click **Deploy**

The web-app URL stays the same — no code change needed on the Next.js side.

## Schema reference

The Apps Script auto-discovers headers from the first row it writes to a tab.
Column order will follow the order keys are sent in the request body. To add a
new column, just include the key in the API route's `row` object — no schema
migration needed.

To rename a column:
1. Edit the cell in the Sheet header (row 1)
2. Update the corresponding key in the API route

## Backup

Right-click the Sheet → **Make a copy** before any major schema change.
Apps Script does not have undo for programmatic writes.
