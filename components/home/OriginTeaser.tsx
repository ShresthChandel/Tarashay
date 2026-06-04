"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function OriginTeaser() {
  return (
    <section className="bg-off-white py-24">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-serif text-3xl text-heritage-brown sm:text-4xl">
            Born in the Royal Court of Rewa
          </h2>
          <p className="mt-6 font-sans text-base leading-relaxed text-heritage-brown/75 sm:text-lg">
            In 1942, the Kunder family began transforming areca nut — supari —
            into sculptures fit for maharajas. Ganesh idols, temple sets, and
            ceremonial pieces that could not be carved from wood or clay. The
            craft survived partition, independence, and the slow erosion of royal
            patronage — but never the patience it demands.
          </p>
          <Button
            asChild
            variant="link"
            className="mt-8 font-sans text-ochre hover:text-heritage-brown"
          >
            <Link href="/story">Read the full timeline →</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
