/**
 * Tiny transactional-email client using Resend's REST API directly.
 * No SDK install needed — just `fetch`. Swap providers by replacing this file.
 *
 * Required env vars (see .env.example):
 *   RESEND_API_KEY
 *   EMAIL_FROM
 *   EMAIL_REPLY_TO
 */

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
  /** Optional override; falls back to EMAIL_REPLY_TO env var. */
  replyTo?: string;
  /** Optional tag — useful for filtering inside Resend's dashboard. */
  tag?: string;
};

export type SendEmailResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const replyTo = (input.replyTo ?? process.env.EMAIL_REPLY_TO ?? "").trim();

  // Fail soft in dev/preview if env vars aren't set yet — log to console so the
  // form submission still succeeds. Production should always have these set.
  if (!apiKey || !from) {
    console.warn(
      "[email] RESEND_API_KEY or EMAIL_FROM not configured — skipping send.",
      { to: input.to, subject: input.subject },
    );
    return { ok: false, error: "Email provider not configured" };
  }

  if (!replyTo) {
    console.warn(
      "[email] EMAIL_REPLY_TO not set — recipient replies will go to the From " +
        "address. Set EMAIL_REPLY_TO in your env to direct replies elsewhere.",
    );
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: input.subject,
        html: input.html,
        text: input.text,
        // Resend's REST API accepts `reply_to` as string | string[]. Always
        // send as array so it stays consistent if we ever add multiple replies.
        // Omit the field entirely (don't send empty) so Resend doesn't reject.
        ...(replyTo ? { reply_to: [replyTo] } : {}),
        tags: input.tag ? [{ name: "category", value: input.tag }] : undefined,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[email] Resend rejected:", res.status, detail);
      return { ok: false, error: `Resend ${res.status}: ${detail}` };
    }

    const body = (await res.json()) as { id: string };
    console.log("[email] sent", {
      id: body.id,
      to: input.to,
      from,
      replyTo: replyTo || "(none — replies will go to From)",
      subject: input.subject,
    });
    return { ok: true, id: body.id };
  } catch (err) {
    console.error("[email] Network error sending mail:", err);
    return { ok: false, error: String(err) };
  }
}
