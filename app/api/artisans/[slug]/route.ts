import connectDB from "@/lib/mongodb";
import Artisan from "@/models/Artisan";
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

    const artisan = await Artisan.findOne({
      slug: params.slug,
      isActive: true,
    })
      .populate("signatureProduct")
      .lean();

    if (!artisan) {
      return apiError("Artisan not found", 404);
    }

    // Increment views on signature product when present
    if (artisan.signatureProduct && typeof artisan.signatureProduct === "object") {
      const productId = (artisan.signatureProduct as { _id?: unknown })._id;
      if (productId) {
        await Product.findByIdAndUpdate(productId, { $inc: { views: 1 } });
      }
    }

    return apiSuccess(artisan);
  } catch (error) {
    console.error(`GET /api/artisans/${params.slug}:`, error);
    return apiError("Failed to fetch artisan", 500);
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

    const name = asString(body.name);
    if (name) update.name = name;
    const specialization = asString(body.specialization);
    if (specialization) update.specialization = specialization;
    const bio = asString(body.bio);
    if (bio) update.bio = bio;
    const story = asString(body.story);
    if (story) update.story = story;
    const generation = asNumber(body.generation);
    if (generation !== undefined) update.generation = generation;
    const yearsExperience = asNumber(body.yearsExperience);
    if (yearsExperience !== undefined) update.yearsExperience = yearsExperience;
    const totalPiecesCreated = asNumber(body.totalPiecesCreated);
    if (totalPiecesCreated !== undefined) {
      update.totalPiecesCreated = totalPiecesCreated;
    }
    const profilePhoto = asString(body.profilePhoto);
    if (profilePhoto) update.profilePhoto = profilePhoto;
    const profileVideo = asString(body.profileVideo);
    if (profileVideo !== undefined) update.profileVideo = profileVideo;
    if (body.workshopPhotos !== undefined) {
      update.workshopPhotos = asStringArray(body.workshopPhotos);
    }
    if (body.awardsWon !== undefined) {
      update.awardsWon = asStringArray(body.awardsWon);
    }
    if (body.featuredIn !== undefined) {
      update.featuredIn = asStringArray(body.featuredIn);
    }
    if (body.signatureProduct !== undefined) {
      update.signatureProduct = asString(body.signatureProduct) || null;
    }
    if (body.isActive !== undefined) {
      update.isActive = body.isActive !== false && body.isActive !== "false";
    }

    const artisan = await Artisan.findOneAndUpdate(
      { slug: params.slug },
      { $set: update },
      { new: true, runValidators: true }
    )
      .populate("signatureProduct")
      .lean();

    if (!artisan) {
      return apiError("Artisan not found", 404);
    }

    return apiSuccess(artisan);
  } catch (error) {
    console.error(`PUT /api/artisans/${params.slug}:`, error);
    return apiError("Failed to update artisan", 500);
  }
}
