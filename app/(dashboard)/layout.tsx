export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { UserRole } from "@/types";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="flex min-h-screen bg-off-white text-heritage-brown">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-6 pt-16 lg:pt-6 lg:p-10">
        {children}
      </main>
    </div>
  );
}
