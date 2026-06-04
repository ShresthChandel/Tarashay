import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";
import {
  parseRequestBody,
  asString,
  asNumber,
  asStringArray,
} from "@/lib/parse-body";

interface RouteParams {
  params: { slug: string };
}

export async function GET(
  _request: Request,
  { params }: RouteParams
) {
  try {
    await connectDB();

    const product = await Product.findOneAndUpdate(
      { slug: params.slug },
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("artisan")
      .lean();

    if (!product) {
      return apiError("Product not found", 404);
    }

    return apiSuccess(product);
  } catch (error) {
    console.error(`GET /api/products/${params.slug}:`, error);
    return apiError("Failed to fetch product", 500);
  }
}

export async function PUT(
  request: Request,
  { params }: RouteParams
) {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    await connectDB();
    const body = await parseRequestBody(request);

    const update: Record<string, unknown> = {};

    const title = asString(body.title);
    if (title) update.title = title;
    const story = asString(body.story);
    if (story) update.story = story;
    const category = asString(body.category);
    if (category) update.category = category;
    const hoursToCreate = asNumber(body.hoursToCreate);
    if (hoursToCreate !== undefined) update.hoursToCreate = hoursToCreate;
    const rawMaterialGrams = asNumber(body.rawMaterialGrams);
    if (rawMaterialGrams !== undefined) {
      update.rawMaterialGrams = rawMaterialGrams;
    }
    const weight = asNumber(body.weight);
    if (weight !== undefined) update.weight = weight;
    const status = asString(body.status);
    if (status) update.status = status;

    if (body.price) {
      const price = body.price as Record<string, unknown>;
      const inr = asNumber(price.INR);
      const usd = asNumber(price.USD);
      if (inr !== undefined && usd !== undefined) {
        update.price = { INR: inr, USD: usd };
      }
    }

    const dimensionsRaw = body.dimensions as Record<string, unknown> | undefined;
    if (dimensionsRaw) {
      const height = asNumber(dimensionsRaw.height);
      const width = asNumber(dimensionsRaw.width);
      const depth = asNumber(dimensionsRaw.depth);
      if (height && width && depth) {
        update.dimensions = {
          height,
          width,
          depth,
          unit: asString(dimensionsRaw.unit) === "in" ? "in" : "cm",
        };
      }
    }

    if (body.photos !== undefined) {
      update.photos = asStringArray(body.photos);
    }
    if (body.process !== undefined && Array.isArray(body.process)) {
      update.process = body.process;
    }
    if (body.isFeatured !== undefined) {
      update.isFeatured = body.isFeatured === true || body.isFeatured === "true";
    }
    if (body.isOneOfAKind !== undefined) {
      update.isOneOfAKind =
        body.isOneOfAKind !== false && body.isOneOfAKind !== "false";
    }

    const product = await Product.findOneAndUpdate(
      { slug: params.slug },
      { $set: update },
      { new: true, runValidators: true }
    )
      .populate("artisan")
      .lean();

    if (!product) {
      return apiError("Product not found", 404);
    }

    return apiSuccess(product);
  } catch (error) {
    console.error(`PUT /api/products/${params.slug}:`, error);
    return apiError("Failed to update product", 500);
  }
}
