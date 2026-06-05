export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import connectDB from "@/lib/mongodb";
import Artisan from "@/models/Artisan";
import Product from "@/models/Product";
import { ProductStatus } from "@/types";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/slugify";
import {
  parseRequestBody,
  asString,
  asNumber,
  asStringArray,
} from "@/lib/parse-body";
import { ProductCategory } from "@/types";

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const artisanParam = searchParams.get("artisan");
    const statusParam = searchParams.get("status");
    const featured = searchParams.get("featured");
    const limitParam = searchParams.get("limit");
    const sortParam = searchParams.get("sort");
    const excludeSlug = searchParams.get("exclude");

    const filter: Record<string, unknown> = {};

    if (statusParam === "all") {
      // Shop page — show available, sold, reserved, commissioned
    } else if (statusParam) {
      filter.status = statusParam;
    } else {
      filter.status = ProductStatus.AVAILABLE;
    }

    if (excludeSlug) {
      filter.slug = { $ne: excludeSlug };
    }

    if (category) {
      filter.category = category;
    }

    if (featured === "true") {
      filter.isFeatured = true;
    }

    if (artisanParam) {
      const artisan = await Artisan.findOne({
        $or: [{ slug: artisanParam }, { _id: artisanParam }],
      }).lean();

      if (!artisan) {
        return apiSuccess([]);
      }
      filter.artisan = artisan._id;
    }

    let sortKey: Record<string, 1 | -1> = { createdAt: -1 };
    if (sortParam === "hours") {
      sortKey = { hoursToCreate: -1 };
    } else if (sortParam === "price-asc") {
      sortKey = { "price.INR": 1 };
    } else if (sortParam === "price-desc") {
      sortKey = { "price.INR": -1 };
    }

    let query = Product.find(filter)
      .populate("artisan", "name slug profilePhoto generation")
      .sort(sortKey);

    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    if (limit && !Number.isNaN(limit)) {
      query = query.limit(limit);
    }

    const products = await query.lean();

    return apiSuccess(products);
  } catch (error) {
    console.error("GET /api/products:", error);
    return apiError("Failed to fetch products", 500);
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    await connectDB();
    const body = await parseRequestBody(request);

    const title = asString(body.title);
    const artisanId = asString(body.artisan);
    const category = asString(body.category);
    const story = asString(body.story);
    const hoursToCreate = asNumber(body.hoursToCreate);
    const rawMaterialGrams = asNumber(body.rawMaterialGrams);
    const weight = asNumber(body.weight);
    const priceInr = asNumber(
      (body.price as Record<string, unknown> | undefined)?.INR ??
        body.priceINR
    );
    const priceUsd = asNumber(
      (body.price as Record<string, unknown> | undefined)?.USD ??
        body.priceUSD
    );

    const dimensionsRaw = body.dimensions as Record<string, unknown> | undefined;
    const height = asNumber(dimensionsRaw?.height ?? body.height);
    const width = asNumber(dimensionsRaw?.width ?? body.width);
    const depth = asNumber(dimensionsRaw?.depth ?? body.depth);

    if (
      !title ||
      !artisanId ||
      !category ||
      !story ||
      hoursToCreate === undefined ||
      rawMaterialGrams === undefined ||
      !height ||
      !width ||
      !depth ||
      weight === undefined ||
      priceInr === undefined ||
      priceUsd === undefined
    ) {
      return apiError(
        "Required: title, artisan, category, story, hoursToCreate, rawMaterialGrams, dimensions (height, width, depth), weight, price (INR, USD)",
        400
      );
    }

    if (
      !Object.values(ProductCategory).includes(
        category as (typeof ProductCategory)[keyof typeof ProductCategory]
      )
    ) {
      return apiError("Invalid product category", 400);
    }

    const artisan = await Artisan.findOne({
      $or: [{ _id: artisanId }, { slug: artisanId }],
    }).lean();

    if (!artisan) {
      return apiError("Artisan not found", 400);
    }

    const slug = asString(body.slug) ?? slugify(title);
    const existing = await Product.findOne({ slug }).lean();
    if (existing) {
      return apiError("A product with this slug already exists", 409);
    }

    const product = await Product.create({
      title,
      slug,
      artisan: artisan._id,
      category,
      story,
      hoursToCreate,
      rawMaterialGrams,
      dimensions: {
        height,
        width,
        depth,
        unit: asString(dimensionsRaw?.unit) === "in" ? "in" : "cm",
      },
      weight,
      price: { INR: priceInr, USD: priceUsd },
      photos: asStringArray(body.photos),
      process: Array.isArray(body.process) ? body.process : [],
      isOneOfAKind: body.isOneOfAKind !== false && body.isOneOfAKind !== "false",
      editionSize: asNumber(body.editionSize),
      status: asString(body.status) ?? ProductStatus.AVAILABLE,
      shipsFrom: asString(body.shipsFrom) ?? "Rewa, Madhya Pradesh",
      isFeatured: body.isFeatured === true || body.isFeatured === "true",
    });

    const populated = await Product.findById(product._id)
      .populate("artisan", "name slug profilePhoto")
      .lean();

    return apiSuccess(populated, 201);
  } catch (error) {
    console.error("POST /api/products:", error);
    return apiError("Failed to create product", 500);
  }
}
