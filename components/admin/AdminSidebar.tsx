"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Package,
  ScrollText,
  ShoppingBag,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/artisans", label: "Artisans", icon: Users },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/commissions", label: "Commissions", icon: ScrollText },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <>
      <p className="font-devanagari text-xl text-gold">तराशय</p>
      <p className="mt-1 text-xs tracking-widest text-warm-beige/60">ADMIN</p>
      <nav className="mt-10 space-y-1">
        {NAV.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-gold/20 text-gold"
                  : "text-warm-beige/80 hover:bg-heritage-brown/50 hover:text-warm-beige"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-auto flex items-center gap-2 px-3 py-2 text-sm text-warm-beige/60 hover:text-warm-beige"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </>
  );

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-50 rounded-md bg-heritage-brown p-2 text-warm-beige lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <aside className="hidden w-56 shrink-0 flex-col bg-heritage-brown p-6 lg:flex min-h-screen">
        {navContent}
      </aside>

      {mobileOpen && (
        <aside className="fixed inset-y-0 left-0 z-40 flex w-56 flex-col bg-heritage-brown p-6 lg:hidden">
          {navContent}
        </aside>
      )}
    </>
  );
}
