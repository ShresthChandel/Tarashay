"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
      {/* Video placeholder — full viewport hero with warm overlay */}
      <div className="absolute inset-0">
        <Image
          src="/placeholder.svg"
          alt="Rewa Supari Art workshop — areca nut sculptures in warm light"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-heritage-brown/55" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-devanagari text-lg text-gold sm:text-xl"
        >
          तराशय
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-4 font-serif text-4xl leading-tight text-warm-beige sm:text-5xl md:text-6xl lg:text-7xl"
        >
          80 years. 4 generations.
          <br />
          <span className="text-gold">One family</span> keeping an art alive.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mx-auto mt-6 max-w-2xl font-sans text-base leading-relaxed text-warm-beige/85 sm:text-lg"
        >
          Rewa Supari Art — sculptures carved from areca nut in the royal tradition
          of Madhya Pradesh. Critically endangered. Irreplaceable.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            asChild
            size="lg"
            className="bg-ochre text-off-white hover:bg-ochre/90 font-sans tracking-wide"
          >
            <Link href="/story">Discover the Story</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-warm-beige/40 bg-transparent text-warm-beige hover:bg-warm-beige/10 font-sans"
          >
            <Link href="/shop">View the Collection</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
