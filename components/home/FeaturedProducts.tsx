"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/product/ProductCard";
import { dtoToPopulatedProduct } from "@/lib/product-utils";
import { HOME_IMAGES } from "@/lib/media/home";
import type { ProductCardDTO } from "@/types";

interface FeaturedProductsProps {
  products: ProductCardDTO[];
}

function withFallbackPhotos(products: ProductCardDTO[]): ProductCardDTO[] {
  return products.map((product, index) => {
    if (product.photo !== "/placeholder.svg") return product;
    const fallback =
      index === 0
        ? HOME_IMAGES.featuredWhite.src
        : index === 1
          ? HOME_IMAGES.featuredBlack.src
          : product.photo;
    return { ...product, photo: fallback };
  });
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const displayProducts = withFallbackPhotos(products);

  return (
    <section className="bg-warm-beige/50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-heritage-brown/10 shadow-lg sm:max-w-md lg:max-w-none">
            <Image
              src={HOME_IMAGES.featuredBlack.src}
              alt={HOME_IMAGES.featuredBlack.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
              quality={85}
            />
          </div>
          <div>
            <p className="section-eyebrow">संग्रह</p>
            <h2 className="mt-3 font-serif text-3xl text-heritage-brown sm:text-4xl">
              Featured Works
            </h2>
            <p className="mt-4 font-sans leading-relaxed text-heritage-brown/70">
              Each piece records hundreds of hours — raw supari shaped by hands
              that learned the craft from their fathers. One of a kind. Once sold,
              gone forever.
            </p>
          </div>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {displayProducts.map((product, index) => (
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
