import { NextRequest, NextResponse } from "next/server";
import { QuizAnswersSchema } from "@/lib/types";
import { getAllCars, getCarsByIds, getCarsAsContextString } from "@/lib/cars";
import { getRecommendations } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const parseResult = QuizAnswersSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid quiz answers", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const answers = parseResult.data;

    // Get all cars for AI context
    const allCars = await getAllCars();
    const carsContext = getCarsAsContextString(allCars);

    // Get AI recommendations
    const aiResponse = await getRecommendations(answers, carsContext);

    // Fetch full car data for recommended cars
    const carIds = aiResponse.recommendations.map((r) => r.carId);
    const cars = await getCarsByIds(carIds);

    // Join AI reasoning with car data
    const results = aiResponse.recommendations.map((rec) => {
      const car = cars.find((c) => c.id === rec.carId);
      if (!car) return null;
      return {
        ...car,
        matchScore: rec.matchScore,
        reason: rec.reason,
        highlights: rec.highlights,
      };
    }).filter(Boolean);

    return NextResponse.json({ recommendations: results });
  } catch (error) {
    console.error("Recommendation error:", error);
    return NextResponse.json(
      { error: "Failed to get recommendations. Please try again." },
      { status: 500 }
    );
  }
}
