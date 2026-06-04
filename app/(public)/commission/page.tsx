import type { Metadata } from "next";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "Commission",
  description:
    "Commission a custom Ganesh idol, temple set, or ceremonial piece from the Kunder family.",
};

export default function CommissionPage() {
  return (
    <ComingSoon
      title="Commission a Piece"
      description="Custom commission form and status tracker — Phase 2."
    />
  );
}
