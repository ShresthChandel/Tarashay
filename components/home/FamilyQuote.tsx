"use client";

import { motion } from "framer-motion";

interface FamilyQuoteProps {
  text: string;
  attribution: string;
}

export function FamilyQuote({ text, attribution }: FamilyQuoteProps) {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.blockquote
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="border-l-4 border-ochre pl-8"
        >
          <p className="font-serif text-2xl leading-relaxed text-heritage-brown italic sm:text-3xl">
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
