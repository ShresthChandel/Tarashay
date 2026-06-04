"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl px-4 text-center sm:px-6"
      >
        <p className="font-sans text-sm tracking-widest text-ochre uppercase">
          Critically endangered
        </p>
        <p className="mt-4 font-serif text-6xl text-heritage-brown sm:text-7xl md:text-8xl">
          Only{" "}
          <span className="text-ochre tabular-nums">{display}</span>
        </p>
        <p className="mt-4 font-serif text-xl text-heritage-brown/80 sm:text-2xl">
          {LABEL}
        </p>
        <p className="mx-auto mt-6 max-w-xl font-sans text-sm leading-relaxed text-heritage-brown/60">
          The Kunder family of Rewa has guarded this areca nut carving tradition
          since 1942. When a craft has so few hands, every witness matters.
        </p>
      </motion.div>
    </section>
  );
}
