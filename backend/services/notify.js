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
function getTransporter() {
  if (transporter !== null) return transporter;
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    transporter = false;
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
  } catch (e) {
    console.error("[notify] mailer init failed:", e.message);
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
    const tx = getTransporter();
    if (tx) {
      tx.sendMail({
        from: `"BluConnet AI Assistant" <${process.env.SMTP_USER}>`,
        to,
        subject: `[AI Assistant] New ${title} — ${payload.name || payload.email || "visitor"}${payload.isUpdate ? " (Updated)" : ""}`,
        text: summary,
      }).catch((e) => console.error("[notify] email:", e.message));
    }
  }
}

/**
 * Send confirmation email to customer after lead/meeting submission.
 * Never throws — safe to call without await.
 */
async function sendCustomerConfirmation(type, payload) {
  const tx = getTransporter();
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

module.exports = { notifyAdmin, sendCustomerConfirmation };
