"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { IArtisan } from "@/types";
import { generationLabel } from "@/lib/mappers";

export interface ArtisanCardProps {
  artisan: IArtisan;
  index?: number;
}

export default function ArtisanCard({ artisan, index = 0 }: ArtisanCardProps) {
  const photo = artisan.profilePhoto || "/placeholder.svg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/artisans/${artisan.slug}`}>
        <Card className="group overflow-hidden border-heritage-brown/10 bg-off-white transition-all duration-300 hover:border-gold hover:shadow-lg">
          <div className="relative aspect-[4/5] overflow-hidden bg-warm-beige">
            <Image
              src={photo}
              alt={`${artisan.name}, ${generationLabel(artisan.generation)} Rewa Supari Art artisan`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="font-serif text-xl text-heritage-brown">
                {artisan.name}
              </CardTitle>
              <Badge className="shrink-0 border-0 bg-gold/20 text-gold">
                {generationLabel(artisan.generation)}
              </Badge>
            </div>
            <CardDescription className="font-sans text-heritage-brown/70">
              {artisan.specialization}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-sans text-sm text-heritage-brown/60">
              {artisan.yearsExperience} years practicing
            </p>
            <p className="font-sans text-sm text-heritage-brown/60">
              {artisan.totalPiecesCreated} pieces created
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
