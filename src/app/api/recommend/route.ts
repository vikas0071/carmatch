import { NextRequest, NextResponse } from "next/server";
import { QuizAnswersSchema } from "@/lib/types";
import { getAllCars, getCarsByIds, getCarsAsContextString } from "@/lib/cars";
import { getRecommendations } from "@/lib/ai";
import { getFallbackRecommendations } from "@/lib/fallback-recommendations";

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

    let results;
    try {
      // Get AI recommendations
      const aiResponse = await getRecommendations(answers, carsContext);

      // Fetch full car data for recommended cars
      const carIds = aiResponse.recommendations.map((r) => r.carId);
      const cars = await getCarsByIds(carIds);

      // Join AI reasoning with car data
      results = aiResponse.recommendations.map((rec) => {
        const car = cars.find((c) => c.id === rec.carId);
        if (!car) return null;
        return {
          ...car,
          matchScore: rec.matchScore,
          reason: rec.reason,
          highlights: rec.highlights,
        };
      }).filter(Boolean);
    } catch (aiError) {
      console.warn("AI recommendation failed, falling back to local matching engine:", aiError);
      
      const fallbackResponse = getFallbackRecommendations(answers, allCars);
      const carIds = fallbackResponse.recommendations.map((r) => r.carId);
      const cars = await getCarsByIds(carIds);

      results = fallbackResponse.recommendations.map((rec) => {
        const car = cars.find((c) => c.id === rec.carId);
        if (!car) return null;
        return {
          ...car,
          matchScore: rec.matchScore,
          reason: rec.reason,
          highlights: rec.highlights,
        };
      }).filter(Boolean);
    }

    return NextResponse.json({ recommendations: results });
  } catch (error) {
    console.error("Recommendation error:", error);
    return NextResponse.json(
      { error: "Failed to get recommendations. Please try again." },
      { status: 500 }
    );
  }
}

