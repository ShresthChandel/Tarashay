/**
 * Resend email config — order and commission notifications (Phase 2).
 */

export function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("Resend API key missing: RESEND_API_KEY");
  }

  return { apiKey };
}
