"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { IProductPopulated } from "@/types";
import { ProductStatus } from "@/types";
import { formatINR, getCategoryLabel } from "@/lib/product-utils";

export interface ProductCardProps {
  product: IProductPopulated;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const photo = product.photos[0] ?? "/placeholder.svg";
  const isSold = product.status === ProductStatus.SOLD;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Card className="group overflow-hidden border-heritage-brown/10 bg-off-white transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-xl">
        <Link href={`/shop/${product.slug}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-warm-beige">
            <Image
              src={photo}
              alt={`${product.title} — hand-carved Rewa supari art by ${product.artisan.name}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            {product.isOneOfAKind && (
              <Badge className="absolute left-3 top-3 border-0 bg-gold text-heritage-brown">
                One of a Kind
              </Badge>
            )}
            <Badge
              variant="secondary"
              className="absolute right-3 top-3 border-0 bg-heritage-brown/80 text-warm-beige"
            >
              {getCategoryLabel(product.category)}
            </Badge>
            {isSold && (
              <div className="absolute inset-0 flex items-center justify-center bg-heritage-brown/50">
                <span className="font-serif text-lg tracking-widest text-warm-beige uppercase">
                  Sold
                </span>
              </div>
            )}
          </div>
        </Link>
        <CardHeader className="pb-2">
          <Link href={`/shop/${product.slug}`}>
            <CardTitle className="font-serif text-lg text-heritage-brown line-clamp-2 hover:text-ochre">
              {product.title}
            </CardTitle>
          </Link>
          <p className="font-sans text-sm text-heritage-brown/70">
            by{" "}
            <Link
              href={`/artisans/${product.artisan.slug}`}
              className="text-ochre hover:underline"
            >
              {product.artisan.name}
            </Link>
          </p>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <span className="flex items-center gap-1.5 font-sans text-sm text-ochre">
            <Clock className="h-4 w-4" />
            {product.hoursToCreate} hours of craftsmanship
          </span>
          <div className="flex items-center justify-between">
            <span className="font-serif text-lg text-heritage-brown">
              {formatINR(product.price.INR)}
            </span>
          </div>
          <Button
            asChild
            variant="ghost"
            className="w-full translate-y-2 border border-transparent font-sans text-ochre opacity-0 transition-all group-hover:translate-y-0 group-hover:border-gold/30 group-hover:opacity-100"
          >
            <Link href={`/shop/${product.slug}`}>View Story →</Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
