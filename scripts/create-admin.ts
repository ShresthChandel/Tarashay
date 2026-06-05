/**
 * Create an admin user for API testing:
 * npm run create-admin -- admin@tarashay.local yourpassword "Admin Name"
 */
import "../lib/load-env";
import bcrypt from "bcryptjs";
import connectDB from "../lib/mongodb";
import User from "../models/User";
import { UserRole } from "../types";

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] ?? "Admin";

  if (!email || !password) {
    console.error("Usage: npx tsx scripts/create-admin.ts <email> <password> [name]");
    process.exit(1);
  }

  await connectDB();

  const existing = await User.findOne({ email }).lean();
  if (existing) {
    console.error("User already exists:", email);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({
    name,
    email,
    passwordHash,
    role: UserRole.ADMIN,
    orderHistory: [],
    wishlist: [],
  });

  console.log("Admin user created:", email);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
