"use client";

import { motion } from "framer-motion";
import type { IArtisan } from "@/types";

interface ArtisanVideoSectionProps {
  artisan: IArtisan;
}

export function ArtisanVideoSection({ artisan }: ArtisanVideoSectionProps) {
  if (!artisan.profileVideo) {
    return null;
  }

  const poster = artisan.profilePhoto || "/placeholder.svg";
  const isEmbed =
    artisan.profileVideo.includes("youtube") ||
    artisan.profileVideo.includes("vimeo");

  return (
    <section className="bg-heritage-brown py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-3xl text-warm-beige">
            In the Workshop
          </h2>
          <p className="mt-3 font-sans text-warm-beige/75">
            Watch {artisan.name} shape raw supari — the same hands that learned
            from their father in Rewa.
          </p>
          <div className="relative mt-8 aspect-video overflow-hidden rounded-lg border border-gold/30 bg-warm-beige/10">
            {isEmbed ? (
              <iframe
                src={artisan.profileVideo}
                title={`${artisan.name} workshop video`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={artisan.profileVideo}
                controls
                poster={poster}
                className="h-full w-full object-cover"
              >
                Your browser does not support video playback.
              </video>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
