/**
 * Manual seed script — run after configuring MONGODB_URI:
 * npm run seed
 *
 * Seeds artisans and products matching lib/placeholders/home.ts
 */

import "../lib/load-env";
import connectDB from "../lib/mongodb";
import Artisan from "../models/Artisan";
import Product from "../models/Product";
import { ProductCategory, ProductStatus } from "../types";

async function seed() {
  await connectDB();

  await Artisan.deleteMany({});
  await Product.deleteMany({});

  const artisans = await Artisan.insertMany([
    {
      name: "Rajesh Kunder",
      slug: "rajesh-kunder",
      generation: 4,
      specialization: "Ganesh idols & temple sets",
      bio: "Fourth generation artisan carrying forward royal court techniques.",
      story: "Learned carving from his father at age twelve in the Rewa workshop.",
      yearsExperience: 32,
      totalPiecesCreated: 240,
      profilePhoto: "/placeholder.svg",
      workshopPhotos: ["/placeholder.svg"],
      awardsWon: ["State Handicraft Recognition"],
      featuredIn: ["Regional craft archives"],
      isActive: true,
    },
    {
      name: "Suresh Kunder",
      slug: "suresh-kunder",
      generation: 4,
      specialization: "Decorative supari sculpture",
      bio: "Specialist in decorative and ceremonial pieces.",
      story: "Known for intricate floral motifs on areca nut surfaces.",
      yearsExperience: 28,
      totalPiecesCreated: 190,
      profilePhoto: "/placeholder.svg",
      workshopPhotos: ["/placeholder.svg"],
      awardsWon: [],
      featuredIn: [],
      isActive: true,
    },
    {
      name: "Vijay Kunder",
      slug: "vijay-kunder",
      generation: 3,
      specialization: "Royal court reproductions",
      bio: "Third generation master who witnessed the Indira Gandhi commission era.",
      story: "Preserves walking stick and sindoordan traditions from the maharaja period.",
      yearsExperience: 45,
      totalPiecesCreated: 410,
      profilePhoto: "/placeholder.svg",
      workshopPhotos: ["/placeholder.svg"],
      awardsWon: ["Royal Court Artisan Heritage"],
      featuredIn: ["1968 state gift documentation"],
      isActive: true,
    },
  ]);

  const [rajesh, suresh, vijay] = artisans;

  await Product.insertMany([
    {
      title: "Maharaja Court Ganesh",
      slug: "maharaja-court-ganesh",
      artisan: rajesh._id,
      category: ProductCategory.GANESH_IDOL,
      story: "A Ganesh idol carved in the style commissioned for Rewa's royal court.",
      hoursToCreate: 180,
      rawMaterialGrams: 850,
      process: [
        { step: 1, description: "Select and season raw supari", photo: "/placeholder.svg" },
        { step: 2, description: "Rough form with traditional hand tools", photo: "/placeholder.svg" },
      ],
      dimensions: { height: 28, width: 18, depth: 14, unit: "cm" },
      weight: 420,
      price: { INR: 45000, USD: 540 },
      photos: ["/placeholder.svg"],
      isOneOfAKind: true,
      status: ProductStatus.AVAILABLE,
      isFeatured: true,
    },
    {
      title: "Rewa Temple Miniature Set",
      slug: "rewa-temple-miniature-set",
      artisan: suresh._id,
      category: ProductCategory.TEMPLE_SET,
      story: "Miniature temple architecture rendered entirely in areca nut.",
      hoursToCreate: 320,
      rawMaterialGrams: 2200,
      process: [{ step: 1, description: "Architectural layout on seasoned supari blocks" }],
      dimensions: { height: 35, width: 45, depth: 30, unit: "cm" },
      weight: 980,
      price: { INR: 85000, USD: 1020 },
      photos: ["/placeholder.svg"],
      isOneOfAKind: true,
      status: ProductStatus.AVAILABLE,
      isFeatured: true,
    },
    {
      title: "Heritage Walking Stick",
      slug: "heritage-walking-stick",
      artisan: vijay._id,
      category: ProductCategory.WALKING_STICK,
      story: "In the tradition of the piece rewarded ₹51 by Maharaja Martand Singh.",
      hoursToCreate: 95,
      rawMaterialGrams: 600,
      process: [{ step: 1, description: "Single-piece supari shaft carving" }],
      dimensions: { height: 92, width: 4, depth: 4, unit: "cm" },
      weight: 310,
      price: { INR: 28000, USD: 336 },
      photos: ["/placeholder.svg"],
      isOneOfAKind: true,
      status: ProductStatus.AVAILABLE,
      isFeatured: true,
    },
    {
      title: "Royal Sindoordan Box",
      slug: "royal-sindoordan-box",
      artisan: rajesh._id,
      category: ProductCategory.SINDOORDAN,
      story: "Ceremonial sindoordan echoing the piece made for Maharaja Gulab Singh.",
      hoursToCreate: 140,
      rawMaterialGrams: 400,
      process: [{ step: 1, description: "Hollow form and lid fitment" }],
      dimensions: { height: 12, width: 18, depth: 12, unit: "cm" },
      weight: 180,
      price: { INR: 38000, USD: 456 },
      photos: ["/placeholder.svg"],
      isOneOfAKind: true,
      status: ProductStatus.RESERVED,
      isFeatured: true,
    },
  ]);

  console.log("Seed complete: 3 artisans, 4 products");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
