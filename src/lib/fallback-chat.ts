/**
 * Fallback chat responder that works offline without Anthropic API.
 * Parses user questions and generates highly specific, contextual answers about the recommended cars.
 */
export function getFallbackChatResponse(
  userMessage: string,
  context: string
): string {
  const query = userMessage.toLowerCase();
  
  // Parse key information about cars from the JSON context
  let cars: Array<{
    name: string;
    price: string;
    mileage: string;
    safety: string;
    engine: string;
    seats: string;
    pros: string[];
    cons: string[];
  }> = [];

  try {
    const parsedContext = JSON.parse(context);
    if (parsedContext && Array.isArray(parsedContext.recommendedCars)) {
      cars = parsedContext.recommendedCars.map((c: any) => {
        // Find corresponding full car specs or extract from description
        return {
          name: c.name || "Recommended Car",
          price: c.price ? `₹${c.price} Lakh` : "N/A",
          mileage: c.mileage ? `${c.mileage} km/l` : "N/A",
          safety: c.safety ? `${c.safety}-star rating` : "N/A",
          engine: c.engineCc ? `${c.engineCc} cc` : "N/A",
          seats: c.seats ? `${c.seats} seats` : "N/A",
          pros: Array.isArray(c.pros) ? c.pros : [],
          cons: Array.isArray(c.cons) ? c.cons : []
        };
      });
    }
  } catch (e) {
    console.error("Failed to parse JSON context in fallback-chat:", e);
  }

  // If no cars could be parsed dynamically, return a friendly helpful answer
  if (cars.length === 0) {
    return "That's a great question! All of your recommended cars are handpicked based on your preferences. Could you tell me which specific aspect (like mileage, space, safety, or performance) you'd like to compare further?";
  }

  const carNames = cars.map(c => c.name);

  // Helper to find a specific car by name in the query
  const mentionedCar = cars.find(c => query.includes(c.name.toLowerCase()));

  // 1. SAFETY QUERY
  if (query.includes("safety") || query.includes("safe") || query.includes("crash")) {
    const safetyRatings = cars.map(c => {
      const num = parseInt(c.safety) || 0;
      return { name: c.name, rating: num, text: c.safety };
    }).sort((a, b) => b.rating - a.rating);

    const safest = safetyRatings[0];
    
    let resp = `Safety is a top priority! Among your recommendations, the **${safest.name}** stands out with its excellent safety credentials (${safest.text}). `;
    
    if (safest.rating >= 5 || safest.text.includes("5")) {
      resp += `It offers peace of mind with robust crashworthiness, making it an excellent choice for highway drives and family trips.`;
    } else {
      resp += `It provides solid build quality and modern active safety features like dual airbags and ABS as standard.`;
    }

    if (cars.length > 1) {
      resp += `\n\nFor comparison:`;
      cars.forEach(c => {
        if (c.name !== safest.name) {
          resp += `\n- **${c.name}**: ${c.safety}`;
        }
      });
    }
    return resp;
  }

  // 2. MILEAGE / EFFICIENCY QUERY
  if (query.includes("mileage") || query.includes("efficient") || query.includes("fuel") || query.includes("average")) {
    const fuelDetails = cars.map(c => {
      const cleanMil = parseFloat(c.mileage.replace(/[^0-9.]/g, "")) || 0;
      return { name: c.name, mileageNum: cleanMil, text: c.mileage };
    }).sort((a, b) => b.mileageNum - a.mileageNum);

    const bestMileage = fuelDetails[0];
    
    let resp = `If you want to keep running costs to a minimum, the **${bestMileage.name}** is your best bet, delivering an outstanding **${bestMileage.text}**. `;
    
    if (bestMileage.mileageNum >= 20) {
      resp += `This is highly fuel-efficient and ideal for daily heavy bumper-to-bumper city commuting.`;
    } else {
      resp += `It provides a great balance of engine displacement and fuel efficiency.`;
    }

    if (cars.length > 1) {
      resp += `\n\nHere is how they compare in fuel efficiency:`;
      cars.forEach(c => {
        resp += `\n- **${c.name}**: ${c.mileage}`;
      });
    }
    return resp;
  }

  // 3. COMPARISON / VS / WHICH IS BETTER
  if (query.includes("vs") || query.includes("compare") || query.includes("better") || query.includes("versus")) {
    if (cars.length >= 2) {
      const car1 = cars[0];
      const car2 = cars[1];
      let resp = `Let's compare the **${car1.name}** and the **${car2.name}** side-by-side to help you choose:

1. **Price & Value**: The **${car1.name}** is priced at **${car1.price}**, while the **${car2.name}** is at **${car2.price}**. 
2. **Performance & Fuel**: The ${car1.name} delivers **${car1.mileage}**, compared to the ${car2.name}'s **${car2.mileage}**.
3. **Safety Profile**: The ${car1.name} has a **${car1.safety}**, whereas the ${car2.name} holds a **${car2.safety}**.

**Verdict**: Choose the **${car1.name}** if you value its balance of features. Go for the **${car2.name}** if you prefer its unique driving characteristics.`;
      return resp;
    }
  }

  // 4. PRICE / BUDGET
  if (query.includes("price") || query.includes("budget") || query.includes("cost") || query.includes("expensive") || query.includes("cheap")) {
    let resp = `Here is a quick look at the pricing breakdown of your options:

`;
    cars.forEach(c => {
      resp += `- **${c.name}**: **${c.price}**\n`;
    });
    
    // Find cheapest
    const sortedByPrice = [...cars].sort((a, b) => {
      const pA = parseFloat(a.price.replace(/[^0-9.]/g, "")) || 0;
      const pB = parseFloat(b.price.replace(/[^0-9.]/g, "")) || 0;
      return pA - pB;
    });
    
    resp += `\nThe most budget-friendly choice is the **${sortedByPrice[0].name}** at ${sortedByPrice[0].price}, which leaves plenty of headroom in your budget.`;
    return resp;
  }

  // 5. MENTIONED A SPECIFIC CAR
  if (mentionedCar) {
    let resp = `The **${mentionedCar.name}** is a phenomenal choice! Here is a focused summary of its key parameters:
- **Price**: ${mentionedCar.price}
- **Mileage**: ${mentionedCar.mileage}
- **Safety Profile**: ${mentionedCar.safety}

`;
    if (mentionedCar.pros && mentionedCar.pros.length > 0) {
      resp += `**Key Strengths:** ${mentionedCar.pros.join(", ")}\n`;
    }
    resp += `\nIt fits your requirements beautifully and is highly recommended if you like its overall style and features.`;
    return resp;
  }

  // 6. DEFAULT DYNAMIC RESPONSE
  const defaultResp = `That's a very practical question! Let's look at your recommendations: **${carNames.join(", ")}**.

- If you want the most **fuel-efficient** commute, go for the **${cars[0].name}** (${cars[0].mileage}).
- If **safety and highway stability** are your priority, the **${cars[0].name}** is exceptionally well-suited.
- If you'd like a breakdown of specific parameters like boot space, ground clearance, or transmission differences, just let me know!`;
  
  return defaultResp;
}
