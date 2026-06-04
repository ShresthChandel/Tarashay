"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CommissionCTA() {
  return (
    <section className="bg-warm-beige py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl px-4 text-center sm:px-6"
      >
        <h2 className="font-serif text-3xl text-heritage-brown sm:text-4xl">
          Commission a Piece
        </h2>
        <p className="mt-6 font-sans text-base leading-relaxed text-heritage-brown/75">
          Ganesh idols for your home, temple sets for your community, or a walking
          stick in the tradition of Maharaja Martand Singh — work directly with
          the Kunder family to create something that will outlast us all.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-10 bg-heritage-brown text-warm-beige hover:bg-heritage-brown/90 font-sans"
        >
          <Link href="/commission">Begin a Commission</Link>
        </Button>
      </motion.div>
    </section>
  );
}
