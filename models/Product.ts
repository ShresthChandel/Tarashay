import mongoose, { Schema, models, model } from "mongoose";
import {
  ProductCategory,
  ProductStatus,
} from "@/types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

const ProcessStepSchema = new Schema(
  {
    step: { type: Number, required: true },
    description: { type: String, required: true },
    photo: { type: String },
  },
  { _id: false }
);

const DimensionsSchema = new Schema(
  {
    height: { type: Number, required: true },
    width: { type: Number, required: true },
    depth: { type: Number, required: true },
    unit: { type: String, enum: ["cm", "in"], default: "cm" },
  },
  { _id: false }
);

const PriceSchema = new Schema(
  {
    INR: { type: Number, required: true },
    USD: { type: Number, required: true },
  },
  { _id: false }
);

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    artisan: { type: Schema.Types.ObjectId, ref: "Artisan", required: true },
    category: {
      type: String,
      enum: Object.values(ProductCategory),
      required: true,
    },
    story: { type: String, required: true },
    /** Hours invested — honours the labour behind each areca nut sculpture */
    hoursToCreate: { type: Number, required: true },
    rawMaterialGrams: { type: Number, required: true },
    process: [ProcessStepSchema],
    dimensions: { type: DimensionsSchema, required: true },
    weight: { type: Number, required: true },
    price: { type: PriceSchema, required: true },
    photos: [{ type: String }],
    isOneOfAKind: { type: Boolean, default: true },
    editionSize: { type: Number },
    status: {
      type: String,
      enum: Object.values(ProductStatus),
      default: ProductStatus.AVAILABLE,
    },
    shipsFrom: {
      type: String,
      default: "Rewa, Madhya Pradesh",
    },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        const obj = ret as Record<string, unknown>;
        delete obj.__v;
        return obj;
      },
    },
  }
);

ProductSchema.pre("save", function () {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
});

const Product = models.Product || model("Product", ProductSchema);

export default Product;
