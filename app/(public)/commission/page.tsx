import type { Metadata } from "next";
import { Suspense } from "react";
import { CommissionTimeline } from "@/components/commission/CommissionTimeline";
import { CommissionForm } from "@/components/commission/CommissionForm";
import { CommissionTracker } from "@/components/commission/CommissionTracker";

export const metadata: Metadata = {
  title: "Commission a Piece — Tarashay",
  description:
    "Work directly with a Kunder family artisan to create a one-of-a-kind Supari Art piece, made to your vision.",
};

export default function CommissionPage() {
  return (
    <div className="bg-off-white">
      <header className="bg-warm-beige py-20 text-center">
        <p className="font-devanagari text-lg text-ochre">आदेश</p>
        <h1 className="mt-4 font-serif text-4xl text-heritage-brown sm:text-5xl">
          Commission a Piece
        </h1>
        <p className="mx-auto mt-6 max-w-2xl px-4 font-sans text-heritage-brown/70">
          Work directly with a Kunder family artisan. Describe your vision — they
          will bring it to life in supari.
        </p>
      </header>

      <CommissionTimeline />

      <section className="py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="text-center font-serif text-2xl text-heritage-brown">
            Share Your Vision
          </h2>
          <p className="mt-2 text-center text-sm text-heritage-brown/60">
            Our artisans respond within 48 hours.
          </p>
          <div className="mt-10">
            <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-warm-beige" />}>
              <CommissionForm />
            </Suspense>
          </div>
        </div>
      </section>

      <div id="track">
        <CommissionTracker />
      </div>
    </div>
  );
}
