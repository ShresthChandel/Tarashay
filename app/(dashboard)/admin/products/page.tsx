import type { Metadata } from "next";
import { AdminProductsPanel } from "@/components/admin/AdminProductsPanel";

export const metadata: Metadata = {
  title: "Products — Admin",
  robots: { index: false, follow: false },
};

export default function AdminProductsPage() {
  return <AdminProductsPanel />;
}
