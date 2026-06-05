import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { apiSuccess, apiError } from "@/lib/api-response";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { OrderStatus, ProductStatus } from "@/types";
import { parseRequestBody, asString } from "@/lib/parse-body";

function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): boolean {
  const body = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return expected === signature;
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await parseRequestBody(request);
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    const razorpaySignature = request.headers.get("x-razorpay-signature");
    const orderId = asString(body.orderId) ?? asString(body.mongoOrderId);
    const razorpayOrderId = asString(body.razorpay_order_id);
    const razorpayPaymentId = asString(body.razorpay_payment_id);
    const clientSignature = asString(body.razorpay_signature);

    if (razorpaySignature && webhookSecret) {
      const rawBody = JSON.stringify(body);
      const expected = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");
      if (expected !== razorpaySignature) {
        return apiError("Invalid webhook signature", 400);
      }
    } else if (
      razorpayOrderId &&
      razorpayPaymentId &&
      clientSignature &&
      keySecret
    ) {
      if (
        !verifyRazorpaySignature(
          razorpayOrderId,
          razorpayPaymentId,
          clientSignature,
          keySecret
        )
      ) {
        return apiError("Invalid payment signature", 400);
      }
    }

    let order;
    if (orderId) {
      order = await Order.findById(orderId);
    } else if (razorpayOrderId) {
      order = await Order.findOne({ razorpayOrderId });
    }

    if (!order) {
      return apiError("Order not found", 404);
    }

    if (order.paymentStatus === "paid") {
      return apiSuccess({ message: "Already processed" });
    }

    order.paymentStatus = "paid";
    order.paymentId = razorpayPaymentId ?? order.paymentId;
    order.orderStatus = OrderStatus.CONFIRMED;
    await order.save();

    const productIds = order.items.map(
      (i: { product: string }) => i.product
    );
    await Product.updateMany(
      { _id: { $in: productIds } },
      { status: ProductStatus.SOLD }
    );

    const email = order.guestEmail;
    const name = order.guestName ?? order.shippingAddress.name;
    if (email) {
      await sendOrderConfirmationEmail({
        to: email,
        name,
        orderId: String(order._id),
        totalINR: order.totalINR,
      });
    }

    return apiSuccess({ orderId: String(order._id), status: "paid" });
  } catch (error) {
    console.error("POST /api/webhooks/razorpay:", error);
    return apiError("Webhook processing failed", 500);
  }
}
