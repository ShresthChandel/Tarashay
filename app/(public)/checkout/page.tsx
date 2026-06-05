import type { Metadata } from "next";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your purchase of Rewa Supari Art.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <ComingSoon
      title="Checkout"
      description="Secure checkout with Razorpay and Stripe — arriving in Phase 3."
    />
  );
}
