"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { IArtisan } from "@/types";

interface ArtisanCommissionCTAProps {
  artisan: IArtisan;
}

export function ArtisanCommissionCTA({ artisan }: ArtisanCommissionCTAProps) {
  return (
    <section className="bg-warm-beige py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl px-4 text-center sm:px-6"
      >
        <h2 className="font-serif text-3xl text-heritage-brown">
          Work with {artisan.name}
        </h2>
        <p className="mt-4 font-sans text-heritage-brown/75">
          Commission a custom Ganesh idol, temple set, or ceremonial piece —
          shaped in the tradition of the Rewa royal court.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-8 bg-heritage-brown text-warm-beige hover:bg-heritage-brown/90"
        >
          <Link href={`/commission?artisan=${artisan.slug}`}>
            Commission a Custom Piece
          </Link>
        </Button>
      </motion.div>
    </section>
  );
}
