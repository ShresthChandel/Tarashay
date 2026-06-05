import connectDB from "@/lib/mongodb";
import Commission from "@/models/Commission";
import Artisan from "@/models/Artisan";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";
import { generateCommissionReference } from "@/lib/reference";
import { sendCommissionConfirmationEmail } from "@/lib/email";
import { budgetFromOption, type BudgetOption } from "@/lib/commission-budget";
import { ProductCategory } from "@/types";
import { parseRequestBody, asString } from "@/lib/parse-body";

const VALID_CATEGORIES = [
  ...Object.values(ProductCategory),
  "something-new",
] as const;

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    await connectDB();
    const commissions = await Commission.find()
      .populate("assignedArtisan", "name slug profilePhoto")
      .sort({ createdAt: -1 })
      .lean();
    return apiSuccess(commissions);
  } catch (error) {
    console.error("GET /api/commissions:", error);
    return apiError("Failed to fetch commissions", 500);
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await parseRequestBody(request);

    const name = asString(body.name);
    const email = asString(body.email);
    const description = asString(body.description);
    const budgetOption = asString(body.budget) as BudgetOption | undefined;
    const phone = asString(body.phone) ?? "";
    const country = asString(body.country) ?? "India";
    const category = asString(body.category) ?? ProductCategory.CUSTOM;
    const howHeard = asString(body.howHeard);
    const artisanSlug = asString(body.preferredArtisan);

    if (!name || !email || !description || !budgetOption) {
      return apiError("Required: name, email, description, budget", 400);
    }

    if (description.length < 50) {
      return apiError("Please describe your vision in at least 50 characters", 400);
    }

    if (
      !VALID_CATEGORIES.includes(
        category as (typeof VALID_CATEGORIES)[number]
      )
    ) {
      return apiError("Invalid category", 400);
    }

    let referenceNumber = generateCommissionReference();
    let attempts = 0;
    while (attempts < 5) {
      const exists = await Commission.findOne({ referenceNumber }).lean();
      if (!exists) break;
      referenceNumber = generateCommissionReference();
      attempts++;
    }

    const budget = budgetFromOption(budgetOption);
    const referenceImages = Array.isArray(body.referenceImages)
      ? (body.referenceImages as string[]).slice(0, 3)
      : [];

    let assignedArtisan;
    if (artisanSlug && artisanSlug !== "auto") {
      const artisan = await Artisan.findOne({ slug: artisanSlug }).lean();
      if (artisan) assignedArtisan = artisan._id;
    }

    const commission = await Commission.create({
      referenceNumber,
      buyerContact: { name, email, phone, country },
      description,
      category,
      referenceImages,
      budget,
      howHeard,
      assignedArtisan,
    });

    await sendCommissionConfirmationEmail({
      to: email,
      name,
      referenceNumber,
      description,
    });

    return apiSuccess(
      {
        referenceNumber,
        commissionId: String(commission._id),
      },
      201
    );
  } catch (error) {
    console.error("POST /api/commissions:", error);
    return apiError("Failed to submit commission request", 500);
  }
}
