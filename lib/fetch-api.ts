import type {
  ArtisanCardDTO,
  IArtisan,
  IProductPopulated,
  ProductCardDTO,
  ProductSortOption,
} from "@/types";
import {
  PLACEHOLDER_ARTISANS,
  PLACEHOLDER_PRODUCTS,
} from "@/lib/placeholders/home";
import { mapApiProductToPopulated } from "@/lib/product-utils";

const REVALIDATE = 3600;
const SHOP_REVALIDATE = 1800;

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

interface ApiListResponse<T> {
  success: boolean;
  data?: T;
}

export async function fetchArtisansList(): Promise<IArtisan[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/artisans`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as ApiListResponse<IArtisan[]>;
    return json.success && json.data ? json.data : [];
  } catch {
    return [];
  }
}

export async function fetchFeaturedArtisans(limit = 3): Promise<ArtisanCardDTO[]> {
  const artisans = await fetchArtisansList();
  if (artisans.length === 0) {
    return PLACEHOLDER_ARTISANS;
  }
  return artisans.slice(0, limit).map((a) => ({
    name: a.name,
    slug: a.slug,
    generation: a.generation,
    specialization: a.specialization,
    profilePhoto: a.profilePhoto || "/placeholder.svg",
    yearsExperience: a.yearsExperience,
    totalPiecesCreated: a.totalPiecesCreated,
  }));
}

function mapToProductCardDTO(
  raw: Record<string, unknown>
): ProductCardDTO {
  const p = mapApiProductToPopulated(raw);
  return {
    title: p.title,
    slug: p.slug,
    artisanName: p.artisan.name,
    artisanSlug: p.artisan.slug,
    photo: p.photos[0] ?? "/placeholder.svg",
    hoursToCreate: p.hoursToCreate,
    price: p.price,
    isOneOfAKind: p.isOneOfAKind,
    category: p.category,
    status: p.status,
  };
}

export async function fetchFeaturedProducts(
  limit = 4
): Promise<ProductCardDTO[]> {
  try {
    const params = new URLSearchParams({
      featured: "true",
      status: "available",
      limit: String(limit),
    });
    const res = await fetch(`${getBaseUrl()}/api/products?${params}`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return PLACEHOLDER_PRODUCTS;
    const json = (await res.json()) as ApiListResponse<
      Array<Record<string, unknown>>
    >;
    if (!json.success || !json.data?.length) {
      return PLACEHOLDER_PRODUCTS;
    }
    return json.data.map(mapToProductCardDTO);
  } catch {
    return PLACEHOLDER_PRODUCTS;
  }
}

export interface ShopFetchParams {
  category?: string;
  artisan?: string;
  sort?: ProductSortOption;
}

export async function fetchShopProducts(
  params: ShopFetchParams = {}
): Promise<IProductPopulated[]> {
  try {
    const search = new URLSearchParams({ status: "all" });
    if (params.category && params.category !== "all") {
      search.set("category", params.category);
    }
    if (params.artisan) {
      search.set("artisan", params.artisan);
    }
    if (params.sort) {
      search.set("sort", params.sort);
    }
    const res = await fetch(`${getBaseUrl()}/api/products?${search}`, {
      next: { revalidate: SHOP_REVALIDATE },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as ApiListResponse<
      Array<Record<string, unknown>>
    >;
    if (!json.success || !json.data) return [];
    return json.data.map(mapApiProductToPopulated);
  } catch {
    return [];
  }
}

export async function fetchProductBySlug(
  slug: string
): Promise<IProductPopulated | null> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/products/${slug}`, {
      next: { revalidate: SHOP_REVALIDATE },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as ApiListResponse<Record<string, unknown>>;
    if (!json.success || !json.data) return null;
    return mapApiProductToPopulated(json.data);
  } catch {
    return null;
  }
}

export async function fetchRelatedProducts(
  artisanSlug: string,
  excludeSlug: string,
  limit = 3
): Promise<IProductPopulated[]> {
  try {
    const params = new URLSearchParams({
      artisan: artisanSlug,
      status: "all",
      exclude: excludeSlug,
      limit: String(limit),
    });
    const res = await fetch(`${getBaseUrl()}/api/products?${params}`, {
      next: { revalidate: SHOP_REVALIDATE },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as ApiListResponse<
      Array<Record<string, unknown>>
    >;
    if (!json.success || !json.data) return [];
    return json.data.map(mapApiProductToPopulated);
  } catch {
    return [];
  }
}

export async function fetchArtisanBySlug(
  slug: string
): Promise<IArtisan | null> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/artisans/${slug}`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as ApiListResponse<IArtisan>;
    return json.success && json.data ? json.data : null;
  } catch {
    return null;
  }
}

export async function fetchProductsByArtisanSlug(
  artisanSlug: string
): Promise<ProductCardDTO[]> {
  try {
    const params = new URLSearchParams({
      artisan: artisanSlug,
      status: "available",
    });
    const res = await fetch(`${getBaseUrl()}/api/products?${params}`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as ApiListResponse<
      Array<Record<string, unknown>>
    >;
    if (!json.success || !json.data) return [];
    return json.data.map(mapToProductCardDTO);
  } catch {
    return [];
  }
}

export async function fetchAllArtisanSlugs(): Promise<string[]> {
  const artisans = await fetchArtisansList();
  return artisans.map((a) => a.slug);
}

export async function fetchAllProductSlugs(): Promise<string[]> {
  try {
    const res = await fetch(
      `${getBaseUrl()}/api/products?status=all`,
      { next: { revalidate: SHOP_REVALIDATE } }
    );
    if (!res.ok) return [];
    const json = (await res.json()) as ApiListResponse<
      Array<Record<string, unknown>>
    >;
    if (!json.success || !json.data) return [];
    return json.data.map((p) => String(p.slug));
  } catch {
    return [];
  }
}
