# Email branding

Three places brand visuals show up:

1. **Inside the email body** — the logo at the top of every message we send.
   Already wired up via `EMAIL_LOGO_URL` (or the `/genseasummit-logo.png` fallback). Works in every client. **Done — no further setup needed.**
2. **Inbox sender avatar** — the round image next to the sender name in the
   inbox list (Gmail, Apple Mail, Outlook, etc.). Setting this requires DNS or
   SMTP changes outside Resend.
3. **The "From" name** — the human-readable name in the inbox. Already
   controlled via `EMAIL_FROM` (`"Display Name <address@domain>"`).

This doc covers #2 — the inbox avatar.

---

## Why you can't set the inbox avatar from Resend directly

Gmail's avatar lookup, in order of preference:

1. **BIMI** record published in DNS for the sending domain.
2. **Profile photo of the actual Google account** that sent the message — only applies if the message was sent from that Gmail account through Gmail's SMTP.
3. Letter avatar (the colored circle with the first character of the From name).

Resend sends from your verified domain, but it's *not* sending from a real
Gmail mailbox — so step 2 doesn't apply. Setting `EMAIL_FROM=team@seabridge.space`
without owning the Gmail mailbox of that address won't pick up its profile
photo, even if that address is real.

You have two real paths.

---

## Path A — BIMI (recommended for production)

Brand Indicators for Message Identification: a domain-level standard
supported by Gmail, Yahoo, Apple Mail, Fastmail. One logo per sending domain.
Free.

### Prereqs

- DMARC policy on your domain set to `p=quarantine` or `p=reject`. Resend
  guides you through DKIM and SPF setup; DMARC is the final piece.
  Check yours: <https://mxtoolbox.com/dmarc.aspx>
- A logo as **SVG Tiny PS** (a constrained SVG profile, ~32KB max). Convert
  your existing PNG with: <https://bimigroup.org/svg-conversion-tools/>
- The SVG hosted at a stable HTTPS URL on your domain.

### Steps

1. Convert `genseasummit-logo.png` → `bimi-logo.svg` using one of the
   converters above. Confirm the file passes <https://bimigroup.org/bimi-generator/>.
2. Upload it to your domain at e.g. `https://seabridge.space/bimi/logo.svg`.
3. Add a DNS TXT record on the **sending domain or subdomain** Resend uses:
   ```
   default._bimi.seabridge.space  TXT  "v=BIMI1; l=https://seabridge.space/bimi/logo.svg;"
   ```
   If you send from a subdomain (e.g. `mail.seabridge.space`), put the record
   at `default._bimi.mail.seabridge.space`.
4. Wait up to 24h. Send a test email to a Gmail account.
5. Verify with <https://bimigroup.org/bimi-generator/> → "Validate existing record".

Optional: pay for a **Verified Mark Certificate (VMC)** from Entrust or
DigiCert (~$1k/yr). This adds a blue checkmark next to your logo in Gmail and
is required for some clients to actually display the logo. Without a VMC,
Gmail shows the logo only if you're a high-volume sender with strong DMARC
history. Most small senders don't qualify on a fresh domain — give it
several weeks of consistent sending first.

### What this does NOT do

BIMI is per-domain. You can't have a different avatar per email. The logo
must represent the brand of the entire sending domain.

---

## Path B — Send via Gmail SMTP relay (use the actual `team@seabridge.space` mailbox)

If `team@seabridge.space` is a real Google Workspace mailbox and you want its
existing Gmail profile picture to appear automatically in inboxes, send through
Gmail's SMTP instead of Resend. Replaces what `lib/email/client.ts` does.

### Trade-offs

- **Pros:** Inherits Gmail's avatar treatment for free. No DNS work.
- **Cons:**
  - **500 messages/day rate limit** for free Gmail; **2000/day** for paid
    Workspace. Fine for application emails, tight for marketing blasts.
  - Sender reputation tied to one mailbox. If that account is flagged, all mail
    stops.
  - Loses Resend's deliverability tooling, retries, and dashboards.
  - Requires an OAuth2 token or App Password.

### Steps (App Password path — simplest)

1. In Google Workspace Admin: ensure 2FA is on for `team@seabridge.space`.
2. Generate an App Password: <https://myaccount.google.com/apppasswords>
   → "Mail" → "Other" → name it "Gen SEA Summit site" → copy the 16-char password.
3. Install nodemailer: `npm i nodemailer`
4. Replace `lib/email/client.ts` with a Gmail SMTP version (sketch below).

```ts
// lib/email/client.ts
import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,         // team@seabridge.space
    pass: process.env.GMAIL_APP_PASSWORD, // 16-char app password
  },
});

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  try {
    const info = await transport.sendMail({
      from: process.env.GMAIL_USER,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      replyTo: input.replyTo ?? process.env.GMAIL_USER,
    });
    return { ok: true, id: info.messageId };
  } catch (err) {
    console.error("[email] gmail relay error:", err);
    return { ok: false, error: String(err) };
  }
}
```

5. Add to `.env.local`:
   ```
   GMAIL_USER=team@seabridge.space
   GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
   ```
6. Test send. Open the email in another Gmail account — the team@seabridge.space
   profile photo should appear.

### Steps (OAuth2 path — production-grade)

For higher rate limits and better Workspace integration, use Gmail API with a
service account + domain-wide delegation. Not covered here — ask if you go
that route.

---

## Recommendation

- **Now / launch:** keep using Resend, set `EMAIL_FROM` properly, ship the
  in-body logo (already done). Inbox avatar will be the colored letter circle
  until you set up BIMI.
- **Next 2 weeks:** publish BIMI for `seabridge.space` so the logo
  appears in inboxes. Total time ~1 hour including DMARC verification.
- **Only if you really want the team@seabridge.space avatar specifically:**
  switch to Gmail SMTP per Path B. Accept the 2000/day cap.
