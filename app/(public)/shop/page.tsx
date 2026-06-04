import type { Metadata } from "next";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "Collection",
  description:
    "One-of-a-kind areca nut sculptures from Rewa — Ganesh idols, temple sets, and ceremonial art.",
};

export default function ShopPage() {
  return (
    <ComingSoon
      title="The Collection"
      description="Browse handcrafted supari art with filters by artisan and category — Phase 2."
    />
  );
}
