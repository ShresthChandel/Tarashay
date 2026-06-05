export const dynamic = "force-dynamic";

import connectDB from "@/lib/mongodb";
import Commission from "@/models/Commission";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const ref = searchParams.get("ref");

    if (ref) {
      const commission = await Commission.findOne({ referenceNumber: ref })
        .populate("assignedArtisan", "name slug profilePhoto generation")
        .lean();

      if (!commission) {
        return apiError("Commission not found", 404);
      }
      return apiSuccess(commission);
    }

    if (email) {
      const commissions = await Commission.find({
        "buyerContact.email": {
          $regex: new RegExp(`^${email.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
        },
      })
        .populate("assignedArtisan", "name slug profilePhoto generation")
        .sort({ createdAt: -1 })
        .lean();

      return apiSuccess(commissions);
    }

    return apiError("Provide email or ref query parameter", 400);
  } catch (error) {
    console.error("GET /api/commissions/track:", error);
    return apiError("Failed to track commission", 500);
  }
}
