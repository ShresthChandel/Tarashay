"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { HOME_IMAGES } from "@/lib/media/home";

const TARGET = 5;
const LABEL =
  "artisans practice this craft in the entire world";

export function CraftCounter() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const rounded = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    if (isInView) {
      spring.set(TARGET);
    }
  }, [isInView, spring]);

  useEffect(() => {
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => unsub();
  }, [rounded]);

  return (
    <section
      ref={ref}
      className="border-y border-heritage-brown/10 bg-warm-beige py-20"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:gap-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left"
        >
          <p className="font-sans text-sm tracking-widest text-ochre uppercase">
            Critically endangered
          </p>
          <p className="mt-6 font-serif text-2xl text-heritage-brown/50 sm:text-3xl">
            Only
          </p>
          <p
            className={`mt-2 font-serif text-[clamp(3.5rem,12vw,5rem)] leading-none text-gold tabular-nums ${
              display === TARGET ? "counter-pulse" : ""
            }`}
          >
            {display}
          </p>
          <p className="mt-4 font-serif text-xl text-heritage-brown/80 sm:text-2xl">
            {LABEL}
          </p>
          <p className="mx-auto mt-6 max-w-xl font-sans text-sm leading-relaxed text-heritage-brown/60 lg:mx-0">
            The Kunder family of Rewa has guarded this areca nut carving tradition
            since 1942. When a craft has so few hands, every witness matters.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto hidden h-72 w-48 overflow-hidden rounded-lg border border-heritage-brown/10 shadow-md sm:block lg:mx-0 lg:h-80 lg:w-56"
        >
          <Image
            src={HOME_IMAGES.detailGreen.src}
            alt={HOME_IMAGES.detailGreen.alt}
            fill
            className="object-cover"
            sizes="224px"
            quality={85}
          />
        </motion.div>
      </div>
    </section>
  );
}
