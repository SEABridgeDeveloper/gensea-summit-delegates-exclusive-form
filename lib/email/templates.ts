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

// Wrap a body in the same shell across all messages — keeps branding consistent.
function shell(opts: { preheader: string; body: string }): string {
  // The preheader is the snippet shown in inbox previews. Hidden in the body.
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#FBF1E1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0F1B3D;">
    <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">${opts.preheader}</span>
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#FBF1E1;padding:32px 16px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;background:#FFFAF1;border-radius:16px;overflow:hidden;border:1px solid rgba(15,27,61,0.1);">
            <tr>
              <td style="padding:32px 40px 0;">
                <p style="margin:0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#D9603C;font-weight:700;">${PROGRAM_NAME}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 40px 40px;font-size:15px;line-height:1.6;color:#0F1B3D;">
                ${opts.body}
              </td>
            </tr>
            <tr>
              <td style="padding:24px 40px;background:#FBF1E1;border-top:1px solid rgba(15,27,61,0.1);font-size:12px;color:rgba(15,27,61,0.7);">
                ${PROGRAM_NAME} · ${SUMMIT_DATES} · ${SUMMIT_LOCATION}<br>
                If you didn't expect this email, just ignore it — no action needed.
              </td>
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

  const text = `Hi ${args.applicantName},

Your application for ${PROGRAM_NAME} (Individual / Delegates 2026) is in. You're enrolled in the Gen SEA Bootcamp — selection for the Top 50 happens after the Capstone.

Two things to do now:

1. Enroll in the Gen SEA Bootcamp (GVP)
   ${args.bootcampUrl}

2. Join your Team Flow workspace
   ${args.teamFlowUrl}

We've also emailed your advisor (${args.advisorEmail}) a private link to upload their recommendation letter. They have until ${args.advisorLetterDeadline} to submit it.

Save the dates: ${SUMMIT_DATES} in ${SUMMIT_LOCATION}.

— The Gen SEA Summit team`;

  const html = shell({
    preheader: "Your bootcamp access is inside.",
    body: `
      <h1 style="margin:0 0 16px;font-size:24px;line-height:1.2;font-weight:700;color:#0F1B3D;">Hi ${args.applicantName},</h1>
      <p style="margin:0 0 16px;">Your application is in. You're <strong>enrolled in the Gen SEA Bootcamp</strong> — selection for the Top 50 Delegates happens after the Capstone.</p>

      <h2 style="margin:32px 0 12px;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:#D9603C;">Two things to do now</h2>

      <ol style="margin:0 0 24px;padding-left:20px;">
        <li style="margin-bottom:12px;"><strong>Enroll in the Gen SEA Bootcamp.</strong><br><a href="${args.bootcampUrl}" style="color:#C8341E;font-weight:600;">Open enrollment link →</a></li>
        <li><strong>Join your Team Flow workspace.</strong><br><a href="${args.teamFlowUrl}" style="color:#C8341E;font-weight:600;">Open Team Flow →</a></li>
      </ol>

      <p style="margin:24px 0 16px;padding:16px;background:rgba(236,122,87,0.1);border-left:4px solid #EC7A57;border-radius:8px;">
        We've also emailed <strong>${args.advisorEmail}</strong> a private link for your recommendation letter. Your advisor has until <strong>${args.advisorLetterDeadline}</strong> to submit it.
      </p>

      <p style="margin:0 0 8px;">Save the dates: <strong>${SUMMIT_DATES}</strong> in ${SUMMIT_LOCATION}.</p>
      <p style="margin:24px 0 0;color:rgba(15,27,61,0.7);">— The Gen SEA Summit team</p>
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

  const text = `Dear ${args.advisorName},

${args.applicantName} has applied to ${PROGRAM_NAME} (Gen SEA Delegates 2026 — Top 50) and has named you as their academic referee.

Could you submit a brief letter of recommendation through the secure link below? It takes about 5 minutes — you can paste plain text or upload a PDF.

  ${args.uploadUrl}

Deadline: ${args.deadline}

If you weren't expecting this or don't recognise the applicant, please disregard this email — no action will be taken.

Thank you,
The Gen SEA Summit team`;

  const html = shell({
    preheader: `${args.applicantName} has named you as their referee. Please submit a letter by ${args.deadline}.`,
    body: `
      <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;font-weight:700;color:#0F1B3D;">Dear ${args.advisorName},</h1>

      <p style="margin:0 0 16px;"><strong>${args.applicantName}</strong> has applied to ${PROGRAM_NAME} (Gen SEA Delegates 2026 — Top 50) and has named you as their academic referee.</p>

      <p style="margin:0 0 24px;">Could you submit a brief letter of recommendation through the secure link below? It takes about 5 minutes — you can paste plain text or upload a PDF.</p>

      <p style="margin:0 0 24px;text-align:center;">
        <a href="${args.uploadUrl}" style="display:inline-block;background:#C8341E;color:#FFFAF1;padding:14px 28px;border-radius:9999px;font-weight:600;text-decoration:none;">Submit recommendation letter</a>
      </p>

      <p style="margin:0 0 16px;padding:16px;background:rgba(201,155,74,0.1);border-left:4px solid #C99B4A;border-radius:8px;">
        <strong>Deadline:</strong> ${args.deadline}
      </p>

      <p style="margin:24px 0 0;font-size:13px;color:rgba(15,27,61,0.7);">If you weren't expecting this or don't recognise the applicant, please disregard this email — no action will be taken.</p>
      <p style="margin:8px 0 0;color:rgba(15,27,61,0.7);">— The Gen SEA Summit team</p>
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

  const text = `Hi ${args.founderName},

Thanks for applying with ${args.ventureName} to ${PROGRAM_NAME} (Gen SEA Ventures 33). You're enrolled in the Gen SEA Bootcamp — the Top 33 cohort is announced 2 June 2026.

Two things to do now:

1. Enroll in the Gen SEA Bootcamp (GVP)
   ${args.bootcampUrl}

2. Join your Team Flow workspace
   ${args.teamFlowUrl}

Pre-summit prep: 9–13 June 2026 (online).
Summit: ${SUMMIT_DATES} in ${SUMMIT_LOCATION}.

— The Gen SEA Summit team`;

  const html = shell({
    preheader: "Your bootcamp access for Gen SEA Ventures 33.",
    body: `
      <h1 style="margin:0 0 16px;font-size:24px;line-height:1.2;font-weight:700;color:#0F1B3D;">Hi ${args.founderName},</h1>
      <p style="margin:0 0 16px;">Thanks for applying with <strong>${args.ventureName}</strong>. You're <strong>enrolled in the Gen SEA Bootcamp</strong> — the Top 33 cohort is announced <strong>2 June 2026</strong>.</p>

      <h2 style="margin:32px 0 12px;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:#C8341E;">Two things to do now</h2>

      <ol style="margin:0 0 24px;padding-left:20px;">
        <li style="margin-bottom:12px;"><strong>Enroll in the Gen SEA Bootcamp.</strong><br><a href="${args.bootcampUrl}" style="color:#C8341E;font-weight:600;">Open enrollment link →</a></li>
        <li><strong>Join your Team Flow workspace.</strong><br><a href="${args.teamFlowUrl}" style="color:#C8341E;font-weight:600;">Open Team Flow →</a></li>
      </ol>

      <p style="margin:24px 0 0;padding:16px;background:rgba(200,52,30,0.08);border-left:4px solid #C8341E;border-radius:8px;">
        <strong>Save the dates:</strong><br>
        Pre-summit prep: 9–13 June 2026 (online)<br>
        Summit: ${SUMMIT_DATES} in ${SUMMIT_LOCATION}
      </p>

      <p style="margin:24px 0 0;color:rgba(15,27,61,0.7);">— The Gen SEA Summit team</p>
    `,
  });

  return { subject, html, text };
}
