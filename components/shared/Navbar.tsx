"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "/story", label: "Story" },
  { href: "/artisans", label: "Artisans" },
  { href: "/shop", label: "Shop" },
  { href: "/commission", label: "Commission" },
  { href: "/impact", label: "Impact" },
  { href: "/learn", label: "Learn" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-heritage-brown/10 bg-warm-beige/90 backdrop-blur-md"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex flex-col">
          <span className="font-devanagari text-2xl font-semibold text-heritage-brown transition-colors group-hover:text-ochre sm:text-3xl">
            तराशय
          </span>
          <span className="font-sans text-xs tracking-widest text-heritage-brown/70 uppercase">
            Rewa Supari Art
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="font-sans text-sm tracking-wide text-heritage-brown/80 transition-colors hover:text-ochre"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open menu"
              className="text-heritage-brown"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="border-heritage-brown/10 bg-warm-beige"
          >
            <SheetHeader>
              <SheetTitle className="font-devanagari text-left text-heritage-brown">
                तराशय
              </SheetTitle>
            </SheetHeader>
            <ul className="mt-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-serif text-lg text-heritage-brown hover:text-ochre"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </SheetContent>
        </Sheet>
      </nav>
    </motion.header>
  );
}
