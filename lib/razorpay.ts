/**
 * Razorpay config — payments for Indian buyers (Phase 2).
 */

export function getRazorpayConfig() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay credentials missing: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET"
    );
  }

  return { keyId, keySecret };
}
