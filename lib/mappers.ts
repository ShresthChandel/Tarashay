import type {
  ArtisanCardDTO,
  IArtisan,
  IProduct,
  ProductCardDTO,
  ProductCategory,
  ProductStatus,
} from "@/types";

interface PopulatedArtisanRef {
  _id?: { toString(): string };
  name: string;
  slug: string;
  profilePhoto: string;
}

interface ProductLean extends Omit<IProduct, "artisan"> {
  artisan: string | PopulatedArtisanRef;
}

export function toArtisanCard(artisan: IArtisan): ArtisanCardDTO {
  return {
    name: artisan.name,
    slug: artisan.slug,
    generation: artisan.generation,
    specialization: artisan.specialization,
    profilePhoto: artisan.profilePhoto || "/placeholder.svg",
    yearsExperience: artisan.yearsExperience,
    totalPiecesCreated: artisan.totalPiecesCreated,
  };
}

export function toProductCard(product: ProductLean): ProductCardDTO {
  const artisan =
    typeof product.artisan === "object" && product.artisan !== null
      ? product.artisan
      : null;

  return {
    title: product.title,
    slug: product.slug,
    artisanName: artisan?.name ?? "Kunder Family",
    artisanSlug: artisan?.slug ?? "",
    photo: product.photos?.[0] ?? "/placeholder.svg",
    hoursToCreate: product.hoursToCreate,
    price: product.price,
    isOneOfAKind: product.isOneOfAKind,
    category: product.category as ProductCategory,
    status: product.status as ProductStatus,
  };
}

export function generationLabel(generation: number): string {
  const suffix =
    generation === 1
      ? "st"
      : generation === 2
        ? "nd"
        : generation === 3
          ? "rd"
          : "th";
  return `${generation}${suffix} Generation`;
}
