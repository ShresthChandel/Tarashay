"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  HandHeart,
  Package,
  ScrollText,
  Clock,
  Users,
} from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import type { ImpactStats } from "@/lib/impact-stats";

interface ImpactCountCardsProps {
  stats: ImpactStats;
}

type CardDef = {
  key: keyof ImpactStats | "heritage" | "practitioners";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  staticValue?: number;
  isCountries?: boolean;
};

const CARDS: CardDef[] = [
  { key: "totalProducts", label: "Pieces in Collection", icon: Package },
  { key: "activeArtisans", label: "Artisan Families Supported", icon: HandHeart },
  { key: "countries", label: "Countries Reached", icon: Globe, isCountries: true },
  { key: "totalCommissions", label: "Commissions Received", icon: ScrollText },
  { key: "heritage", label: "Years of Craft Heritage", icon: Clock, staticValue: 83 },
  { key: "practitioners", label: "Active Practitioners", icon: Users, staticValue: 5 },
];

function CountCard({
  value,
  label,
  icon: Icon,
}: {
  value: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const [inView, setInView] = useState(false);
  const count = useCountUp(value, inView);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onViewportEnter={() => setInView(true)}
      className="rounded-lg border border-heritage-brown/10 bg-off-white p-6 text-center"
    >
      <Icon className="mx-auto h-8 w-8 text-ochre" />
      <p className="mt-4 font-serif text-4xl text-heritage-brown">
        {count.toLocaleString("en-IN")}
      </p>
      <p className="mt-2 text-sm text-heritage-brown/60">{label}</p>
    </motion.div>
  );
}

export function ImpactCountCards({ stats }: ImpactCountCardsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {CARDS.map((card) => {
        let value = 0;
        if (card.staticValue !== undefined) {
          value = card.staticValue;
        } else if (card.isCountries) {
          value = stats.countries.length || 1;
        } else if (
          card.key === "totalProducts" ||
          card.key === "activeArtisans" ||
          card.key === "totalCommissions"
        ) {
          value = stats[card.key];
        }

        return (
          <CountCard
            key={card.label}
            value={value}
            label={card.label}
            icon={card.icon}
          />
        );
      })}
    </div>
  );
}
