export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { apiSuccess, apiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";
import {
  Currency,
  OrderStatus,
  PaymentMethod,
  ProductStatus,
  type ShippingAddress,
} from "@/types";
import { parseRequestBody, asString } from "@/lib/parse-body";

interface CartItemPayload {
  productId: string;
  slug?: string;
  quantity: number;
}

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    await connectDB();
    const orders = await Order.find()
      .populate("items.product", "title slug photos")
      .sort({ createdAt: -1 })
      .lean();
    return apiSuccess(orders);
  } catch (error) {
    console.error("GET /api/orders:", error);
    return apiError("Failed to fetch orders", 500);
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await parseRequestBody(request);

    const items = body.items as CartItemPayload[] | undefined;
    const shipping = body.shippingAddress as ShippingAddress | undefined;
    const guestEmail = asString(body.guestEmail);
    const guestName = asString(body.guestName);
    const paymentMethod =
      (asString(body.paymentMethod) as PaymentMethod) ?? PaymentMethod.RAZORPAY;

    if (!items?.length || !shipping?.name || !shipping.line1 || !shipping.city) {
      return apiError("Items and shipping address required", 400);
    }

    const lineItems: {
      product: string;
      quantity: number;
      price: number;
    }[] = [];
    let totalINR = 0;
    let totalUSD = 0;

    for (const item of items) {
      const product = await Product.findOne({
        $or: [{ _id: item.productId }, { slug: item.slug ?? item.productId }],
        status: ProductStatus.AVAILABLE,
      }).lean();

      if (!product) {
        return apiError(
          `Product ${item.productId} is no longer available`,
          400
        );
      }

      lineItems.push({
        product: String(product._id),
        quantity: item.quantity,
        price: product.price.INR,
      });
      totalINR += product.price.INR * item.quantity;
      totalUSD += product.price.USD * item.quantity;
    }

    const currency =
      shipping.country === "India" ? Currency.INR : Currency.INR;

    const order = await Order.create({
      guestEmail,
      guestName,
      items: lineItems,
      totalINR,
      totalUSD,
      currency,
      paymentMethod,
      paymentStatus: "pending",
      shippingAddress: shipping,
      orderStatus: OrderStatus.PENDING,
    });

    await Product.updateMany(
      { _id: { $in: lineItems.map((i) => i.product) } },
      { status: ProductStatus.RESERVED }
    );

    let razorpayOrderId: string | undefined;
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (keyId && keySecret && paymentMethod === PaymentMethod.RAZORPAY) {
      try {
        const Razorpay = (await import("razorpay")).default;
        const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
        const rzpOrder = await rzp.orders.create({
          amount: totalINR * 100,
          currency: "INR",
          receipt: String(order._id),
        });
        razorpayOrderId = rzpOrder.id;
        order.razorpayOrderId = razorpayOrderId;
        await order.save();
      } catch (err) {
        console.warn("Razorpay not available:", err);
      }
    }

    return apiSuccess(
      {
        orderId: String(order._id),
        razorpayOrderId,
        razorpayKeyId: keyId ?? null,
        totalINR,
      },
      201
    );
  } catch (error) {
    console.error("POST /api/orders:", error);
    return apiError("Failed to create order", 500);
  }
}
