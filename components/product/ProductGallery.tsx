"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGalleryProps {
  photos: string[];
  title: string;
}

export function ProductGallery({ photos, title }: ProductGalleryProps) {
  const images = photos.length > 0 ? photos : ["/placeholder.svg"];
  const thumbs = images.slice(0, 4);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative h-[60vh] min-h-[320px] overflow-hidden rounded-lg bg-warm-beige">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative h-full w-full"
          >
            <Image
              src={images[activeIndex]}
              alt={`${title} — Rewa supari art, view ${activeIndex + 1}`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </motion.div>
        </AnimatePresence>
      </div>
      {thumbs.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {thumbs.map((photo, i) => (
            <button
              key={photo}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                activeIndex === i
                  ? "border-gold"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={photo}
                alt={`${title} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
