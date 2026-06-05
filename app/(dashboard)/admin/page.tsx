import type { Metadata } from "next";
import Link from "next/link";
import { getAdminOverview } from "@/lib/admin-stats";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Admin — Tarashay",
  robots: { index: false, follow: false },
};

export default async function AdminOverviewPage() {
  const { counts, recentCommissions, recentOrders } = await getAdminOverview();

  const statCards = [
    { label: "Products", count: counts.products, href: "/admin/products" },
    { label: "Orders", count: counts.orders, href: "/admin/orders" },
    { label: "Commissions", count: counts.commissions, href: "/admin/commissions" },
    { label: "Artisans", count: counts.artisans, href: "/admin/artisans" },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-heritage-brown">Overview</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="border-heritage-brown/10 p-6 transition-shadow hover:shadow-md">
              <p className="text-sm text-heritage-brown/60">{s.label}</p>
              <p className="mt-2 font-serif text-3xl text-ochre">{s.count}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-heritage-brown">
              Recent Commissions
            </h2>
            <Link href="/admin/commissions" className="text-sm text-ochre">
              View all →
            </Link>
          </div>
          <div className="mt-4 overflow-x-auto rounded-lg border border-heritage-brown/10">
            <table className="w-full text-sm">
              <thead className="bg-warm-beige/50">
                <tr>
                  <th className="px-4 py-2 text-left">Ref</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentCommissions.map((c) => (
                  <tr key={c.referenceNumber} className="border-t border-heritage-brown/5">
                    <td className="px-4 py-2 font-mono text-xs">{c.referenceNumber}</td>
                    <td className="px-4 py-2">{c.buyerContact?.name}</td>
                    <td className="px-4 py-2 capitalize">{c.status}</td>
                    <td className="px-4 py-2 text-heritage-brown/60">
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleDateString("en-IN")
                        : "—"}
                    </td>
                  </tr>
                ))}
                {recentCommissions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-heritage-brown/50">
                      No commissions yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-heritage-brown">
              Recent Orders
            </h2>
            <Link href="/admin/orders" className="text-sm text-ochre">
              View all →
            </Link>
          </div>
          <div className="mt-4 overflow-x-auto rounded-lg border border-heritage-brown/10">
            <table className="w-full text-sm">
              <thead className="bg-warm-beige/50">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Total</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={String(o._id)} className="border-t border-heritage-brown/5">
                    <td className="px-4 py-2 font-mono text-xs">
                      {String(o._id).slice(-8)}
                    </td>
                    <td className="px-4 py-2 capitalize">{o.orderStatus}</td>
                    <td className="px-4 py-2">₹{o.totalINR?.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-2 text-heritage-brown/60">
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleDateString("en-IN")
                        : "—"}
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-heritage-brown/50">
                      No orders yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
