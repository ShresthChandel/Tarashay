import type { Metadata } from "next";
import { AdminArtisansPanel } from "@/components/admin/AdminArtisansPanel";

export const metadata: Metadata = {
  title: "Artisans — Admin",
  robots: { index: false, follow: false },
};

export default function AdminArtisansPage() {
  return <AdminArtisansPanel />;
}
