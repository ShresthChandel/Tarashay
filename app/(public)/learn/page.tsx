import type { Metadata } from "next";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Documented history, craft process, glossary, and educator resources for Rewa Supari Art.",
};

export default function LearnPage() {
  return (
    <ComingSoon
      title="Learn & Preserve"
      description="Craft documentation, glossary, press, and educator downloads — Phase 2."
    />
  );
}
