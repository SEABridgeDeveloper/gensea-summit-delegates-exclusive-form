/**
 * Email content for the three transactional messages we send on submit:
 *
 *   1. individualConfirmation — to the applicant after individual submit
 *   2. advisorRequest         — to the applicant's advisor (private upload link)
 *   3. startupConfirmation    — to the founder after startup submit
 *
 * Each template returns { subject, html, text }. Keep HTML simple and inline-styled
 * so it renders in every client (Gmail strips <style> tags from <head>).
 *
 * TODO(you): tweak any wording, signature, or links to match the program's voice.
 */

const PROGRAM_NAME = "Gen SEA Summit 2026";
const SUMMIT_DATES = "16–18 July 2026";
const SUMMIT_LOCATION = "Khon Kaen, Thailand";

// Any user-supplied string that lands inside an HTML email body must pass
// through this — otherwise an applicant can inject phishing CTAs into the
// staff/advisor notification (the recipient and submitter are different
// parties). Subjects and the plain-text body are not HTML-rendered and do
// not need escaping here.
const HTML_ESCAPE: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => HTML_ESCAPE[ch]!);
}

/**
 * Brand palette mirrored from tailwind.config.ts. Email clients (Gmail in
 * particular) strip <style> from <head>, so colors must be inlined. Keeping
 * them here in one place means a palette change touches one constant block
 * instead of dozens of style="…" attributes scattered through the file.
 *
 * Aligned to the landing-page tree: dark "ink" surface + "bone" text +
 * sunset accents (see tailwind.config.ts → ink, bone, sunset ramps).
 */
const BRAND = {
  // Surfaces (dark continuum) — match landing `ink.*`
  inkPage: "#050505", // outer background, slightly darker than card to frame it
  ink: "#0A0A0A", // canonical poster-black
  inkElevated: "#16171A", // card / panel
  inkSubtle: "#1F2024", // hover / pressed surface
  inkHairline: "rgba(255,250,241,0.10)", // bone @ 10% — same as `border-bone-hairline`

  // Text on dark — match landing `bone.*`
  bone: "#FFFAF1",
  boneMuted: "rgba(255,250,241,0.78)",
  boneSubtle: "rgba(255,250,241,0.55)",

  // Brand sunset (only orange ramp) — match landing `sunset.*`
  sunset50: "#FFF3EA",
  sunset200: "#FFC79C",
  sunset300: "#FFA968",
  sunset400: "#FF8A3D", // primary link/accent on dark — passes contrast
  sunset500: "#FF6B1A",
  sunset600: "#E54A0F",
  sunset700: "#C8341E",
  sunset500Tint: "rgba(255,107,26,0.14)",
  sunset500Tint8: "rgba(255,107,26,0.08)",

  // Signature gradient ribbon — same stops as `bg-brand-gradient` on web.
  gradient:
    "linear-gradient(90deg, #C8341E 0%, #E54A0F 28%, #FF6B1A 58%, #FF8A3D 82%, #FFB347 100%)",
} as const;

/**
 * Resolve the logo URL used at the top of every email.
 *
 * Precedence:
 *   1. EMAIL_LOGO_URL — explicit override (use this for a different image).
 *   2. NEXT_PUBLIC_APP_URL + /genseasummit-logo.png — the public asset already
 *      shipped in /public.
 *   3. Hard-coded production fallback.
 *
 * NOTE: must be an absolute https URL — Gmail blocks relative URLs and
 * http:// images by default.
 */
function getLogoUrl(): string {
  if (process.env.EMAIL_LOGO_URL) return process.env.EMAIL_LOGO_URL;
  const base =
    process.env.NEXT_PUBLIC_APP_URL ??
    "https://gensea-summit-delegates-exclusive-f.vercel.app";
  return `${base.replace(/\/$/, "")}/genseasummit-logo.png`;
}

/**
 * Sign-off block at the bottom of every email body.
 *
 * Pattern matches the corporate Gmail signature provided by the team:
 *
 *     Yours sincerely,
 *     Mr. Kananate Watewitee
 *     Head of Business Partnerships  ·  SEA Bridge Team
 *
 * If EMAIL_SIGNATURE_NAME is set, renders that pattern with the
 * configured name/title/org. Otherwise falls back to a generic team
 * sign-off (still using the salutation + name pattern).
 *
 * Localization hook: `isThai` is wired up but always false today —
 * the project doesn't ship a Thai dictionary. When it does, pass the
 * locale through and the salutation switches to "ด้วยความนับถือ".
 *
 * Env vars used:
 *   EMAIL_SIGNATURE_NAME   — e.g. "Mr. Kananate Watewitee"
 *   EMAIL_SIGNATURE_TITLE  — e.g. "Head of Business Partnerships"
 *   EMAIL_SIGNATURE_ORG    — e.g. "SEA Bridge Team"
 */
