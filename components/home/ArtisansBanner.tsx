"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HOME_IMAGES } from "@/lib/media/home";

export function ArtisansBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative mb-16 aspect-[21/9] overflow-hidden rounded-lg border border-heritage-brown/10 sm:aspect-[2.5/1]"
    >
      <Image
        src={HOME_IMAGES.artisanHands.src}
        alt={HOME_IMAGES.artisanHands.alt}
        fill
        className="object-cover object-center"
        sizes="(max-width: 1280px) 100vw, 1280px"
        quality={85}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-heritage-brown/70 via-heritage-brown/30 to-transparent" />
      <div className="absolute bottom-0 left-0 max-w-md p-6 sm:p-8">
        <p className="devanagari text-xl text-gold sm:text-2xl">कारीगर</p>
        <p className="mt-2 font-serif text-lg text-warm-beige sm:text-xl">
          Four generations. One pair of hands at a time.
        </p>
      </div>
    </motion.div>
  );
}
