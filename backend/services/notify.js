/**
 * ============================================================
 *  Notification service — fires on every lead / meeting /
 *  application / handoff:
 *    1. Outgoing webhook (Slack / Zapier / Make)
 *    2. CRM webhook (HubSpot / Zoho via passthrough)
 *    3. Email via SMTP (optional, nodemailer)
 *    4. Customer confirmation email
 *  All failures are logged, never thrown (fire-and-forget).
 * ============================================================
 */
const db = require("../config/database");

let transporter = null;
async function getTransporter() {
  if (transporter !== null) return transporter;
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    transporter = false;
    console.error("[notify] transporter disabled: SMTP_HOST or SMTP_USER not set");
    return transporter;
  }
  try {
    const nodemailer = require("nodemailer");
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    // Safe SMTP diagnostic: verify connection & auth without sending mail.
    // verify() failure is logged but does NOT prevent caching the transporter —
    // sendMail may still succeed even when verify() reports a transient issue.
    try {
      await transporter.verify();
      console.log("[notify] transporter verified — SMTP connection and authentication OK");
    } catch (verifyErr) {
      const safe = {
        code: verifyErr.code,
        command: verifyErr.command,
        response: verifyErr.response,
        responseCode: verifyErr.responseCode,
        message: verifyErr.message,
      };
      console.error("[notify] transporter verify warning (sendMail will still be attempted):", JSON.stringify(safe));
    }
    return transporter;
  } catch (e) {
    const safe = {
      code: e.code,
      command: e.command,
      response: e.response,
      responseCode: e.responseCode,
      message: e.message,
    };
    console.error("[notify] mailer init failed:", JSON.stringify(safe));
    transporter = false;
  }
  return transporter;
}

async function postJson(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`webhook responded ${res.status}`);
  return res;
}

function humanSummary(type, payload) {
  const rows = Object.entries(payload)
    .filter(([k]) => !["lang", "sessionId", "page", "ip", "userAgent", "referrer", "leadSource", "isUpdate"].includes(k))
    .map(([k, v]) => `${k}: ${v}`);
  return `🔔 New ${type}${payload.isUpdate ? " (Updated)" : ""}\n${rows.join("\n")}`;
}

/**
 * notifyAdmin("lead", { ...payload })
 * Never throws — safe to call without await.
 */
async function notifyAdmin(type, payload) {
  const settings = db.read("settings");
  const title = type.charAt(0).toUpperCase() + type.slice(1);
  const summary = humanSummary(type, payload);

  // 1. generic webhook
  const webhookUrl = settings.webhookUrl || process.env.WEBHOOK_URL;
  if (webhookUrl) {
    postJson(webhookUrl, { type, title, payload, source: "bluconnet-ai-assistant", at: new Date().toISOString() })
      .catch((e) => console.error("[notify] webhook:", e.message));
  }

  // 2. CRM webhook
  const crmUrl = settings.crmWebhookUrl || process.env.CRM_WEBHOOK_URL;
  if (crmUrl) {
    postJson(crmUrl, { type, ...payload })
      .catch((e) => console.error("[notify] crm:", e.message));
  }

  // 3. email
  const to = process.env.NOTIFY_EMAIL;
  if (settings.emailNotify !== false && to) {
    const tx = await getTransporter();
    if (tx) {
      tx.sendMail({
        from: `"BluConnet AI Assistant" <${process.env.SMTP_USER}>`,
        to,
        subject: `[AI Assistant] New ${title} — ${payload.name || payload.email || "visitor"}${payload.isUpdate ? " (Updated)" : ""}`,
        text: summary,
      }).catch((e) => {
    const safe = {
      code: e.code,
      command: e.command,
      response: e.response,
      responseCode: e.responseCode,
      message: e.message,
    };
    console.error("[notify] email:", JSON.stringify(safe));
  });
    }
  }
}

/**
 * Send confirmation email to customer after lead/meeting submission.
 * Never throws — safe to call without await.
 */
async function sendCustomerConfirmation(type, payload) {
  const tx = await getTransporter();
  if (!tx || !payload.email) return;

  const title = type.charAt(0).toUpperCase() + type.slice(1);
  let subject = "";
  let text = "";

  if (type === "lead") {
    subject = "Thank you for your interest in BluConnet Media!";
    text = `Hi ${payload.name || "there"},\n\nThank you for reaching out to BluConnet Media!\n\nWe've received your inquiry and our team will review it shortly. Here's a summary of what you shared:\n\n${humanSummary(type, payload)}\n\nOur team will contact you within 24 hours at ${payload.email}.\n\nIf you have any urgent questions, feel free to reply to this email or call us at +91 98765 43210.\n\nBest regards,\nBluConnet Media Team\nwww.bluconnetmedia.com`;
  } else if (type === "meeting") {
    subject = "Your meeting request has been received!";
    text = `Hi ${payload.name || "there"},\n\nThank you for booking a meeting with BluConnet Media!\n\nWe've received your meeting request:\n\n${humanSummary(type, payload)}\n\nOur team will confirm the meeting details and send you a calendar invite at ${payload.email} within 24 hours.\n\nIf you need to reschedule, simply reply to this email.\n\nBest regards,\nBluConnet Media Team\nwww.bluconnetmedia.com`;
  } else {
    return; // No confirmation for other types
  }

  tx.sendMail({
    from: `"BluConnet Media" <${process.env.SMTP_USER}>`,
    to: payload.email,
    subject,
    text,
  }).catch((e) => console.error("[notify] customer confirmation:", e.message));
}

