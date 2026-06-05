import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Commission from "@/models/Commission";
import Artisan from "@/models/Artisan";

export async function getAdminOverview() {
  await connectDB();

  const [products, orders, commissions, artisans, recentCommissions, recentOrders] =
    await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Commission.countDocuments(),
      Artisan.countDocuments({ isActive: true }),
      Commission.find()
        .select("referenceNumber buyerContact.name status createdAt")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Order.find()
        .select("_id orderStatus totalINR createdAt guestName")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

  return {
    counts: { products, orders, commissions, artisans },
    recentCommissions,
    recentOrders,
  };
}
