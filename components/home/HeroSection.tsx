"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HOME_IMAGES, HOME_VIDEO } from "@/lib/media/home";

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const tryPlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video || reduceMotion) return;
    try {
      video.muted = true;
      await video.play();
      setVideoReady(true);
    } catch {
      setVideoReady(false);
    }
  }, [reduceMotion]);

  useEffect(() => {
    if (!reduceMotion) {
      void tryPlay();
    } else {
      setVideoReady(false);
    }
  }, [reduceMotion, tryPlay]);

  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={HOME_IMAGES.heroPoster.src}
          alt={HOME_IMAGES.heroPoster.alt}
          fill
          priority
          className={`object-cover transition-opacity duration-700 ${
            videoReady && !reduceMotion ? "opacity-0" : "opacity-100"
          }`}
          sizes="100vw"
          quality={85}
        />

        {!reduceMotion && (
          <video
            ref={videoRef}
            src={HOME_VIDEO.mp4}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={HOME_IMAGES.heroPoster.src}
            onLoadedData={() => void tryPlay()}
            onCanPlay={() => void tryPlay()}
            onError={() => setVideoReady(false)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              videoReady ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-heritage-brown/70 via-heritage-brown/55 to-heritage-brown/80" />
      </div>

      <p
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center devanagari text-[clamp(6rem,28vw,18rem)] font-bold leading-none text-warm-beige/[0.06] select-none"
      >
        तराशय
      </p>

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="devanagari text-lg text-gold sm:text-xl"
        >
          तराशय
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-4 font-serif text-4xl leading-tight text-warm-beige sm:text-5xl md:text-6xl lg:text-7xl"
        >
          80 years. 4 generations.
          <br />
          <span className="text-gold">One family</span> keeping an art alive.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mx-auto mt-6 max-w-2xl font-sans text-base leading-relaxed text-warm-beige/85 sm:text-lg"
        >
          Rewa Supari Art — sculptures carved from areca nut in the royal tradition
          of Madhya Pradesh. Critically endangered. Irreplaceable.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            asChild
            size="lg"
            className="bg-gold font-sans tracking-wide text-heritage-brown hover:bg-gold/90"
          >
            <Link href="/story">Discover the Story</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-warm-beige/40 bg-transparent font-sans text-warm-beige hover:bg-warm-beige/10"
          >
            <Link href="/shop">View the Collection</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
