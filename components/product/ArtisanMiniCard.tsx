import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { generationLabel } from "@/lib/mappers";
import type { ArtisanRef } from "@/types";

interface ArtisanMiniCardProps {
  artisan: ArtisanRef;
}

export function ArtisanMiniCard({ artisan }: ArtisanMiniCardProps) {
  const photo = artisan.profilePhoto ?? "/placeholder.svg";

  return (
    <div className="flex items-center gap-4 rounded-lg border border-heritage-brown/10 bg-warm-beige/40 p-4">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
        <Image
          src={photo}
          alt={`${artisan.name} — Rewa Supari Art artisan`}
          fill
          className="object-cover"
          sizes="56px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-sans text-sm text-heritage-brown/60">
          Crafted by
        </p>
        <p className="font-serif text-lg text-heritage-brown">{artisan.name}</p>
        {artisan.generation && (
          <Badge className="mt-1 border-0 bg-gold/20 text-ochre text-xs">
            {generationLabel(artisan.generation)}
          </Badge>
        )}
        <div className="mt-2 flex flex-wrap gap-3 font-sans text-sm">
          <Link
            href={`/artisans/${artisan.slug}`}
            className="text-ochre hover:underline"
          >
            View profile →
          </Link>
          <Link
            href={`/commission?artisan=${artisan.slug}`}
            className="text-heritage-brown/70 hover:text-ochre"
          >
            Commission this artisan →
          </Link>
        </div>
      </div>
    </div>
  );
}
