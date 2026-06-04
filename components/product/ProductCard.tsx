"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ProductCardDTO } from "@/types";

interface ProductCardProps {
  product: ProductCardDTO;
  index?: number;
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link href={`/shop/${product.slug}`}>
        <Card className="group overflow-hidden border-heritage-brown/10 bg-off-white transition-shadow hover:shadow-lg">
          <div className="relative aspect-square overflow-hidden bg-warm-beige">
            <Image
              src={product.photo}
              alt={`${product.title} — hand-carved Rewa supari art by ${product.artisanName}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
            {product.isOneOfAKind && (
              <Badge className="absolute left-3 top-3 bg-heritage-brown/90 text-warm-beige border-0">
                One of a Kind
              </Badge>
            )}
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="font-serif text-lg text-heritage-brown line-clamp-2">
              {product.title}
            </CardTitle>
            <CardDescription className="font-sans text-sm">
              by{" "}
              <span className="text-ochre">{product.artisanName}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between pt-0">
            <span className="flex items-center gap-1 font-sans text-xs text-heritage-brown/60">
              <Clock className="h-3.5 w-3.5" />
              {product.hoursToCreate} hours to create
            </span>
            <span className="font-serif text-ochre">
              {formatINR(product.price.INR)}
            </span>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
