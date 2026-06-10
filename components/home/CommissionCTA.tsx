"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HOME_IMAGES } from "@/lib/media/home";

export function CommissionCTA() {
  return (
    <section className="relative overflow-hidden py-24">
      <Image
        src={HOME_IMAGES.commissionGreen.src}
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
        quality={85}
        aria-hidden
      />
      <div className="absolute inset-0 bg-heritage-brown/75" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6"
      >
        <p className="section-eyebrow text-gold">आदेश</p>
        <h2 className="mt-3 font-serif text-3xl text-warm-beige sm:text-4xl">
          Commission a Piece
        </h2>
        <p className="mt-6 font-sans text-base leading-relaxed text-warm-beige/85">
          Ganesh idols for your home, temple sets for your community, or a walking
          stick in the tradition of Maharaja Martand Singh — work directly with
          the Kunder family to create something that will outlast us all.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-10 bg-gold font-sans text-heritage-brown hover:bg-gold/90"
        >
          <Link href="/commission">Begin a Commission</Link>
        </Button>
      </motion.div>
    </section>
  );
}
