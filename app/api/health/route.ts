import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  let db: "connected" | "disconnected" = "disconnected";

  try {
    await connectDB();
    db = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  } catch {
    db = "disconnected";
  }

  return Response.json({
    status: "ok",
    db,
    timestamp: new Date(),
  });
}
