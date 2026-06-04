import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { message: "Submit commission — Phase 2" },
    { status: 501 }
  );
}
