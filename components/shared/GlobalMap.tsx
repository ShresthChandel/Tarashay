"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { MapPin } from "@/lib/country-coordinates";
import { PLACEHOLDER_PINS } from "@/lib/country-coordinates";

const MapInner = dynamic(() => import("./GlobalMapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center rounded-lg bg-warm-beige text-heritage-brown/50">
      Loading map...
    </div>
  ),
});

interface GlobalMapProps {
  countries: string[];
}

export function GlobalMap({ countries }: GlobalMapProps) {
  const [pins, setPins] = useState<MapPin[]>([]);
  const [isPlaceholder, setIsPlaceholder] = useState(false);

  useEffect(() => {
    if (countries.length === 0) {
      setPins(PLACEHOLDER_PINS);
      setIsPlaceholder(true);
      return;
    }

    import("@/lib/country-coordinates").then(({ countryToCoordinates }) => {
      const mapped = countries
        .map(countryToCoordinates)
        .filter((p): p is MapPin => p !== null);
      setPins(mapped.length > 0 ? mapped : PLACEHOLDER_PINS);
      setIsPlaceholder(mapped.length === 0);
    });
  }, [countries]);

  return (
    <div>
      {isPlaceholder && (
        <p className="mb-3 text-center text-sm text-heritage-brown/60">
          Growing every month
        </p>
      )}
      <MapInner pins={pins} />
    </div>
  );
}
