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
 * If EMAIL_SIGNATURE_NAME is set, renders a personal signature card
 * (name + title + org, optional photo + LinkedIn). Otherwise falls back
 * to the generic "— The Gen SEA Summit team" line.
 *
 * Configured entirely via env vars — see .env.example.
 */
function signOff(): { html: string; text: string } {
  const name = process.env.EMAIL_SIGNATURE_NAME?.trim();
  const title = process.env.EMAIL_SIGNATURE_TITLE?.trim();
  const org = process.env.EMAIL_SIGNATURE_ORG?.trim();
  const photoUrl = process.env.EMAIL_SIGNATURE_PHOTO_URL?.trim();
  const linkedinUrl = process.env.EMAIL_SIGNATURE_LINKEDIN?.trim();

  if (!name) {
    return {
      html: `<p style="margin:24px 0 0;color:${BRAND.navyMuted};">— The Gen SEA Summit team</p>`,
      text: `— The Gen SEA Summit team`,
    };
  }

  const subtitle = [title, org].filter(Boolean).join(" · ");
  const subtitleText = [title, org].filter(Boolean).join(", ");
  const linkedinLabel = linkedinUrl?.replace(/^https?:\/\//, "");

  // Plain-text version
  const textLines = [`— ${name}`];
  if (subtitleText) textLines.push(subtitleText);
  if (linkedinUrl) textLines.push(linkedinUrl);
  const text = textLines.join("\n");

  // HTML version — table layout for max email-client compatibility
  const html = `
    <table cellpadding="0" cellspacing="0" role="presentation" style="margin-top:32px;border-top:1px solid ${BRAND.navyHairline};padding-top:20px;">
      <tr>
        ${
          photoUrl
            ? `<td style="vertical-align:top;padding-right:16px;width:64px;">
                <img src="${photoUrl}" alt="${name}" width="56" height="56" style="border-radius:50%;display:block;border:0;outline:0;">
              </td>`
            : ""
        }
        <td style="vertical-align:top;font-size:14px;line-height:1.5;">
          <strong style="color:${BRAND.navy};font-size:15px;">${name}</strong>
          ${
            subtitle
              ? `<br><span style="color:${BRAND.navyMuted};">${subtitle}</span>`
              : ""
          }
          ${
            linkedinUrl
              ? `<br><a href="${linkedinUrl}" style="color:${BRAND.coralAccent};text-decoration:none;">${linkedinLabel}</a>`
              : ""
          }
        </td>
      </tr>
    </table>
  `.trim();

  return { html, text };
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
              <td style="padding:24px 40px;background:${BRAND.creamSoft};border-top:1px solid ${BRAND.navyHairline};font-size:12px;color:${BRAND.navyMuted};">
                ${PROGRAM_NAME} · ${SUMMIT_DATES} · ${SUMMIT_LOCATION}<br>
                If you didn't expect this email, just ignore it — no action needed.
              </td>
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
      <h1 style="margin:0 0 16px;font-size:24px;line-height:1.2;font-weight:700;color:${BRAND.navy};">Hi ${args.applicantName},</h1>
      <p style="margin:0 0 16px;">Your application is in. You're <strong>enrolled in the Gen SEA Bootcamp</strong> — selection for the Top 50 Delegates happens after the Capstone.</p>

      <h2 style="margin:32px 0 12px;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:${BRAND.coralAccent};">Two things to do now</h2>

      <ol style="margin:0 0 24px;padding-left:20px;">
        <li style="margin-bottom:12px;"><strong>Enroll in the Gen SEA Bootcamp.</strong><br><a href="${args.bootcampUrl}" style="color:${BRAND.red};font-weight:600;">Open enrollment link →</a></li>
        <li><strong>Join your Team Flow workspace.</strong><br><a href="${args.teamFlowUrl}" style="color:${BRAND.red};font-weight:600;">Open Team Flow →</a></li>
      </ol>

      <p style="margin:24px 0 16px;padding:16px;background:${BRAND.coralTint};border-left:4px solid ${BRAND.coral};border-radius:8px;">
        We've also emailed <strong>${args.advisorEmail}</strong> a private link for your recommendation letter. Your advisor has until <strong>${args.advisorLetterDeadline}</strong> to submit it.
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
    preheader: `${args.applicantName} has named you as their referee. Please submit a letter by ${args.deadline}.`,
    body: `
      <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;font-weight:700;color:${BRAND.navy};">Dear ${args.advisorName},</h1>

      <p style="margin:0 0 16px;"><strong>${args.applicantName}</strong> has applied to ${PROGRAM_NAME} (Gen SEA Delegates 2026 — Top 50) and has named you as their academic referee.</p>

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
      <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;font-weight:700;color:${BRAND.navy};">Dear ${args.advisorName},</h1>
      <p style="margin:0 0 16px;">Thank you for submitting a letter of recommendation for <strong>${args.applicantName}</strong>.</p>
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
      <h1 style="margin:0 0 16px;font-size:24px;line-height:1.2;font-weight:700;color:${BRAND.navy};">Hi ${args.founderName},</h1>
      <p style="margin:0 0 16px;">Thanks for applying with <strong>${args.ventureName}</strong>. You're <strong>enrolled in the Gen SEA Bootcamp</strong> — the Top 33 cohort is announced <strong>2 June 2026</strong>.</p>

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
