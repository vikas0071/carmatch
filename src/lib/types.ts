import { z } from "zod";

// Quiz answer schemas
export const QuizAnswersSchema = z.object({
  budget: z.enum(["5-8", "8-12", "12-18", "18-25", "25-35"]),
  usage: z.enum(["city", "highway", "mixed", "offroad"]),
  fuelType: z.enum(["petrol", "diesel", "electric", "cng", "no_preference"]),
  bodyType: z.enum(["hatchback", "sedan", "suv", "muv", "no_preference"]),
  priority: z.enum(["mileage", "safety", "space", "features", "performance"]),
});

export type QuizAnswers = z.infer<typeof QuizAnswersSchema>;

// Car type matching Prisma model
export interface Car {
  id: number;
  make: string;
  model: string;
  variant: string;
  year: number;
  priceLakh: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  mileageKmpl: number;
  engineCc: number;
  seats: number;
  safetyRating: number;
  features: string; // JSON string array
  pros: string; // JSON string array
  cons: string; // JSON string array
  summary: string;
}

// Parsed car for display
export interface CarDisplay {
  id: number;
  make: string;
  model: string;
  variant: string;
  year: number;
  priceLakh: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  mileageKmpl: number;
  engineCc: number;
  seats: number;
  safetyRating: number;
  features: string[];
  pros: string[];
  cons: string[];
  summary: string;
}

// AI recommendation response
export interface Recommendation {
  carId: number;
  matchScore: number;
  reason: string;
  highlights: string[];
}

export interface RecommendationResponse {
  recommendations: Recommendation[];
}

export interface RecommendedCar extends CarDisplay {
  matchScore: number;
  reason: string;
  highlights: string[];
}

// Chat types
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Quiz question config
export interface QuizQuestion {
  id: keyof QuizAnswers;
  title: string;
  subtitle: string;
  options: {
    value: string;
    label: string;
    emoji: string;
    description: string;
  }[];
}
