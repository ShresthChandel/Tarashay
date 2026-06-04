"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { IArtisan } from "@/types";
import { generationLabel } from "@/lib/mappers";

interface ArtisanHeroProps {
  artisan: IArtisan;
}

export function ArtisanHero({ artisan }: ArtisanHeroProps) {
  const photo = artisan.profilePhoto || "/placeholder.svg";

  return (
    <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
      <Image
        src={photo}
        alt={`${artisan.name} — Rewa Supari Art artisan at work`}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-heritage-brown/90 via-heritage-brown/30 to-transparent" />
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-14"
      >
        <Badge className="mb-4 border-0 bg-gold text-heritage-brown">
          {generationLabel(artisan.generation)}
        </Badge>
        <h1 className="font-serif text-4xl text-warm-beige sm:text-5xl lg:text-6xl">
          {artisan.name}
        </h1>
        <p className="mt-3 max-w-xl font-sans text-lg text-warm-beige/85">
          {artisan.specialization}
        </p>
      </motion.div>
    </section>
  );
}
