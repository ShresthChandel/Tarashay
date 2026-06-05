"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCategory, type ProductSortOption } from "@/types";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: ProductCategory.GANESH_IDOL, label: "Ganesh Idol" },
  { value: ProductCategory.TEMPLE_SET, label: "Temple Set" },
  { value: ProductCategory.DECORATIVE, label: "Decorative" },
  { value: ProductCategory.WALKING_STICK, label: "Walking Stick" },
  { value: ProductCategory.SINDOORDAN, label: "Sindoordan" },
  { value: ProductCategory.RELIGIOUS, label: "Religious" },
] as const;

const SORT_OPTIONS: { value: ProductSortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "hours", label: "Most Laborious" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") ?? "all";
  const activeSort = (searchParams.get("sort") as ProductSortOption) ?? "newest";

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all" || (key === "sort" && value === "newest")) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  return (
    <div className="space-y-4 border-b border-heritage-brown/10 pb-6">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => updateParams("category", cat.value)}
            className={`rounded-full px-4 py-2 font-sans text-sm transition-colors ${
              activeCategory === cat.value
                ? "bg-gold text-heritage-brown"
                : "bg-warm-beige text-heritage-brown/80 hover:bg-ochre/20"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="font-sans text-sm text-heritage-brown/60">Sort by</span>
        <Select
          value={activeSort}
          onValueChange={(v) => updateParams("sort", v)}
        >
          <SelectTrigger className="w-[200px] border-heritage-brown/20 bg-off-white font-sans">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
