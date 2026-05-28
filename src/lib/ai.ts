import Anthropic from "@anthropic-ai/sdk";
import { QuizAnswers, RecommendationResponse } from "./types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

const SYSTEM_PROMPT = `You are CarMatch AI, an expert Indian car buying advisor. You have deep knowledge of the Indian automobile market.

You will be given:
1. A complete database of cars available in India with their specs
2. A buyer's preferences from a quiz

Your job is to recommend exactly 3 cars that best match the buyer's needs. Consider:
- Budget fit (the car should be within or close to their budget range in lakhs)
- Usage pattern match (city cars need good mileage and compact size; highway cars need power and comfort; off-road needs ground clearance and build quality)
- Fuel preference (respect their choice, but if "no_preference", pick the best fuel type for their usage)
- Body type preference (respect their choice, but if "no_preference", recommend based on usage and budget)
- Priority alignment (if they want safety, prioritize high safety ratings; if mileage, prioritize fuel efficiency, etc.)

IMPORTANT: Return ONLY valid JSON in this exact format, no markdown, no explanation outside the JSON:
{
  "recommendations": [
    {
      "car_id": <number - the car's id from the database>,
      "match_score": <number 1-100 - how well it matches>,
      "reason": "<string - 2-3 sentences explaining WHY this car matches their needs, be specific and conversational>",
      "highlights": ["<string - 3-4 short highlight phrases like 'Best-in-class mileage' or '5-star safety rating'>"]
    }
  ]
}

Order by match_score descending (best match first). Be genuine and specific in your reasons — don't be generic.`;

function buildUserMessage(answers: QuizAnswers, carsContext: string): string {
  const budgetMap: Record<string, string> = {
    "5-8": "₹5-8 Lakh",
    "8-12": "₹8-12 Lakh",
    "12-18": "₹12-18 Lakh",
    "18-25": "₹18-25 Lakh",
    "25-35": "₹25-35 Lakh",
  };

  const usageMap: Record<string, string> = {
    city: "Mostly city driving (daily commute, traffic)",
    highway: "Mostly highway driving (long drives, intercity travel)",
    mixed: "Mixed city and highway usage",
    offroad: "Off-road and rough road driving",
  };

  const priorityMap: Record<string, string> = {
    mileage: "Fuel efficiency and low running costs",
    safety: "Safety features and crash rating",
    space: "Space, comfort, and ride quality",
    features: "Technology and premium features",
    performance: "Engine power and driving fun",
  };

  return `Here is the complete car database:
${carsContext}

Buyer's preferences:
- Budget: ${budgetMap[answers.budget]}
- Primary usage: ${usageMap[answers.usage]}
- Fuel preference: ${answers.fuelType === "no_preference" ? "No preference (open to any)" : answers.fuelType}
- Body type preference: ${answers.bodyType === "no_preference" ? "No preference (open to any)" : answers.bodyType}
- Top priority: ${priorityMap[answers.priority]}

Please recommend the top 3 cars for this buyer.`;
}

export async function getRecommendations(
  answers: QuizAnswers,
  carsContext: string
): Promise<RecommendationResponse> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: buildUserMessage(answers, carsContext),
      },
    ],
  });

  const textContent = message.content.find((c) => c.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text response from AI");
  }

  const parsed = JSON.parse(textContent.text) as RecommendationResponse;

  // Normalize the response
  return {
    recommendations: parsed.recommendations.map((r) => ({
      carId: r.car_id ?? (r as Record<string, unknown>).carId as number,
      matchScore: r.match_score ?? (r as Record<string, unknown>).matchScore as number,
      reason: r.reason,
      highlights: r.highlights,
    })),
  };
}

export async function chatWithAI(
  messages: { role: "user" | "assistant"; content: string }[],
  context: string
): Promise<string> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: `You are CarMatch AI, a helpful Indian car buying assistant. You're having a follow-up conversation with a buyer who just received car recommendations.

Here is the context of their quiz and recommended cars:
${context}

Be conversational, specific, and helpful. If they ask about comparisons, give clear opinions. If they ask about features, be detailed. Keep responses concise (2-3 paragraphs max).`,
    messages,
  });

  const textContent = response.content.find((c) => c.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text response from AI");
  }

  return textContent.text;
}
