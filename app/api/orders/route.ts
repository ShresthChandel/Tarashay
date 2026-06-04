import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { message: "Create order — Phase 2" },
    { status: 501 }
  );
}
