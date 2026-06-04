/**
 * Stripe config — international payments (Phase 2).
 */

export function getStripeConfig() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Stripe secret key missing: STRIPE_SECRET_KEY");
  }

  return { secretKey };
}
