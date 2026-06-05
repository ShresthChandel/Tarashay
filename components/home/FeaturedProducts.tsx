"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/product/ProductCard";
import { dtoToPopulatedProduct } from "@/lib/product-utils";
import type { ProductCardDTO } from "@/types";

interface FeaturedProductsProps {
  products: ProductCardDTO[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="bg-warm-beige/50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="font-serif text-3xl text-heritage-brown sm:text-4xl">
            Featured Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-sans text-heritage-brown/70">
            Each piece records hundreds of hours — raw supari shaped by hands
            that learned the craft from their fathers.
          </p>
        </motion.div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={dtoToPopulatedProduct(product)}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