/* ---------------------------------------------------------------
 *  sendFormNotification(formType, payload)
 *  Professional HTML email to NOTIFY_EMAIL after a successful
 *  public form submission (contact / newsletter).
 *  Fire-and-forget: never throws, never blocks the DB response.
 * --------------------------------------------------------------- */
function labelize(key) {
  return String(key)
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

function escapeHtml(text) {
  if (text === null || text === undefined) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const SKIP_FIELDS = new Set([
  "id", "submittedAt", "lang", "sessionId", "page", "ip", "userAgent",
  "referrer", "leadSource", "isUpdate", "recaptchaToken", "website",
]);

function buildFormHtml(formType, payload) {
  const rows = Object.entries(payload)
    .filter(([k]) => !SKIP_FIELDS.has(k))
    .map(([k, v]) => {
      let value = v;
      if (typeof value === "boolean") value = value ? "Yes" : "No";
      if (value === null || value === undefined) value = "—";
      return `<tr>
        <td style="padding: 8px 12px; font-weight: bold; color: #333; border-bottom: 1px solid #eee; width: 34%;">${escapeHtml(labelize(k))}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #555;">${escapeHtml(value)}</td>
      </tr>`;
    })
    .join("");

  const title = formType.charAt(0).toUpperCase() + formType.slice(1);
  const submittedAt = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New ${title} Submission</title>
</head>
<body style="margin: 0; padding: 0; background: #f4f6f8; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; margin: 24px auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
    <tr>
      <td align="center" style="background: linear-gradient(90deg, #10b981, #06b6d4); padding: 24px; color: #ffffff;">
        <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">BluConnet Media</h1>
        <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.92; font-weight: 600;">New ${title} Form Submission</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 22px 26px; font-size: 14px; color: #1f2933; line-height: 1.6;">
        <p style="margin: 0 0 16px; font-size: 14px;">A new ${title} submission has been received and saved to the database.</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 9px 12px; font-weight: 700; color: #374151; border-bottom: 1px solid #eef2f5; width: 34%;">Form Type</td>
            <td style="padding: 9px 12px; color: #059669; font-weight: 700; border-bottom: 1px solid #eef2f5;">${escapeHtml(title)}</td>
          </tr>
          <tr>
            <td style="padding: 9px 12px; font-weight: 700; color: #374151; border-bottom: 1px solid #eef2f5;">Submitted At</td>
            <td style="padding: 9px 12px; color: #555; border-bottom: 1px solid #eef2f5;">${escapeHtml(submittedAt)}</td>
          </tr>
          ${rows}
        </table>
        <p style="margin: 20px 0 0; font-size: 13px; color: #6b7280;">This is an automated notification from BluConnet Media. Please do not reply to this email.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function sendFormNotification(formType, payload) {
  const to = process.env.NOTIFY_EMAIL;
  console.log(`[notify] sendFormNotification(${formType}) called — to=${to || "(none)"}`);
  if (!to) return;

  const tx = await getTransporter();
  if (!tx) {
    console.error(`[notify] sendFormNotification(${formType}) — transporter unavailable`);
    return;
  }

  const title = formType.charAt(0).toUpperCase() + formType.slice(1);
  const nameOrEmail = payload.name || payload.email || "visitor";

  tx.sendMail({
    from: `"BluConnet Media" <${process.env.SMTP_USER}>`,
    to,
    subject: `[BluConnet Media] New ${title} submission — ${nameOrEmail}`,
    html: buildFormHtml(formType, payload),
  }).then((info) => {
    console.log(`[notify] form email (${formType}) sent — messageId=${info.messageId}, accepted=${JSON.stringify(info.accepted)}, rejected=${JSON.stringify(info.rejected)}`);
  }).catch((e) => {
    const safe = {
      code: e.code,
      command: e.command,
      response: e.response,
      responseCode: e.responseCode,
      message: e.message,
    };
    console.error(`[notify] form email (${formType}) failed:`, JSON.stringify(safe));
  });
}

module.exports = { notifyAdmin, sendCustomerConfirmation, sendFormNotification };

