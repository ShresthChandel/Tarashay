"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HOME_IMAGES } from "@/lib/media/home";

export function OriginTeaser() {
  return (
    <section className="bg-off-white py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative aspect-[4/3] overflow-hidden rounded-lg border border-heritage-brown/10 shadow-lg"
        >
          <Image
            src={HOME_IMAGES.craftBeforeAfter.src}
            alt={HOME_IMAGES.craftBeforeAfter.alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={85}
          />
          <p className="absolute bottom-0 left-0 right-0 bg-heritage-brown/80 px-4 py-3 font-sans text-xs tracking-wide text-warm-beige/90 sm:text-sm">
            From Kerala supari to royal court sculpture
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-eyebrow">उत्पत्ति</p>
          <h2 className="mt-3 font-serif text-3xl text-heritage-brown sm:text-4xl">
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
            className="mt-8 px-0 font-sans text-ochre hover:text-heritage-brown"
          >
            <Link href="/story">Read the full timeline →</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
