import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Commission from "@/models/Commission";
import Artisan from "@/models/Artisan";
import { ProductStatus } from "@/types";

export interface ImpactStats {
  totalProducts: number;
  availableProducts: number;
  totalOrders: number;
  countries: string[];
  totalCommissions: number;
  activeArtisans: number;
}

export async function getImpactStats(): Promise<ImpactStats> {
  await connectDB();

  const [
    totalProducts,
    availableProducts,
    totalOrders,
    orders,
    totalCommissions,
    activeArtisans,
  ] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ status: ProductStatus.AVAILABLE }),
    Order.countDocuments(),
    Order.find({}, "shippingAddress.country").lean(),
    Commission.countDocuments(),
    Artisan.countDocuments({ isActive: true }),
  ]);

  const countries = Array.from(
    new Set(
      orders
        .map((o) => o.shippingAddress?.country)
        .filter((c): c is string => Boolean(c))
    )
  );

  return {
    totalProducts,
    availableProducts,
    totalOrders,
    countries,
    totalCommissions,
    activeArtisans,
  };
}
