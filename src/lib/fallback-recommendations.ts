import { QuizAnswers, RecommendationResponse, CarDisplay } from "./types";

/**
 * Fallback recommendation engine that works without Claude API.
 * Uses rule-based scoring to match cars to user preferences.
 */
export function getFallbackRecommendations(
  answers: QuizAnswers,
  cars: CarDisplay[]
): RecommendationResponse {
  const budgetRange = getBudgetRange(answers.budget);

  const scored = cars.map((car) => {
    let score = 0;
    const reasons: string[] = [];
    const highlights: string[] = [];

    // Budget fit (0-30 points)
    if (car.priceLakh >= budgetRange.min && car.priceLakh <= budgetRange.max) {
      score += 30;
      reasons.push(`Fits well within your ₹${budgetRange.min}-${budgetRange.max}L budget at ₹${car.priceLakh}L`);
    } else if (car.priceLakh < budgetRange.min) {
      score += 20;
      reasons.push(`Under budget at ₹${car.priceLakh}L — leaves room for accessories`);
    } else if (car.priceLakh <= budgetRange.max * 1.1) {
      score += 10;
      reasons.push(`Slightly above budget at ₹${car.priceLakh}L but worth considering`);
    } else {
      return null; // Skip cars way outside budget
    }

    // Fuel type match (0-15 points)
    if (answers.fuelType !== "no_preference") {
      if (car.fuelType.toLowerCase() === answers.fuelType.toLowerCase()) {
        score += 15;
        highlights.push(`${car.fuelType} — your preferred fuel type`);
      }
    } else {
      score += 10;
    }

    // Body type match (0-15 points)
    if (answers.bodyType !== "no_preference") {
      if (car.bodyType.toLowerCase() === answers.bodyType.toLowerCase()) {
        score += 15;
        highlights.push(`${car.bodyType} body type`);
      }
    } else {
      score += 10;
    }

    // Usage match (0-15 points)
    switch (answers.usage) {
      case "city":
        if (car.mileageKmpl >= 18) {
          score += 10;
          highlights.push("Great city mileage");
        }
        if (car.bodyType === "Hatchback" || car.transmission === "Automatic") {
          score += 5;
        }
        break;
      case "highway":
        if (car.engineCc >= 1400) {
          score += 10;
          highlights.push("Powerful highway cruiser");
        }
        if (car.safetyRating >= 4) score += 5;
        break;
      case "mixed":
        score += 8;
        if (car.mileageKmpl >= 15 && car.engineCc >= 1200) {
          score += 7;
          highlights.push("Balanced for city & highway");
        }
        break;
      case "offroad":
        if (car.bodyType === "SUV") {
          score += 10;
          highlights.push("SUV with good ground clearance");
        }
        if (car.engineCc >= 1500) score += 5;
        break;
    }

    // Priority match (0-25 points)
    switch (answers.priority) {
      case "mileage":
        if (car.mileageKmpl >= 20) {
          score += 25;
          highlights.push(`${car.mileageKmpl} km/l — excellent mileage`);
          reasons.push(`With ${car.mileageKmpl} km/l, this delivers outstanding fuel efficiency that keeps your running costs low`);
        } else if (car.mileageKmpl >= 15) {
          score += 15;
          highlights.push(`${car.mileageKmpl} km/l mileage`);
        }
        break;
      case "safety":
        if (car.safetyRating >= 5) {
          score += 25;
          highlights.push("5-star safety rating");
          reasons.push("With a 5-star safety rating and advanced safety features, this car prioritizes your family's protection");
        } else if (car.safetyRating >= 4) {
          score += 18;
          highlights.push(`${car.safetyRating}-star safety`);
        }
        break;
      case "space":
        if (car.seats >= 7) {
          score += 25;
          highlights.push(`${car.seats}-seater — maximum space`);
          reasons.push(`With ${car.seats} seats and a spacious cabin, this car is perfect for families who need room`);
        } else if (car.bodyType === "SUV" || car.bodyType === "MUV") {
          score += 18;
          highlights.push("Spacious cabin");
        }
        break;
      case "features":
        if (car.features.length >= 6) {
          score += 25;
          const featureNames = car.features.slice(0, 3).map(f => f.replace(/_/g, " "));
          highlights.push(`Loaded with ${featureNames.join(", ")}`);
          reasons.push(`Packed with ${car.features.length} premium features including ${featureNames.join(", ")} — the most tech-forward option`);
        } else if (car.features.length >= 4) {
          score += 15;
          highlights.push("Well-equipped");
        }
        break;
      case "performance":
        if (car.engineCc >= 1500) {
          score += 25;
          highlights.push(`${car.engineCc}cc powerful engine`);
          reasons.push(`The ${car.engineCc}cc engine delivers strong performance whether you're overtaking on highways or navigating hilly terrain`);
        } else if (car.engineCc >= 1200) {
          score += 15;
          highlights.push("Peppy engine");
        }
        break;
    }

    // Bonus points
    if (car.safetyRating >= 5) score += 3;
    if (car.pros.length >= 3) {
      highlights.push(car.pros[0]);
    }

    // Build the reason string
    const reasonText = reasons.length > 0
      ? reasons.join(". ") + ". " + car.summary
      : car.summary + " " + (car.pros.length > 0 ? car.pros.join(". ") + "." : "");

    return {
      car,
      score: Math.min(score, 98),
      reason: reasonText,
      highlights: highlights.slice(0, 4),
    };
  }).filter(Boolean);

  // Sort by score and take top 3
  scored.sort((a, b) => b!.score - a!.score);
  const top3 = scored.slice(0, 3);

  return {
    recommendations: top3.map((item) => ({
      carId: item!.car.id,
      matchScore: item!.score,
      reason: item!.reason,
      highlights: item!.highlights,
    })),
  };
}

function getBudgetRange(budget: string): { min: number; max: number } {
  const ranges: Record<string, { min: number; max: number }> = {
    "5-8": { min: 4, max: 8.5 },
    "8-12": { min: 7, max: 13 },
    "12-18": { min: 10, max: 19 },
    "18-25": { min: 16, max: 26 },
    "25-35": { min: 22, max: 36 },
  };
  return ranges[budget] || { min: 5, max: 35 };
}
