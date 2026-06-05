import type {
  IProductPopulated,
  ProductCardDTO,
  ProductCategory,
  ProductSortOption,
} from "@/types";

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  "ganesh-idol": "Ganesh Idol",
  "temple-set": "Temple Set",
  decorative: "Decorative",
  "walking-stick": "Walking Stick",
  sindoordan: "Sindoordan",
  custom: "Custom",
  religious: "Religious",
};

export function getCategoryLabel(category: ProductCategory): string {
  return CATEGORY_LABELS[category] ?? category;
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function dtoToPopulatedProduct(dto: ProductCardDTO): IProductPopulated {
  return {
    title: dto.title,
    slug: dto.slug,
    artisan: {
      name: dto.artisanName,
      slug: dto.artisanSlug,
    },
    category: dto.category,
    story: "",
    hoursToCreate: dto.hoursToCreate,
    rawMaterialGrams: 0,
    process: [],
    dimensions: { height: 0, width: 0, depth: 0, unit: "cm" },
    weight: 0,
    price: dto.price,
    photos: [dto.photo],
    isOneOfAKind: dto.isOneOfAKind,
    status: dto.status,
    shipsFrom: "Rewa, Madhya Pradesh",
    isFeatured: true,
    views: 0,
  };
}

export function mapApiProductToPopulated(
  raw: Record<string, unknown>
): IProductPopulated {
  const artisan = raw.artisan as Record<string, unknown> | string | undefined;
  const artisanObj =
    typeof artisan === "object" && artisan !== null
      ? {
          _id: artisan._id ? String(artisan._id) : undefined,
          name: String(artisan.name ?? "Kunder Family"),
          slug: String(artisan.slug ?? ""),
          profilePhoto: artisan.profilePhoto
            ? String(artisan.profilePhoto)
            : undefined,
          generation: artisan.generation
            ? Number(artisan.generation)
            : undefined,
          specialization: artisan.specialization
            ? String(artisan.specialization)
            : undefined,
          bio: artisan.bio ? String(artisan.bio) : undefined,
          story: artisan.story ? String(artisan.story) : undefined,
          awardsWon: Array.isArray(artisan.awardsWon)
            ? (artisan.awardsWon as string[])
            : undefined,
          featuredIn: Array.isArray(artisan.featuredIn)
            ? (artisan.featuredIn as string[])
            : undefined,
        }
      : { name: "Kunder Family", slug: "" };

  return {
    _id: raw._id ? String(raw._id) : undefined,
    title: String(raw.title),
    slug: String(raw.slug),
    artisan: artisanObj,
    category: raw.category as IProductPopulated["category"],
    story: String(raw.story ?? ""),
    hoursToCreate: Number(raw.hoursToCreate),
    rawMaterialGrams: Number(raw.rawMaterialGrams ?? 0),
    process: Array.isArray(raw.process)
      ? (raw.process as IProductPopulated["process"])
      : [],
    dimensions: (raw.dimensions as IProductPopulated["dimensions"]) ?? {
      height: 0,
      width: 0,
      depth: 0,
      unit: "cm",
    },
    weight: Number(raw.weight ?? 0),
    price: raw.price as IProductPopulated["price"],
    photos: Array.isArray(raw.photos)
      ? (raw.photos as string[])
      : ["/placeholder.svg"],
    isOneOfAKind: Boolean(raw.isOneOfAKind),
    editionSize: raw.editionSize ? Number(raw.editionSize) : undefined,
    status: raw.status as IProductPopulated["status"],
    shipsFrom: String(raw.shipsFrom ?? "Rewa, Madhya Pradesh"),
    isFeatured: Boolean(raw.isFeatured),
    views: Number(raw.views ?? 0),
    createdAt: raw.createdAt ? new Date(String(raw.createdAt)) : undefined,
    updatedAt: raw.updatedAt ? new Date(String(raw.updatedAt)) : undefined,
  };
}

export function getSortMongoKey(sort: ProductSortOption): Record<string, 1 | -1> {
  switch (sort) {
    case "hours":
      return { hoursToCreate: -1 };
    case "price-asc":
      return { "price.INR": 1 };
    case "price-desc":
      return { "price.INR": -1 };
    default:
      return { createdAt: -1 };
  }
}

export const DEFAULT_PROCESS_STEPS = [
  {
    step: 1,
    description: "Selection — Kerala areca nuts sorted by size and quality",
  },
  {
    step: 2,
    description: "Design — Artisan plans the composition on seasoned supari",
  },
  {
    step: 3,
    description: "Carving — Each piece shaped by hand with traditional tools",
  },
  {
    step: 4,
    description:
      "Assembly — Components joined on a wooden framework where needed",
  },
  {
    step: 5,
    description: "Finishing — Polished, mounted, and prepared for its journey",
  },
] as const;
