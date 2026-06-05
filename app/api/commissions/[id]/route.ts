export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import connectDB from "@/lib/mongodb";
import Commission from "@/models/Commission";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";
import { sendCommissionProgressEmail } from "@/lib/email";
import { CommissionStatus } from "@/types";
import { parseRequestBody, asString } from "@/lib/parse-body";

interface RouteParams {
  params: { id: string };
}

export async function PUT(request: Request, { params }: RouteParams) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    await connectDB();
    const body = await parseRequestBody(request);

    const update: Record<string, unknown> = {};
    const status = asString(body.status);
    if (status && Object.values(CommissionStatus).includes(status as CommissionStatus)) {
      update.status = status;
    }

    const assignedArtisan = asString(body.assignedArtisan);
    if (assignedArtisan !== undefined) {
      update.assignedArtisan = assignedArtisan || null;
    }

    const progressNote = asString(body.progressNote);
    const progressPhoto = asString(body.progressPhoto);
    const progressStatus = asString(body.progressStatus) as CommissionStatus | undefined;

    let pushProgress = false;
    if (progressNote && progressStatus) {
      pushProgress = true;
    }

    const commission = await Commission.findById(params.id);
    if (!commission) {
      return apiError("Commission not found", 404);
    }

    if (Object.keys(update).length > 0) {
      Object.assign(commission, update);
    }

    if (pushProgress && progressStatus && progressNote) {
      commission.progressUpdates.push({
        status: progressStatus,
        note: progressNote,
        photo: progressPhoto,
        date: new Date(),
      });
      commission.status = progressStatus;
    }

    await commission.save();

    const populated = await Commission.findById(commission._id)
      .populate("assignedArtisan", "name slug profilePhoto")
      .lean();

    if (pushProgress && commission.buyerContact.email) {
      await sendCommissionProgressEmail({
        to: commission.buyerContact.email,
        name: commission.buyerContact.name,
        referenceNumber: commission.referenceNumber,
        status: progressStatus ?? commission.status,
        note: progressNote!,
        photo: progressPhoto,
      });
    }

    return apiSuccess(populated);
  } catch (error) {
    console.error(`PUT /api/commissions/${params.id}:`, error);
    return apiError("Failed to update commission", 500);
  }
}
