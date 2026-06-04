"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import type { IArtisan } from "@/types";
import { generationLabel } from "@/lib/mappers";

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  displayText?: string;
}

function AnimatedStat({
  label,
  value,
  suffix = "",
  displayText,
}: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);
  const spring = useSpring(0, { stiffness: 45, damping: 18 });
  const rounded = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    if (isInView) spring.set(value);
  }, [isInView, spring, value]);

  useEffect(() => {
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => unsub();
  }, [rounded]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-lg border border-heritage-brown/10 bg-off-white p-8 text-center shadow-sm"
    >
      <p className="font-serif text-4xl text-ochre tabular-nums sm:text-5xl">
        {displayText ?? `${display}${suffix}`}
      </p>
      <p className="mt-3 font-sans text-sm tracking-wide text-heritage-brown/70 uppercase">
        {label}
      </p>
    </motion.div>
  );
}

interface ArtisanStatsRowProps {
  artisan: IArtisan;
}

export function ArtisanStatsRow({ artisan }: ArtisanStatsRowProps) {
  return (
    <section className="bg-off-white py-16">
      <div className="mx-auto grid max-w-5xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
        <AnimatedStat
          label="Years Practicing"
          value={artisan.yearsExperience}
        />
        <AnimatedStat
          label="Pieces Created"
          value={artisan.totalPiecesCreated}
        />
        <AnimatedStat
          label="Generation"
          value={artisan.generation}
          displayText={generationLabel(artisan.generation)}
        />
      </div>
    </section>
  );
}
