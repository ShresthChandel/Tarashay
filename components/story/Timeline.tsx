"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { TimelineEvent } from "@/types";

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative mx-auto max-w-3xl px-4 pb-24 sm:px-6">
      <div
        className="absolute left-6 top-0 bottom-0 w-px bg-heritage-brown/20 sm:left-8"
        aria-hidden
      />

      <ul className="space-y-16">
        {events.map((event, index) => {
          const isPresent = event.isPresent === true;
          const isHistorical = !isPresent;

          return (
            <motion.li
              key={`${event.year}-${event.title}`}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="relative pl-14 sm:pl-20"
            >
              <span
                className={`absolute left-4 top-2 h-4 w-4 rounded-full border-2 sm:left-6 ${
                  isPresent
                    ? "border-gold bg-gold"
                    : "border-ochre bg-warm-beige"
                }`}
              />

              <article
                className={`overflow-hidden rounded-lg border border-heritage-brown/10 bg-off-white p-6 shadow-sm ${
                  isHistorical ? "timeline-sepia" : "timeline-present"
                }`}
              >
                <time className="font-sans text-sm font-medium tracking-widest text-ochre uppercase">
                  {event.year}
                </time>
                <h3 className="mt-2 font-serif text-2xl text-heritage-brown">
                  {event.title}
                </h3>
                <p className="mt-4 font-sans text-base leading-relaxed text-heritage-brown/75">
                  {event.description}
                </p>
                {isHistorical && (
                  <div className="relative mt-6 aspect-video overflow-hidden rounded-md bg-warm-beige">
                    <Image
                      src="/placeholder.svg"
                      alt={`Historical context: ${event.title} — Rewa Supari Art heritage`}
                      fill
                      className="object-cover opacity-90"
                      sizes="(max-width: 768px) 100vw, 672px"
                    />
                  </div>
                )}
              </article>
            </motion.li>
          );
        })}
      </ul>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mt-20 text-center font-serif text-2xl text-heritage-brown sm:text-3xl"
      >
        This story continues only if the craft survives.
      </motion.p>
    </div>
  );
}
