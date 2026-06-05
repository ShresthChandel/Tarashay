import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { FilterBar } from "@/components/shop/FilterBar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Button } from "@/components/ui/button";
import { fetchShopProducts } from "@/lib/fetch-api";
import type { ProductSortOption } from "@/types";

export const metadata: Metadata = {
  title: "The Collection",
  description:
    "One-of-a-kind areca nut sculptures from Rewa — Ganesh idols, temple sets, and ceremonial art. Once a piece finds a home, it is gone forever.",
};

interface ShopPageProps {
  searchParams: {
    category?: string;
    sort?: string;
    artisan?: string;
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const sort = (searchParams.sort as ProductSortOption) || "newest";
  const products = await fetchShopProducts({
    category: searchParams.category,
    artisan: searchParams.artisan,
    sort,
  });

  return (
    <div className="bg-off-white">
      <header className="border-b border-heritage-brown/10 bg-warm-beige py-20 text-center">
        <p className="font-devanagari text-lg text-ochre">संग्रह</p>
        <h1 className="mt-4 font-serif text-4xl text-heritage-brown sm:text-5xl lg:text-6xl">
          The Collection
        </h1>
        <p className="mx-auto mt-6 max-w-xl px-4 font-sans text-lg text-heritage-brown/75">
          Every piece is one of a kind. Once it finds a home, it is gone forever.
        </p>
        <p className="mt-4 font-sans text-sm tracking-wide text-ochre">
          {products.length} {products.length === 1 ? "piece" : "pieces"} in the
          collection
        </p>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="h-24 animate-pulse rounded bg-warm-beige" />}>
          <FilterBar />
        </Suspense>

        <div className="mt-10">
          {products.length === 0 ? (
            <div className="mx-auto max-w-lg rounded-lg border border-heritage-brown/10 bg-warm-beige/50 p-12 text-center">
              <p className="font-serif text-xl text-heritage-brown">
                The artisans are creating new pieces
              </p>
              <p className="mt-4 font-sans text-heritage-brown/70">
                Check back soon or commission a custom piece shaped in the
                tradition of the Rewa royal court.
              </p>
              <Button
                asChild
                className="mt-8 bg-ochre text-off-white hover:bg-ochre/90"
              >
                <Link href="/commission">Commission a Piece</Link>
              </Button>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </section>
    </div>
  );
}
