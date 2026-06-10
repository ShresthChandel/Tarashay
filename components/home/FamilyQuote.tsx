"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HOME_IMAGES } from "@/lib/media/home";

interface FamilyQuoteProps {
  text: string;
  attribution: string;
}

export function FamilyQuote({ text, attribution }: FamilyQuoteProps) {
  return (
    <section className="bg-off-white py-24">
      <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[auto_1fr] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto aspect-[3/4] w-full max-w-xs overflow-hidden rounded-lg border border-heritage-brown/10 shadow-md lg:mx-0 lg:max-w-sm"
        >
          <Image
            src={HOME_IMAGES.quoteGrass.src}
            alt={HOME_IMAGES.quoteGrass.alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 80vw, 384px"
            quality={85}
          />
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="border-l-4 border-ochre pl-8"
        >
          <p className="devanagari text-[clamp(1.5rem,5vw,2.25rem)] font-semibold leading-snug text-ochre">
            तराशना एक साधना है
          </p>
          <p className="mt-6 font-serif text-2xl leading-relaxed text-heritage-brown italic sm:text-3xl">
            &ldquo;{text}&rdquo;
          </p>
          <footer className="mt-6 font-sans text-sm tracking-wide text-ochre">
            — {attribution}
          </footer>
        </motion.blockquote>
      </div>
    </section>
  );
}
