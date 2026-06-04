import type { Metadata } from "next";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "Impact",
  description:
    "See how your support preserves Rewa Supari Art and sustains the Kunder family artisans.",
};

export default function ImpactPage() {
  return (
    <ComingSoon
      title="Our Impact"
      description="Live metrics, world map, and training program — Phase 2."
    />
  );
}
