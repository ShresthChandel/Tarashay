// Phase 1: placeholder — wire to GET /api/artisans and GET /api/products in Phase 2

import type { ArtisanCardDTO, ProductCardDTO } from "@/types";
import { ProductCategory, ProductStatus } from "@/types";

export const PLACEHOLDER_ARTISANS: ArtisanCardDTO[] = [
  {
    name: "Rajesh Kunder",
    slug: "rajesh-kunder",
    generation: 4,
    specialization: "Ganesh idols & temple sets",
    profilePhoto: "/placeholder.svg",
    yearsExperience: 32,
    totalPiecesCreated: 240,
  },
  {
    name: "Suresh Kunder",
    slug: "suresh-kunder",
    generation: 4,
    specialization: "Decorative supari sculpture",
    profilePhoto: "/placeholder.svg",
    yearsExperience: 28,
    totalPiecesCreated: 190,
  },
  {
    name: "Vijay Kunder",
    slug: "vijay-kunder",
    generation: 3,
    specialization: "Royal court reproductions",
    profilePhoto: "/placeholder.svg",
    yearsExperience: 45,
    totalPiecesCreated: 410,
  },
];

export const PLACEHOLDER_PRODUCTS: ProductCardDTO[] = [
  {
    title: "Maharaja Court Ganesh",
    slug: "maharaja-court-ganesh",
    artisanName: "Rajesh Kunder",
    artisanSlug: "rajesh-kunder",
    photo: "/placeholder.svg",
    hoursToCreate: 180,
    price: { INR: 45000, USD: 540 },
    isOneOfAKind: true,
    category: ProductCategory.GANESH_IDOL,
    status: ProductStatus.AVAILABLE,
  },
  {
    title: "Rewa Temple Miniature Set",
    slug: "rewa-temple-miniature-set",
    artisanName: "Suresh Kunder",
    artisanSlug: "suresh-kunder",
    photo: "/placeholder.svg",
    hoursToCreate: 320,
    price: { INR: 85000, USD: 1020 },
    isOneOfAKind: true,
    category: ProductCategory.TEMPLE_SET,
    status: ProductStatus.AVAILABLE,
  },
  {
    title: "Heritage Walking Stick",
    slug: "heritage-walking-stick",
    artisanName: "Vijay Kunder",
    artisanSlug: "vijay-kunder",
    photo: "/placeholder.svg",
    hoursToCreate: 95,
    price: { INR: 28000, USD: 336 },
    isOneOfAKind: true,
    category: ProductCategory.WALKING_STICK,
    status: ProductStatus.AVAILABLE,
  },
  {
    title: "Royal Sindoordan Box",
    slug: "royal-sindoordan-box",
    artisanName: "Rajesh Kunder",
    artisanSlug: "rajesh-kunder",
    photo: "/placeholder.svg",
    hoursToCreate: 140,
    price: { INR: 38000, USD: 456 },
    isOneOfAKind: true,
    category: ProductCategory.SINDOORDAN,
    status: ProductStatus.RESERVED,
  },
];

export const IMPACT_STATS = {
  piecesSold: 127,
  countriesReached: 18,
  artisansSupported: 5,
  trainingStudents: 3,
} as const;

export const KUNDER_FAMILY_QUOTE = {
  text: "Supari is not wood, not clay — it demands patience that cannot be rushed. What we carve today must survive longer than we will.",
  attribution: "The Kunder Family, Rewa",
} as const;
