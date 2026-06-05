"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { ArtisanRef } from "@/types";

interface ArtisanProfileCardProps {
  artisan: ArtisanRef;
}

export function ArtisanProfileCard({ artisan }: ArtisanProfileCardProps) {
  const photo = artisan.profilePhoto ?? "/placeholder.svg";
  const excerpt =
    artisan.story?.slice(0, 280) ||
    artisan.bio ||
    "A guardian of Rewa Supari Art — shaping areca nut in a tradition passed from parent to child since 1942.";

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-lg border border-heritage-brown/10 bg-warm-beige p-8 md:p-10"
    >
      <div className="grid gap-8 md:grid-cols-[200px_1fr]">
        <div className="relative mx-auto aspect-square w-full max-w-[200px] overflow-hidden rounded-lg md:mx-0">
          <Image
            src={photo}
            alt={`${artisan.name} in the Rewa workshop`}
            fill
            className="object-cover"
            sizes="200px"
          />
        </div>
        <div>
          <h2 className="font-serif text-2xl text-heritage-brown">
            About the Artisan
          </h2>
          <p className="mt-1 font-sans text-ochre">{artisan.name}</p>
          <p className="mt-4 font-sans leading-relaxed text-heritage-brown/80">
            {excerpt}
            {(artisan.story?.length ?? 0) > 280 ? "…" : ""}
          </p>
          {artisan.awardsWon && artisan.awardsWon.length > 0 && (
            <ul className="mt-6 space-y-1">
              {artisan.awardsWon.map((award) => (
                <li
                  key={award}
                  className="font-sans text-sm text-heritage-brown/70 before:mr-2 before:text-gold before:content-['•']"
                >
                  {award}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              variant="outline"
              className="border-heritage-brown/30"
            >
              <Link href={`/artisans/${artisan.slug}`}>
                View full profile →
              </Link>
            </Button>
            <Button asChild className="bg-ochre text-off-white hover:bg-ochre/90">
              <Link href={`/commission?artisan=${artisan.slug}`}>
                Commission →
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
