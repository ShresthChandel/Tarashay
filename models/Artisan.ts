import mongoose, { Schema, models, model } from "mongoose";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

const ArtisanSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    /** Kunder family generation — currently 4th generation artisans */
    generation: { type: Number, required: true },
    specialization: { type: String, required: true },
    bio: { type: String, required: true },
    story: { type: String, required: true },
    yearsExperience: { type: Number, required: true },
    totalPiecesCreated: { type: Number, required: true, default: 0 },
    profilePhoto: { type: String, required: true },
    workshopPhotos: [{ type: String }],
    profileVideo: { type: String },
    signatureProduct: { type: Schema.Types.ObjectId, ref: "Product" },
    awardsWon: [{ type: String }],
    featuredIn: [{ type: String }],
    isActive: { type: Boolean, default: true },
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

ArtisanSchema.pre("save", function () {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name);
  }
});

const Artisan =
  models.Artisan || model("Artisan", ArtisanSchema);

export default Artisan;
