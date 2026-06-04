import mongoose, { Schema, models, model } from "mongoose";
import { UserRole } from "@/types";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.BUYER,
    },
    country: { type: String },
    phone: { type: String },
    orderHistory: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        const obj = ret as Record<string, unknown>;
        delete obj.__v;
        delete obj.passwordHash;
        return obj;
      },
    },
  }
);

const User = models.User || model("User", UserSchema);

export default User;
