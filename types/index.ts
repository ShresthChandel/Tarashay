/**
 * Shared TypeScript types for तराशय (Tarashay) — Rewa Supari Art platform.
 * Mirror Mongoose schemas; use in components and API routes.
 */

// --- Enums ---

export const ProductCategory = {
  GANESH_IDOL: "ganesh-idol",
  TEMPLE_SET: "temple-set",
  DECORATIVE: "decorative",
  WALKING_STICK: "walking-stick",
  SINDOORDAN: "sindoordan",
  CUSTOM: "custom",
  RELIGIOUS: "religious",
} as const;
export type ProductCategory =
  (typeof ProductCategory)[keyof typeof ProductCategory];

export const ProductStatus = {
  AVAILABLE: "available",
  SOLD: "sold",
  RESERVED: "reserved",
  COMMISSIONED: "commissioned",
} as const;
export type ProductStatus =
  (typeof ProductStatus)[keyof typeof ProductStatus];

export const CommissionStatus = {
  RECEIVED: "received",
  REVIEWING: "reviewing",
  QUOTED: "quoted",
  APPROVED: "approved",
  SKETCHING: "sketching",
  SKETCH_SENT: "sketch-sent",
  CREATING: "creating",
  FINISHING: "finishing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
} as const;
export type CommissionStatus =
  (typeof CommissionStatus)[keyof typeof CommissionStatus];

export const OrderStatus = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PACKED: "packed",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const UserRole = {
  ADMIN: "admin",
  BUYER: "buyer",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const Currency = {
  INR: "INR",
  USD: "USD",
} as const;
export type Currency = (typeof Currency)[keyof typeof Currency];

export const PaymentMethod = {
  RAZORPAY: "razorpay",
  STRIPE: "stripe",
} as const;
export type PaymentMethod =
  (typeof PaymentMethod)[keyof typeof PaymentMethod];

// --- Nested shapes ---

export interface Dimensions {
  height: number;
  width: number;
  depth: number;
  unit: "cm" | "in";
}

export interface PricePair {
  INR: number;
  USD: number;
}

export interface ProcessStep {
  step: number;
  description: string;
  photo?: string;
}

export interface BuyerContact {
  name: string;
  email: string;
  phone: string;
  country: string;
}

export interface BudgetRange {
  min: number;
  max: number;
  currency: Currency;
}

export interface ProgressUpdate {
  status: CommissionStatus;
  note: string;
  photo?: string;
  date: Date;
}

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface OrderLineItem {
  product: string;
  quantity: number;
  price: number;
}

// --- Document interfaces (plain objects) ---

export interface IArtisan {
  _id?: string;
  name: string;
  slug: string;
  generation: number;
  specialization: string;
  bio: string;
  story: string;
  yearsExperience: number;
  totalPiecesCreated: number;
  profilePhoto: string;
  workshopPhotos: string[];
  profileVideo?: string;
  signatureProduct?: string;
  awardsWon: string[];
  featuredIn: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProduct {
  _id?: string;
  title: string;
  slug: string;
  artisan: string;
  category: ProductCategory;
  story: string;
  hoursToCreate: number;
  rawMaterialGrams: number;
  process: ProcessStep[];
  dimensions: Dimensions;
  weight: number;
  price: PricePair;
  photos: string[];
  isOneOfAKind: boolean;
  editionSize?: number;
  status: ProductStatus;
  shipsFrom: string;
  isFeatured: boolean;
  views: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICommission {
  _id?: string;
  referenceNumber: string;
  buyerContact: BuyerContact;
  description: string;
  category: ProductCategory | "something-new";
  referenceImages: string[];
  budget: BudgetRange;
  howHeard?: string;
  assignedArtisan?: string | ArtisanRef;
  status: CommissionStatus;
  progressUpdates: ProgressUpdate[];
  quotedPrice?: number;
  estimatedDelivery?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOrder {
  _id?: string;
  buyer?: string;
  guestEmail?: string;
  guestName?: string;
  items: OrderLineItem[];
  totalINR: number;
  totalUSD: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  paymentId?: string;
  paymentStatus: string;
  shippingAddress: ShippingAddress;
  orderStatus: OrderStatus;
  trackingId?: string;
  shippingPartner?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  country?: string;
  phone?: string;
  orderHistory: string[];
  wishlist: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// --- DTOs for UI / API responses ---

export interface ArtisanCardDTO {
  name: string;
  slug: string;
  generation: number;
  specialization: string;
  profilePhoto: string;
  yearsExperience: number;
  totalPiecesCreated: number;
}

export interface ProductCardDTO {
  title: string;
  slug: string;
  artisanName: string;
  artisanSlug: string;
  photo: string;
  hoursToCreate: number;
  price: PricePair;
  isOneOfAKind: boolean;
  category: ProductCategory;
  status: ProductStatus;
}

/** Artisan ref when product.artisan is populated from API */
export interface ArtisanRef {
  _id?: string;
  name: string;
  slug: string;
  profilePhoto?: string;
  generation?: number;
  specialization?: string;
  bio?: string;
  story?: string;
  awardsWon?: string[];
  featuredIn?: string[];
}

/** Product with populated artisan — used in shop cards and cart */
export interface IProductPopulated extends Omit<IProduct, "artisan"> {
  artisan: ArtisanRef;
}

export interface CartItem {
  product: IProductPopulated;
  quantity: number;
}

export type ProductSortOption =
  | "newest"
  | "hours"
  | "price-asc"
  | "price-desc";

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  isPresent?: boolean;
}
