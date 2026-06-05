export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";
import { OrderStatus } from "@/types";
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
    const orderStatus = asString(body.orderStatus);
    if (
      orderStatus &&
      Object.values(OrderStatus).includes(orderStatus as OrderStatus)
    ) {
      update.orderStatus = orderStatus;
    }

    const trackingId = asString(body.trackingId);
    if (trackingId !== undefined) update.trackingId = trackingId;

    const shippingPartner = asString(body.shippingPartner);
    if (shippingPartner !== undefined) update.shippingPartner = shippingPartner;

    const order = await Order.findByIdAndUpdate(params.id, update, {
      new: true,
    })
      .populate("items.product", "title slug")
      .lean();

    if (!order) return apiError("Order not found", 404);
    return apiSuccess(order);
  } catch (error) {
    console.error(`PUT /api/orders/${params.id}:`, error);
    return apiError("Failed to update order", 500);
  }
}
