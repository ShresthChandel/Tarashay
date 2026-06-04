import type { ArtisanCardDTO, IArtisan, ProductCardDTO } from "@/types";
import {
  PLACEHOLDER_ARTISANS,
  PLACEHOLDER_PRODUCTS,
} from "@/lib/placeholders/home";

const REVALIDATE = 3600;

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
    return json.data.map((p) => {
      const artisan = p.artisan as
        | { name?: string; slug?: string }
        | string
        | undefined;
      const artisanObj =
        typeof artisan === "object" && artisan !== null ? artisan : null;
      const price = p.price as ProductCardDTO["price"];
      return {
        title: String(p.title),
        slug: String(p.slug),
        artisanName: artisanObj?.name ?? "Kunder Family",
        artisanSlug: artisanObj?.slug ?? "",
        photo: Array.isArray(p.photos) && p.photos[0]
          ? String(p.photos[0])
          : "/placeholder.svg",
        hoursToCreate: Number(p.hoursToCreate),
        price,
        isOneOfAKind: Boolean(p.isOneOfAKind),
        category: p.category as ProductCardDTO["category"],
        status: p.status as ProductCardDTO["status"],
      };
    });
  } catch {
    return PLACEHOLDER_PRODUCTS;
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
    return json.data.map((p) => {
      const artisan = p.artisan as
        | { name?: string; slug?: string }
        | undefined;
      const price = p.price as ProductCardDTO["price"];
      return {
        title: String(p.title),
        slug: String(p.slug),
        artisanName: artisan?.name ?? "Kunder Family",
        artisanSlug: artisan?.slug ?? artisanSlug,
        photo: Array.isArray(p.photos) && p.photos[0]
          ? String(p.photos[0])
          : "/placeholder.svg",
        hoursToCreate: Number(p.hoursToCreate),
        price,
        isOneOfAKind: Boolean(p.isOneOfAKind),
        category: p.category as ProductCardDTO["category"],
        status: p.status as ProductCardDTO["status"],
      };
    });
  } catch {
    return [];
  }
}

export async function fetchAllArtisanSlugs(): Promise<string[]> {
  const artisans = await fetchArtisansList();
  return artisans.map((a) => a.slug);
}
