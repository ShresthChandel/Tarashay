import type { Metadata } from "next";
import { AdminOrdersPanel } from "@/components/admin/AdminOrdersPanel";

export const metadata: Metadata = {
  title: "Orders — Admin",
  robots: { index: false, follow: false },
};

export default function AdminOrdersPage() {
  return <AdminOrdersPanel />;
}
