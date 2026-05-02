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
 */
const BRAND = {
  cream: "#FFFAF1",
  creamSoft: "#FBF1E1",
  navy: "#0F1B3D",
  navyMuted: "rgba(15,27,61,0.7)",
  navyHairline: "rgba(15,27,61,0.1)",
  // Poster sunset palette: ember → flame → sunset → amber.
  red: "#C8341E",
  redTint: "rgba(200,52,30,0.08)",
  flame: "#FF5722",
  sunset: "#FF6B1A",
  sunsetTint: "rgba(255,107,26,0.10)",
  coral: "#FF8A3D",
  coralAccent: "#E54A0F",
  coralTint: "rgba(255,107,26,0.10)",
  amber: "#FFB347",
  gold: "#C99B4A",
  goldTint: "rgba(255,179,71,0.14)",
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
    <p style="margin:24px 0 2px;font-size:14px;color:${BRAND.navyMuted};">${salutation}</p>
    <p style="margin:0;font-size:14px;font-weight:700;color:${BRAND.navy};">${displayName}</p>
    ${
      subtitle
        ? `<p style="margin:2px 0 16px;font-size:13px;color:${BRAND.navyMuted};">${subtitle}</p>`
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
 * Link color is kept as Gmail's standard blue (#1a73e8) — using sunset
 * orange here would blend with regular text and hurt link affordance.
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

  return `
    <div style="background:#ffffff;padding:24px 28px;border-top:1px solid ${BRAND.navyHairline};">
      <p style="margin:0 0 4px;font-size:12px;color:${BRAND.navy};">
        <strong style="color:${BRAND.red};">${company}</strong> &nbsp;|&nbsp; ${parent}
      </p>
      <p style="margin:0 0 4px;font-size:12px;color:${BRAND.navy};">
        <strong>Web:</strong> <a href="${websiteUrl}" style="color:#1a73e8;text-decoration:none;">${websiteLabel}</a>
        &nbsp;|&nbsp; <strong>Email:</strong> <a href="mailto:${senderEmail}" style="color:#1a73e8;text-decoration:none;">${senderEmail}</a>
      </p>
      <p style="margin:0 0 4px;font-size:12px;color:${BRAND.navy};"><strong>Tel:</strong> ${phone}</p>
      <p style="margin:0 0 12px;font-size:12px;color:${BRAND.navy};">
        <strong>${company} Channels:</strong> <a href="${channelsUrl}" style="color:#1a73e8;text-decoration:none;">${channelsUrl}</a>
      </p>
      <p style="margin:0;font-size:11px;color:${BRAND.navyMuted};font-style:italic;">
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
  <body style="margin:0;padding:0;background:${BRAND.creamSoft};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${BRAND.navy};">
    <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">${opts.preheader}</span>
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${BRAND.creamSoft};padding:32px 16px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;background:${BRAND.cream};border-radius:16px;overflow:hidden;border:1px solid ${BRAND.navyHairline};">
            <tr>
              <td style="height:6px;background:${BRAND.gradient};line-height:6px;font-size:0;">&nbsp;</td>
            </tr>
            <tr>
              <td align="left" style="padding:32px 40px 0;">
                <img src="${logoUrl}" alt="${PROGRAM_NAME}" width="140" height="auto" style="display:block;border:0;outline:0;text-decoration:none;height:auto;width:140px;max-width:140px;">
                <p style="margin:16px 0 0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${BRAND.coralAccent};font-weight:700;">${PROGRAM_NAME}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 40px 40px;font-size:15px;line-height:1.6;color:${BRAND.navy};">
                ${opts.body}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 40px;background:${BRAND.creamSoft};border-top:1px solid ${BRAND.navyHairline};font-size:11px;letter-spacing:0.16em;text-transform:uppercase;font-weight:700;color:${BRAND.coralAccent};">
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
      <h1 style="margin:0 0 16px;font-size:24px;line-height:1.2;font-weight:700;color:${BRAND.navy};">Hi ${escapeHtml(args.applicantName)},</h1>
      <p style="margin:0 0 16px;">Your application is in. You're <strong>enrolled in the Gen SEA Bootcamp</strong> — selection for the Top 50 Delegates happens after the Capstone.</p>

      <h2 style="margin:32px 0 12px;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:${BRAND.coralAccent};">Two things to do now</h2>

      <ol style="margin:0 0 24px;padding-left:20px;">
        <li style="margin-bottom:12px;"><strong>Enroll in the Gen SEA Bootcamp.</strong><br><a href="${args.bootcampUrl}" style="color:${BRAND.red};font-weight:600;">Open enrollment link →</a></li>
        <li><strong>Join your Team Flow workspace.</strong><br><a href="${args.teamFlowUrl}" style="color:${BRAND.red};font-weight:600;">Open Team Flow →</a></li>
      </ol>

      <p style="margin:24px 0 16px;padding:16px;background:${BRAND.coralTint};border-left:4px solid ${BRAND.coral};border-radius:8px;">
        We've also emailed <strong>${escapeHtml(args.advisorEmail)}</strong> a private link for your recommendation letter. Your advisor has until <strong>${args.advisorLetterDeadline}</strong> to submit it.
      </p>

      <p style="margin:0 0 8px;">Save the dates: <strong>${SUMMIT_DATES}</strong> in ${SUMMIT_LOCATION}.</p>
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
      <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;font-weight:700;color:${BRAND.navy};">Dear ${escapeHtml(args.advisorName)},</h1>

      <p style="margin:0 0 16px;"><strong>${escapeHtml(args.applicantName)}</strong> has applied to ${PROGRAM_NAME} (Gen SEA Delegates 2026 — Top 50) and has named you as their academic referee.</p>

      <p style="margin:0 0 24px;">Could you submit a brief letter of recommendation through the secure link below? It takes about 5 minutes — you can paste plain text or upload a PDF.</p>

      <p style="margin:0 0 24px;text-align:center;">
        <a href="${args.uploadUrl}" style="display:inline-block;background:${BRAND.red};color:${BRAND.cream};padding:14px 28px;border-radius:9999px;font-weight:600;text-decoration:none;">Submit recommendation letter</a>
      </p>

      <p style="margin:0 0 16px;padding:16px;background:${BRAND.sunsetTint};border-left:4px solid ${BRAND.sunset};border-radius:8px;">
        <strong>Deadline:</strong> ${args.deadline}
      </p>

      <p style="margin:24px 0 0;font-size:13px;color:${BRAND.navyMuted};">If you weren't expecting this or don't recognise the applicant, please disregard this email — no action will be taken.</p>
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
      <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;font-weight:700;color:${BRAND.navy};">Dear ${escapeHtml(args.advisorName)},</h1>
      <p style="margin:0 0 16px;">Thank you for submitting a letter of recommendation for <strong>${escapeHtml(args.applicantName)}</strong>.</p>
      <p style="margin:0 0 16px;">Your letter has been received and shared with the program selection team. No further action is needed.</p>
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
      <h1 style="margin:0 0 16px;font-size:24px;line-height:1.2;font-weight:700;color:${BRAND.navy};">Hi ${escapeHtml(args.founderName)},</h1>
      <p style="margin:0 0 16px;">Thanks for applying with <strong>${escapeHtml(args.ventureName)}</strong>. You're <strong>enrolled in the Gen SEA Bootcamp</strong> — the Top 33 cohort is announced <strong>2 June 2026</strong>.</p>

      <h2 style="margin:32px 0 12px;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:${BRAND.red};">Two things to do now</h2>

      <ol style="margin:0 0 24px;padding-left:20px;">
        <li style="margin-bottom:12px;"><strong>Enroll in the Gen SEA Bootcamp.</strong><br><a href="${args.bootcampUrl}" style="color:${BRAND.red};font-weight:600;">Open enrollment link →</a></li>
        <li><strong>Join your Team Flow workspace.</strong><br><a href="${args.teamFlowUrl}" style="color:${BRAND.red};font-weight:600;">Open Team Flow →</a></li>
      </ol>

      <p style="margin:24px 0 0;padding:16px;background:${BRAND.redTint};border-left:4px solid ${BRAND.red};border-radius:8px;">
        <strong>Save the dates:</strong><br>
        Pre-summit prep: 9–13 June 2026 (online)<br>
        Summit: ${SUMMIT_DATES} in ${SUMMIT_LOCATION}
      </p>

      ${sig.html}
    `,
  });

  return { subject, html, text };
}
