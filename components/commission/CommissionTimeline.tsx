"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    title: "Share Your Vision",
    description:
      "Describe what you want — a Ganesh idol, a temple, a decorative piece, or something entirely new.",
  },
  {
    title: "We Consult the Artisan",
    description:
      "We share your vision with the right Kunder family artisan based on your requirements.",
  },
  {
    title: "You Receive a Quote",
    description:
      "Within 48 hours, you receive a price, timeline, and optionally a sketch.",
  },
  {
    title: "Creation Begins",
    description:
      "Once approved, the artisan begins. Your piece takes shape from raw Kerala supari.",
  },
  {
    title: "Progress Updates",
    description:
      "We send you photos as your piece comes to life — you witness the transformation.",
  },
  {
    title: "Delivered to You",
    description:
      "Your piece arrives with a signed certificate of authenticity from the artisan.",
  },
];

export function CommissionTimeline() {
  return (
    <section className="bg-off-white py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center font-serif text-3xl text-heritage-brown"
        >
          How It Works
        </motion.h2>

        <div className="mt-16 space-y-12">
          {STEPS.map((step, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: isEven ? -24 : 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className={`flex flex-col gap-4 md:flex-row md:items-center ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div
                  className={`flex flex-1 ${isEven ? "md:justify-end md:text-right" : "md:justify-start md:text-left"}`}
                >
                  <div className="max-w-md">
                    <h3 className="font-serif text-xl text-heritage-brown">
                      {step.title}
                    </h3>
                    <p className="mt-2 font-sans text-sm leading-relaxed text-heritage-brown/70">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold bg-warm-beige font-serif text-xl text-ochre">
                    {index + 1}
                  </span>
                </div>

                <div className="hidden flex-1 md:block" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
