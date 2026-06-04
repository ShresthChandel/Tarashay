import type { Metadata } from "next";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "Artwork",
  description: "Individual Rewa Supari Art piece — story, process, and acquisition.",
};

export default function ProductPage() {
  return (
    <ComingSoon
      title="Artwork Detail"
      description="Full galleries, creation process, and purchase — Phase 2."
    />
  );
}