function signOff(opts: { isThai?: boolean } = {}): { html: string; text: string } {
  const name = process.env.EMAIL_SIGNATURE_NAME?.trim();
  const title = process.env.EMAIL_SIGNATURE_TITLE?.trim();
  const org = process.env.EMAIL_SIGNATURE_ORG?.trim();
  const isThai = opts.isThai ?? false;
  const salutation = isThai ? "ด้วยความนับถือ" : "Yours sincerely,";

  // Resolved fallbacks so an unconfigured project still renders cleanly.
  const displayName = name || "The Gen SEA Summit team";
  const subtitle = [title, org].filter(Boolean).join(" · ");
  const subtitleText = [title, org].filter(Boolean).join(", ");

  const html = `
    <p style="margin:24px 0 2px;font-size:14px;color:${BRAND.boneMuted};">${salutation}</p>
    <p style="margin:0;font-size:14px;font-weight:700;color:${BRAND.bone};">${displayName}</p>
    ${
      subtitle
        ? `<p style="margin:2px 0 16px;font-size:13px;color:${BRAND.boneMuted};">${subtitle}</p>`
        : `<p style="margin:0 0 16px;"></p>`
    }
  `.trim();

  const textLines = [salutation, displayName];
  if (subtitleText) textLines.push(subtitleText);
  return { html, text: textLines.join("\n") };
}

/**
 * Corporate footer block — sits at the bottom of every email card.
 *
 * Renders the SEA Bridge / Really Corp. contact card the team uses in
 * Gmail, with the contact details sourced from env vars (so the same
 * code can serve a different signer without redeploying).
 *
 * Env vars used (with sensible defaults):
 *   EMAIL_SENDER_WEBSITE       — default "https://seabridge.space"
 *   EMAIL_SENDER_CONTACT       — default "team@seabridge.space"
 *   EMAIL_SENDER_PHONE         — default "(+66) 919946459"
 *   EMAIL_SENDER_CHANNELS_URL  — default "https://www.openlink.co/seabridge"
 *   EMAIL_SENDER_COMPANY       — default "SEA Bridge"
 *   EMAIL_SENDER_PARENT        — default "Really Corp."
 *
 * Link colour is sunset-300 — has enough hue separation from `bone` body
 * text to read as a link on the dark surface, while staying on-brand.
 */
function corporateFooter(): string {
  const websiteUrl = (process.env.EMAIL_SENDER_WEBSITE ?? "https://seabridge.space").trim();
  const senderEmail = (process.env.EMAIL_SENDER_CONTACT ?? "team@seabridge.space").trim();
  const phone = (process.env.EMAIL_SENDER_PHONE ?? "(+66) 919946459").trim();
  const channelsUrl = (
    process.env.EMAIL_SENDER_CHANNELS_URL ?? "https://www.openlink.co/seabridge"
  ).trim();
  const company = (process.env.EMAIL_SENDER_COMPANY ?? "SEA Bridge").trim();
  const parent = (process.env.EMAIL_SENDER_PARENT ?? "Really Corp.").trim();
  const websiteLabel = websiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const linkColor = BRAND.sunset300;

  return `
    <div style="background:${BRAND.ink};padding:24px 28px;border-top:1px solid ${BRAND.inkHairline};">
      <p style="margin:0 0 4px;font-size:12px;color:${BRAND.bone};">
        <strong style="color:${BRAND.sunset400};">${company}</strong> &nbsp;|&nbsp; <span style="color:${BRAND.boneMuted};">${parent}</span>
      </p>
      <p style="margin:0 0 4px;font-size:12px;color:${BRAND.boneMuted};">
        <strong style="color:${BRAND.bone};">Web:</strong> <a href="${websiteUrl}" style="color:${linkColor};text-decoration:none;">${websiteLabel}</a>
        &nbsp;|&nbsp; <strong style="color:${BRAND.bone};">Email:</strong> <a href="mailto:${senderEmail}" style="color:${linkColor};text-decoration:none;">${senderEmail}</a>
      </p>
      <p style="margin:0 0 4px;font-size:12px;color:${BRAND.boneMuted};"><strong style="color:${BRAND.bone};">Tel:</strong> ${phone}</p>
      <p style="margin:0 0 12px;font-size:12px;color:${BRAND.boneMuted};">
        <strong style="color:${BRAND.bone};">${company} Channels:</strong> <a href="${channelsUrl}" style="color:${linkColor};text-decoration:none;">${channelsUrl}</a>
      </p>
      <p style="margin:0;font-size:11px;color:${BRAND.boneSubtle};font-style:italic;">
        If you didn't expect this email, just ignore it — no action needed.
      </p>
    </div>
  `.trim();
}

