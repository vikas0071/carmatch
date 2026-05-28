import { QuizQuestion } from "./types";

export const quizQuestions: QuizQuestion[] = [
  {
    id: "budget",
    title: "What's your budget?",
    subtitle: "Select the price range you're comfortable with",
    options: [
      {
        value: "5-8",
        label: "₹5-8 Lakh",
        emoji: "💰",
        description: "Budget-friendly hatchbacks and entry cars",
      },
      {
        value: "8-12",
        label: "₹8-12 Lakh",
        emoji: "💵",
        description: "Mid-range hatchbacks and compact SUVs",
      },
      {
        value: "12-18",
        label: "₹12-18 Lakh",
        emoji: "💎",
        description: "Sedans, SUVs, and feature-rich options",
      },
      {
        value: "18-25",
        label: "₹18-25 Lakh",
        emoji: "🏆",
        description: "Premium SUVs and top-spec models",
      },
      {
        value: "25-35",
        label: "₹25-35 Lakh",
        emoji: "👑",
        description: "Luxury SUVs and premium EVs",
      },
    ],
  },
  {
    id: "usage",
    title: "How will you mostly use the car?",
    subtitle: "This helps us match the right driving characteristics",
    options: [
      {
        value: "city",
        label: "City Commute",
        emoji: "🏙️",
        description: "Daily office runs, school drops, city traffic",
      },
      {
        value: "highway",
        label: "Highway Cruiser",
        emoji: "🛣️",
        description: "Long drives, weekend getaways, intercity travel",
      },
      {
        value: "mixed",
        label: "Mixed Use",
        emoji: "🔄",
        description: "Balanced between city and highway driving",
      },
      {
        value: "offroad",
        label: "Off-road / Rough Roads",
        emoji: "⛰️",
        description: "Bad roads, mountains, unpaved terrain",
      },
    ],
  },
  {
    id: "fuelType",
    title: "Fuel preference?",
    subtitle: "Each fuel type has its own advantages",
    options: [
      {
        value: "petrol",
        label: "Petrol",
        emoji: "⛽",
        description: "Smooth, refined, lower upfront cost",
      },
      {
        value: "diesel",
        label: "Diesel",
        emoji: "🛢️",
        description: "Great mileage, torquey, ideal for high usage",
      },
      {
        value: "electric",
        label: "Electric",
        emoji: "⚡",
        description: "Zero emissions, lowest running cost",
      },
      {
        value: "cng",
        label: "CNG",
        emoji: "🌿",
        description: "Ultra-low running cost, eco-friendly",
      },
      {
        value: "no_preference",
        label: "No Preference",
        emoji: "🤷",
        description: "Open to any fuel type",
      },
    ],
  },
  {
    id: "bodyType",
    title: "What type of car do you prefer?",
    subtitle: "Pick the body style that fits your lifestyle",
    options: [
      {
        value: "hatchback",
        label: "Hatchback",
        emoji: "🚗",
        description: "Compact, easy to park, great for cities",
      },
      {
        value: "sedan",
        label: "Sedan",
        emoji: "🚘",
        description: "Spacious, comfortable, premium feel",
      },
      {
        value: "suv",
        label: "SUV",
        emoji: "🚙",
        description: "High ground clearance, road presence, versatile",
      },
      {
        value: "muv",
        label: "MUV / MPV",
        emoji: "🚐",
        description: "Maximum space, 7 seats, family-first",
      },
      {
        value: "no_preference",
        label: "No Preference",
        emoji: "🤷",
        description: "Open to any body type",
      },
    ],
  },
  {
    id: "priority",
    title: "What matters most to you?",
    subtitle: "We'll prioritize cars that excel in your top priority",
    options: [
      {
        value: "mileage",
        label: "Fuel Efficiency",
        emoji: "📊",
        description: "Low running cost and great mileage",
      },
      {
        value: "safety",
        label: "Safety First",
        emoji: "🛡️",
        description: "High safety rating, ADAS, airbags",
      },
      {
        value: "space",
        label: "Space & Comfort",
        emoji: "🛋️",
        description: "Roomy cabin, boot space, ride comfort",
      },
      {
        value: "features",
        label: "Tech & Features",
        emoji: "📱",
        description: "Sunroof, touchscreen, connected car tech",
      },
      {
        value: "performance",
        label: "Performance",
        emoji: "🏎️",
        description: "Powerful engine, fun to drive, highway stability",
      },
    ],
  },
];
