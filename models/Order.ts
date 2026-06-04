import mongoose, { Schema, models, model } from "mongoose";
import {
  Currency,
  OrderStatus,
  PaymentMethod,
} from "@/types";

const OrderLineItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const ShippingAddressSchema = new Schema(
  {
    name: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [OrderLineItemSchema],
    totalINR: { type: Number, required: true },
    totalUSD: { type: Number, required: true },
    currency: { type: String, enum: Object.values(Currency), required: true },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    paymentId: { type: String },
    paymentStatus: { type: String, default: "pending" },
    shippingAddress: { type: ShippingAddressSchema, required: true },
    orderStatus: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    trackingId: { type: String },
    shippingPartner: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        const obj = ret as Record<string, unknown>;
        delete obj.__v;
        return obj;
      },
    },
  }
);

const Order = models.Order || model("Order", OrderSchema);

export default Order;
