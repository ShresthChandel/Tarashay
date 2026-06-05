import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";

export const metadata: Metadata = {
  title: "Checkout — Tarashay",
  description: "Complete your purchase of Rewa Supari Art.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-off-white">
      <header className="border-b border-heritage-brown/10 bg-warm-beige py-12 text-center">
        <h1 className="font-serif text-3xl text-heritage-brown">Checkout</h1>
        <p className="mt-2 text-sm text-heritage-brown/60">
          Secure payment · Certificate of authenticity included
        </p>
      </header>
      <CheckoutFlow />
    </div>
  );
}
