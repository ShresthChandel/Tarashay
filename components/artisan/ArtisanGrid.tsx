"use client";

import type { IArtisan } from "@/types";
import ArtisanCard from "@/components/artisan/ArtisanCard";

interface ArtisanGridProps {
  artisans: IArtisan[];
}

export function ArtisanGrid({ artisans }: ArtisanGridProps) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {artisans.map((artisan, index) => (
        <ArtisanCard key={artisan.slug} artisan={artisan} index={index} />
      ))}
    </div>
  );
}