// Wrap a body in the same shell across all messages — keeps branding consistent.
function shell(opts: { preheader: string; body: string }): string {
  const logoUrl = getLogoUrl();
  // The preheader is the snippet shown in inbox previews. Hidden in the body.
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:${BRAND.inkPage};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${BRAND.bone};">
    <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">${opts.preheader}</span>
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${BRAND.inkPage};padding:32px 16px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;background:${BRAND.inkElevated};border-radius:16px;overflow:hidden;border:1px solid ${BRAND.inkHairline};">
            <tr>
              <td style="height:6px;background:${BRAND.gradient};line-height:6px;font-size:0;">&nbsp;</td>
            </tr>
            <tr>
              <td align="left" style="padding:32px 40px 0;background:${BRAND.ink};">
                <img src="${logoUrl}" alt="${PROGRAM_NAME}" width="140" height="auto" style="display:block;border:0;outline:0;text-decoration:none;height:auto;width:140px;max-width:140px;">
                <p style="margin:16px 0 0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${BRAND.sunset400};font-weight:700;">${PROGRAM_NAME}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 40px 40px;font-size:15px;line-height:1.6;color:${BRAND.bone};background:${BRAND.ink};">
                ${opts.body}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 40px;background:${BRAND.inkSubtle};border-top:1px solid ${BRAND.inkHairline};font-size:11px;letter-spacing:0.16em;text-transform:uppercase;font-weight:700;color:${BRAND.sunset400};">
                ${PROGRAM_NAME} · ${SUMMIT_DATES} · ${SUMMIT_LOCATION}
              </td>
            </tr>
            <tr>
              <td style="padding:0;">${corporateFooter()}</td>
            </tr>
            <tr>
              <td style="height:4px;background:${BRAND.gradient};line-height:4px;font-size:0;">&nbsp;</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// ────────────────────────────────────────────────────────────────────────────
// 1. Individual applicant confirmation — sent to the student/applicant
// ────────────────────────────────────────────────────────────────────────────

export function individualConfirmationEmail(args: {
  applicantName: string;
  applicantEmail: string;
  bootcampUrl: string;
  teamFlowUrl: string;
  advisorLetterDeadline: string;
  advisorEmail: string;
}) {
  const subject = `You're in the Bootcamp — ${PROGRAM_NAME}`;
  const sig = signOff();

  const text = `Hi ${args.applicantName},

Your application for ${PROGRAM_NAME} (Individual / Delegates 2026) is in. You're enrolled in the Gen SEA Bootcamp — selection for the Top 50 happens after the Capstone.

Two things to do now:

1. Enroll in the Gen SEA Bootcamp (GVP)
   ${args.bootcampUrl}

2. Join your Team Flow workspace
   ${args.teamFlowUrl}

We've also emailed your advisor (${args.advisorEmail}) a private link to upload their recommendation letter. They have until ${args.advisorLetterDeadline} to submit it.

Save the dates: ${SUMMIT_DATES} in ${SUMMIT_LOCATION}.

${sig.text}`;

  const html = shell({
    preheader: "Your bootcamp access is inside.",
    body: `
      <h1 style="margin:0 0 16px;font-size:24px;line-height:1.2;font-weight:700;color:${BRAND.bone};">Hi ${escapeHtml(args.applicantName)},</h1>
      <p style="margin:0 0 16px;color:${BRAND.boneMuted};">Your application is in. You're <strong style="color:${BRAND.bone};">enrolled in the Gen SEA Bootcamp</strong> — selection for the Top 50 Delegates happens after the Capstone.</p>

      <h2 style="margin:32px 0 12px;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:${BRAND.sunset400};">Two things to do now</h2>

      <ol style="margin:0 0 24px;padding-left:20px;color:${BRAND.boneMuted};">
        <li style="margin-bottom:12px;"><strong style="color:${BRAND.bone};">Enroll in the Gen SEA Bootcamp.</strong><br><a href="${args.bootcampUrl}" style="color:${BRAND.sunset300};font-weight:600;text-decoration:none;">Open enrollment link →</a></li>
        <li><strong style="color:${BRAND.bone};">Join your Team Flow workspace.</strong><br><a href="${args.teamFlowUrl}" style="color:${BRAND.sunset300};font-weight:600;text-decoration:none;">Open Team Flow →</a></li>
      </ol>

      <p style="margin:24px 0 16px;padding:16px;background:${BRAND.sunset500Tint};border-left:4px solid ${BRAND.sunset500};border-radius:8px;color:${BRAND.bone};">
        We've also emailed <strong>${escapeHtml(args.advisorEmail)}</strong> a private link for your recommendation letter. Your advisor has until <strong style="color:${BRAND.sunset300};">${args.advisorLetterDeadline}</strong> to submit it.
      </p>

      <p style="margin:0 0 8px;color:${BRAND.boneMuted};">Save the dates: <strong style="color:${BRAND.bone};">${SUMMIT_DATES}</strong> in <span style="color:${BRAND.bone};">${SUMMIT_LOCATION}</span>.</p>
      ${sig.html}
    `,
  });

  return { subject, html, text };
}

// ────────────────────────────────────────────────────────────────────────────
// 2. Advisor recommendation request — sent to the advisor's institutional email
// ────────────────────────────────────────────────────────────────────────────

export function advisorRequestEmail(args: {
  advisorName: string;
  applicantName: string;
  uploadUrl: string;
  deadline: string;
}) {
  const subject = `Recommendation request — ${args.applicantName} (${PROGRAM_NAME})`;
  const sig = signOff();

  const text = `Dear ${args.advisorName},

${args.applicantName} has applied to ${PROGRAM_NAME} (Gen SEA Delegates 2026 — Top 50) and has named you as their academic referee.

Could you submit a brief letter of recommendation through the secure link below? It takes about 5 minutes — you can paste plain text or upload a PDF.

  ${args.uploadUrl}

Deadline: ${args.deadline}

If you weren't expecting this or don't recognise the applicant, please disregard this email — no action will be taken.

Thank you,
${sig.text}`;

  const html = shell({
    preheader: `${escapeHtml(args.applicantName)} has named you as their referee. Please submit a letter by ${args.deadline}.`,
    body: `
      <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;font-weight:700;color:${BRAND.bone};">Dear ${escapeHtml(args.advisorName)},</h1>

      <p style="margin:0 0 16px;color:${BRAND.boneMuted};"><strong style="color:${BRAND.bone};">${escapeHtml(args.applicantName)}</strong> has applied to ${PROGRAM_NAME} (Gen SEA Delegates 2026 — Top 50) and has named you as their academic referee.</p>

      <p style="margin:0 0 24px;color:${BRAND.boneMuted};">Could you submit a brief letter of recommendation through the secure link below? It takes about 5 minutes — you can paste plain text or upload a PDF.</p>

      <p style="margin:0 0 24px;text-align:center;">
        <a href="${args.uploadUrl}" style="display:inline-block;background:${BRAND.sunset500};color:${BRAND.bone};padding:14px 28px;border-radius:9999px;font-weight:600;text-decoration:none;box-shadow:0 18px 50px -18px rgba(255,87,34,0.55);">Submit recommendation letter</a>
      </p>

      <p style="margin:0 0 16px;padding:16px;background:${BRAND.sunset500Tint};border-left:4px solid ${BRAND.sunset500};border-radius:8px;color:${BRAND.bone};">
        <strong>Deadline:</strong> <span style="color:${BRAND.sunset300};font-weight:600;">${args.deadline}</span>
      </p>

      <p style="margin:24px 0 0;font-size:13px;color:${BRAND.boneSubtle};">If you weren't expecting this or don't recognise the applicant, please disregard this email — no action will be taken.</p>
      ${sig.html}
    `,
  });

  return { subject, html, text };
}

// ────────────────────────────────────────────────────────────────────────────
// 2b. Advisor confirmation — sent to the advisor AFTER they submit the letter
// ────────────────────────────────────────────────────────────────────────────

export function advisorLetterReceivedEmail(args: {
  advisorName: string;
  applicantName: string;
}) {
  const subject = `Letter received — ${args.applicantName} (${PROGRAM_NAME})`;
  const sig = signOff();

  const text = `Dear ${args.advisorName},

Thank you for submitting a letter of recommendation for ${args.applicantName}.

Your letter has been received and shared with the program selection team. No further action is needed.

${sig.text}`;

  const html = shell({
    preheader: "Your recommendation letter has been received.",
    body: `
      <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;font-weight:700;color:${BRAND.bone};">Dear ${escapeHtml(args.advisorName)},</h1>
      <p style="margin:0 0 16px;color:${BRAND.boneMuted};">Thank you for submitting a letter of recommendation for <strong style="color:${BRAND.bone};">${escapeHtml(args.applicantName)}</strong>.</p>
      <p style="margin:0 0 16px;color:${BRAND.boneMuted};">Your letter has been received and shared with the program selection team. No further action is needed.</p>
      ${sig.html}
    `,
  });

  return { subject, html, text };
}

// ────────────────────────────────────────────────────────────────────────────
// 3. Startup founder confirmation — sent to the founder after submit
// ────────────────────────────────────────────────────────────────────────────

export function startupConfirmationEmail(args: {
  founderName: string;
  ventureName: string;
  bootcampUrl: string;
  teamFlowUrl: string;
}) {
  const subject = `${args.ventureName} is in the Bootcamp — ${PROGRAM_NAME}`;
  const sig = signOff();

  const text = `Hi ${args.founderName},

Thanks for applying with ${args.ventureName} to ${PROGRAM_NAME} (Gen SEA Ventures 33). You're enrolled in the Gen SEA Bootcamp — the Top 33 cohort is announced 2 June 2026.

Two things to do now:

1. Enroll in the Gen SEA Bootcamp (GVP)
   ${args.bootcampUrl}

2. Join your Team Flow workspace
   ${args.teamFlowUrl}

Pre-summit prep: 9–13 June 2026 (online).
Summit: ${SUMMIT_DATES} in ${SUMMIT_LOCATION}.

${sig.text}`;

  const html = shell({
    preheader: "Your bootcamp access for Gen SEA Ventures 33.",
    body: `
      <h1 style="margin:0 0 16px;font-size:24px;line-height:1.2;font-weight:700;color:${BRAND.bone};">Hi ${escapeHtml(args.founderName)},</h1>
      <p style="margin:0 0 16px;color:${BRAND.boneMuted};">Thanks for applying with <strong style="color:${BRAND.bone};">${escapeHtml(args.ventureName)}</strong>. You're <strong style="color:${BRAND.bone};">enrolled in the Gen SEA Bootcamp</strong> — the Top 33 cohort is announced <strong style="color:${BRAND.sunset300};">2 June 2026</strong>.</p>

      <h2 style="margin:32px 0 12px;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:${BRAND.sunset400};">Two things to do now</h2>

      <ol style="margin:0 0 24px;padding-left:20px;color:${BRAND.boneMuted};">
        <li style="margin-bottom:12px;"><strong style="color:${BRAND.bone};">Enroll in the Gen SEA Bootcamp.</strong><br><a href="${args.bootcampUrl}" style="color:${BRAND.sunset300};font-weight:600;text-decoration:none;">Open enrollment link →</a></li>
        <li><strong style="color:${BRAND.bone};">Join your Team Flow workspace.</strong><br><a href="${args.teamFlowUrl}" style="color:${BRAND.sunset300};font-weight:600;text-decoration:none;">Open Team Flow →</a></li>
      </ol>

      <p style="margin:24px 0 0;padding:16px;background:${BRAND.sunset500Tint8};border-left:4px solid ${BRAND.sunset700};border-radius:8px;color:${BRAND.bone};">
        <strong>Save the dates:</strong><br>
        <span style="color:${BRAND.boneMuted};">Pre-summit prep:</span> 9–13 June 2026 (online)<br>
        <span style="color:${BRAND.boneMuted};">Summit:</span> ${SUMMIT_DATES} in ${SUMMIT_LOCATION}
      </p>

      ${sig.html}
    `,
  });

  return { subject, html, text };
}
