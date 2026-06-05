export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import connectDB from "@/lib/mongodb";
import Artisan from "@/models/Artisan";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/slugify";
import {
  parseRequestBody,
  asString,
  asNumber,
  asStringArray,
} from "@/lib/parse-body";

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    if (all) {
      const auth = await requireAdmin();
      if (!auth.authorized) return auth.response;
    }

    const artisans = await Artisan.find(all ? {} : { isActive: true })
      .populate("signatureProduct")
      .sort({ generation: 1 })
      .lean();

    return apiSuccess(artisans);
  } catch (error) {
    console.error("GET /api/artisans:", error);
    return apiError("Failed to fetch artisans", 500);
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

    const name = asString(body.name);
    const specialization = asString(body.specialization);
    const bio = asString(body.bio);
    const generation = asNumber(body.generation);

    if (!name || !specialization || !bio || generation === undefined) {
      return apiError(
        "Required fields: name, specialization, bio, generation",
        400
      );
    }

    const slug = asString(body.slug) ?? slugify(name);
    const existing = await Artisan.findOne({ slug }).lean();
    if (existing) {
      return apiError("An artisan with this slug already exists", 409);
    }

    const artisan = await Artisan.create({
      name,
      slug,
      generation,
      specialization,
      bio,
      story: asString(body.story) ?? bio,
      yearsExperience: asNumber(body.yearsExperience) ?? 0,
      totalPiecesCreated: asNumber(body.totalPiecesCreated) ?? 0,
      profilePhoto: asString(body.profilePhoto) ?? "/placeholder.svg",
      workshopPhotos: asStringArray(body.workshopPhotos),
      profileVideo: asString(body.profileVideo),
      signatureProduct: asString(body.signatureProduct),
      awardsWon: asStringArray(body.awardsWon),
      featuredIn: asStringArray(body.featuredIn),
      isActive: body.isActive !== false && body.isActive !== "false",
    });

    const populated = await Artisan.findById(artisan._id)
      .populate("signatureProduct")
      .lean();

    return apiSuccess(populated, 201);
  } catch (error) {
    console.error("POST /api/artisans:", error);
    return apiError("Failed to create artisan", 500);
  }
}
