"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/stores/cartStore";
import { formatINR, formatUSD } from "@/lib/product-utils";
import type { IProductPopulated } from "@/types";
import { ProductStatus } from "@/types";

interface ProductPurchaseProps {
  product: IProductPopulated;
}

export function ProductPurchase({ product }: ProductPurchaseProps) {
  const addItem = useCartStore((s) => s.addItem);
  const isAvailable = product.status === ProductStatus.AVAILABLE;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-lg border border-heritage-brown/10 bg-off-white p-8"
    >
      <p className="font-serif text-4xl text-heritage-brown">
        {formatINR(product.price.INR)}
      </p>
      <p className="mt-1 font-sans text-sm text-heritage-brown/60">
        ≈ {formatUSD(product.price.USD)} USD
      </p>

      {isAvailable ? (
        <div className="mt-8 space-y-3">
          <Button
            className="w-full bg-gold text-heritage-brown hover:bg-gold/90 font-sans"
            size="lg"
            onClick={() => addItem(product)}
          >
            Add to Cart
          </Button>
          <Button
            variant="outline"
            className="w-full border-heritage-brown/30 font-sans"
            size="lg"
            onClick={() => {
              addItem(product);
              window.location.href = "/checkout";
            }}
          >
            Buy Now
          </Button>
          <p className="pt-2 text-center font-sans text-sm text-heritage-brown/60">
            Ships from {product.shipsFrom}
          </p>
          <p className="text-center font-sans text-xs text-heritage-brown/50">
            Estimated delivery: 8–12 days domestic, 18–25 days international
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4 text-center">
          <p className="font-serif text-lg text-heritage-brown/80">
            This piece has found a home
          </p>
          <Button
            asChild
            className="w-full bg-heritage-brown text-warm-beige hover:bg-heritage-brown/90"
          >
            <Link href={`/commission?artisan=${product.artisan.slug}`}>
              Commission a Similar Piece →
            </Link>
          </Button>
        </div>
      )}

      <div className="mt-8 flex items-start gap-2 border-t border-heritage-brown/10 pt-6">
        <Award className="mt-0.5 h-4 w-4 shrink-0 text-ochre" />
        <p className="font-sans text-xs leading-relaxed text-heritage-brown/60">
          Ships with a signed certificate of authenticity by{" "}
          {product.artisan.name}
        </p>
      </div>
    </motion.div>
  );
}
