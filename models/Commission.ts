import mongoose, { Schema, models, model } from "mongoose";
import { CommissionStatus, Currency } from "@/types";

const BuyerContactSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const BudgetSchema = new Schema(
  {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    currency: { type: String, enum: Object.values(Currency), required: true },
  },
  { _id: false }
);

const ProgressUpdateSchema = new Schema(
  {
    status: {
      type: String,
      enum: Object.values(CommissionStatus),
      required: true,
    },
    note: { type: String, required: true },
    photo: { type: String },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const CommissionSchema = new Schema(
  {
    buyerContact: { type: BuyerContactSchema, required: true },
    description: { type: String, required: true },
    referenceImages: [{ type: String }],
    budget: { type: BudgetSchema, required: true },
    assignedArtisan: { type: Schema.Types.ObjectId, ref: "Artisan" },
    status: {
      type: String,
      enum: Object.values(CommissionStatus),
      default: CommissionStatus.RECEIVED,
    },
    progressUpdates: [ProgressUpdateSchema],
    quotedPrice: { type: Number },
    estimatedDelivery: { type: Date },
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

const Commission =
  models.Commission || model("Commission", CommissionSchema);

export default Commission;
