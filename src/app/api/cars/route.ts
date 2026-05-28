import { NextRequest, NextResponse } from "next/server";
import { getAllCars } from "@/lib/cars";

export async function GET(_request: NextRequest) {
  try {
    const cars = await getAllCars();
    return NextResponse.json({ cars });
  } catch (error) {
    console.error("Cars fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cars" },
      { status: 500 }
    );
  }
}
