"use client";

import { motion } from "framer-motion";

interface ImpactStripProps {
  piecesSold: number;
  countriesReached: number;
  artisansSupported: number;
}

const stats = (props: ImpactStripProps) => [
  { value: props.piecesSold, label: "Pieces preserved in homes worldwide" },
  { value: props.countriesReached, label: "Countries reached" },
  { value: props.artisansSupported, label: "Artisans supported directly" },
];

export function ImpactStrip({
  piecesSold,
  countriesReached,
  artisansSupported,
}: ImpactStripProps) {
  const items = stats({ piecesSold, countriesReached, artisansSupported });

  return (
    <section className="bg-heritage-brown py-16 text-warm-beige">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid gap-10 sm:grid-cols-3"
        >
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <p className="font-serif text-4xl text-gold sm:text-5xl">
                {item.value}+
              </p>
              <p className="mt-2 font-sans text-sm text-warm-beige/75">
                {item.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
