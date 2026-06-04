import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { message: "Stripe webhook — Phase 2" },
    { status: 501 }
  );
}
