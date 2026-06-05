import type { Metadata } from "next";
import { AdminCommissionsPanel } from "@/components/admin/AdminCommissionsPanel";

export const metadata: Metadata = {
  title: "Commissions — Admin",
  robots: { index: false, follow: false },
};

export default function AdminCommissionsPage() {
  return <AdminCommissionsPanel />;
}
