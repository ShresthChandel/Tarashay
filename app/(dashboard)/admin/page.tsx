import type { Metadata } from "next";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "Admin",
  description: "तराशय admin dashboard — manage artisans, products, orders, and commissions.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <ComingSoon
      title="Admin Dashboard"
      description="Protected CRUD for artisans, products, orders, and commissions — Phase 2 with NextAuth."
    />
  );
}
