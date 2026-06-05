"use client";

import { ProductCard } from "@/components/product/ProductCard";
import type { IProductPopulated } from "@/types";

interface ProductGridProps {
  products: IProductPopulated[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <ProductCard key={product.slug} product={product} index={index} />
      ))}
    </div>
  );
}
