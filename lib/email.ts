import { Resend } from "resend";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "hello@tarashay.com";
const SITE_NAME = "तराशय";

function getResendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function heritageWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#FAF7F2;font-family:Georgia,serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <p style="font-size:28px;color:#3D2B1F;margin:0 0 8px;">${SITE_NAME}</p>
    <p style="font-size:12px;color:#C8860A;letter-spacing:2px;margin:0 0 32px;">REWA SUPARI ART</p>
    ${content}
    <p style="margin-top:40px;font-size:12px;color:#3D2B1F99;">Questions? hello@tarashay.com</p>
  </div>
</body>
</html>`;
}

export async function sendCommissionConfirmationEmail(params: {
  to: string;
  name: string;
  referenceNumber: string;
  description: string;
}): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) {
    console.warn("Resend not configured — skipping commission confirmation email");
    return false;
  }

  const content = `
    <h1 style="font-size:22px;color:#3D2B1F;font-weight:normal;">Thank you, ${params.name}.</h1>
    <p style="color:#3D2B1F;line-height:1.6;">We have received your commission request and our artisans will honour your vision with the care this craft demands.</p>
    <div style="background:#F5ECD7;border:1px solid #D4A017;padding:20px;margin:24px 0;text-align:center;">
      <p style="margin:0;font-size:12px;color:#C8860A;letter-spacing:1px;">YOUR REFERENCE</p>
      <p style="margin:8px 0 0;font-size:24px;color:#3D2B1F;font-weight:bold;">${params.referenceNumber}</p>
    </div>
    <p style="color:#3D2B1F;line-height:1.6;"><strong>Your vision:</strong><br/>${params.description.slice(0, 300)}${params.description.length > 300 ? "…" : ""}</p>
    <p style="color:#3D2B1F;line-height:1.6;">Our artisans will review your request and respond within <strong>48 hours</strong>.</p>
    <h2 style="font-size:14px;color:#C8860A;letter-spacing:1px;margin-top:32px;">WHAT HAPPENS NEXT</h2>
    <ol style="color:#3D2B1F;line-height:1.8;padding-left:20px;">
      <li>We consult the right Kunder family artisan for your piece</li>
      <li>You receive a quote and timeline within 48 hours</li>
      <li>Upon approval, creation begins — with progress updates along the way</li>
    </ol>
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: `Your Tarashay Commission Request — ${params.referenceNumber}`,
      html: heritageWrapper(content),
    });
    return true;
  } catch (err) {
    console.error("Failed to send commission confirmation:", err);
    return false;
  }
}

export async function sendCommissionProgressEmail(params: {
  to: string;
  name: string;
  referenceNumber: string;
  status: string;
  note: string;
  photo?: string;
}): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) {
    console.warn("Resend not configured — skipping progress email");
    return false;
  }

  const photoBlock = params.photo
    ? `<img src="${params.photo}" alt="Progress update" style="max-width:100%;margin-top:16px;border-radius:4px;" />`
    : "";

  const content = `
    <h1 style="font-size:22px;color:#3D2B1F;font-weight:normal;">Update on your commission</h1>
    <p style="color:#3D2B1F;">Dear ${params.name}, your piece <strong>${params.referenceNumber}</strong> has a new update.</p>
    <div style="background:#F5ECD7;padding:16px;margin:20px 0;">
      <p style="margin:0;font-size:12px;color:#C8860A;">STATUS</p>
      <p style="margin:4px 0 0;color:#3D2B1F;text-transform:capitalize;">${params.status.replace(/-/g, " ")}</p>
    </div>
    <p style="color:#3D2B1F;line-height:1.6;">${params.note}</p>
    ${photoBlock}
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: `Update on your Tarashay commission ${params.referenceNumber}`,
      html: heritageWrapper(content),
    });
    return true;
  } catch (err) {
    console.error("Failed to send progress email:", err);
    return false;
  }
}

export async function sendOrderConfirmationEmail(params: {
  to: string;
  name: string;
  orderId: string;
  totalINR: number;
}): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) return false;

  const content = `
    <h1 style="font-size:22px;color:#3D2B1F;">Thank you for preserving a piece of history</h1>
    <p style="color:#3D2B1F;">Dear ${params.name}, your order <strong>${params.orderId}</strong> is confirmed.</p>
    <p style="color:#3D2B1F;font-size:20px;">Total: ₹${params.totalINR.toLocaleString("en-IN")}</p>
    <p style="color:#3D2B1F;line-height:1.6;">Your Rewa Supari Art piece will ship from Madhya Pradesh with a signed certificate of authenticity.</p>
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: `Order Confirmed — तराशय ${params.orderId.slice(-8)}`,
      html: heritageWrapper(content),
    });
    return true;
  } catch (err) {
    console.error("Failed to send order confirmation:", err);
    return false;
  }
}
