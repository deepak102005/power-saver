const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateTips(usageData, dorm) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            tips: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  text: { type: SchemaType.STRING },
                  estimatedSavingsKwh: { type: SchemaType.NUMBER }
                },
                required: ["text", "estimatedSavingsKwh"]
              }
            }
          },
          required: ["tips"]
        }
      }
    });

    const prompt = `
      You are an AI recommendation engine for PowerSaver, a gamified energy-saving platform for college students.
      The user lives in: ${dorm}.
      Here is their last 7 days of energy usage (in kWh): ${JSON.stringify(usageData)}.
      
      Analyze their usage patterns and provide 1 to 3 concrete, actionable tips to save energy in a college dorm setting.
      Provide realistic estimated kWh savings for each tip.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const data = JSON.parse(responseText);
    
    return data.tips || [];
  } catch (error) {
    console.error("AI Generation Error:", error);
    // Fallback tips in case of failure
    return [
      { text: "Turn off lights when leaving the room.", estimatedSavingsKwh: 0.5 },
      { text: "Unplug chargers when not in use.", estimatedSavingsKwh: 0.2 }
    ];
  }
}

async function chatWithAI(message, usageData, dorm) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are PowerSaver AI, a helpful energy-saving assistant for college students. The user lives in a ${dorm}. Recent usage: ${JSON.stringify(usageData)}. User says: "${message}". Keep your response friendly, concise, and helpful.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("AI Chat Error:", error);
    
    const lowerMsg = message.toLowerCase();
    
    const knowledgeBase = [
      { keywords: ["ac", "air conditioning", "cooling", "cool", "fan"], answer: "Setting your AC to 78°F (25°C) instead of 72°F can save up to 20% on cooling costs!" },
      { keywords: ["heat", "heater", "winter", "cold", "thermostat"], answer: "Lowering your thermostat by just 1 degree in winter can save 3% on your heating bill." },
      { keywords: ["fridge", "refrigerator", "freezer"], answer: "Keep your fridge at 37°F and freezer at 0°F. Also, a full freezer uses less energy than an empty one!" },
      { keywords: ["water", "shower", "bath"], answer: "Taking a 5-minute shower instead of a bath saves not just water, but the electricity used to heat it." },
      { keywords: ["tv", "television", "screen"], answer: "Modern LED TVs are efficient, but lowering the screen brightness can reduce their energy consumption by up to 20%." },
      { keywords: ["computer", "laptop", "pc"], answer: "Laptops use up to 80% less energy than desktop computers. Always use sleep mode when stepping away!" },
      { keywords: ["lights", "bulb", "led", "lighting"], answer: "Switching to LED bulbs uses 75% less energy and lasts 25 times longer than old incandescent lighting." },
      { keywords: ["laundry", "wash", "dryer", "clothes"], answer: "Washing clothes in cold water and air-drying them can save a massive amount of energy that normally goes into heating water." },
      { keywords: ["cook", "oven", "microwave", "food"], answer: "Microwaves use 50% less energy than conventional ovens. For small meals, definitely use the microwave!" },
      { keywords: ["standby", "vampire", "plug", "charger", "phone"], answer: "Vampire power (devices plugged in but not used) can account for 10% of your electricity bill. Unplug chargers!" },
      { keywords: ["hello", "hi", "hey"], answer: "Hello! I'm your PowerSaver AI. Ask me how to save energy on specific appliances or routines!" },
      { keywords: ["who are you", "what are you"], answer: "I'm the PowerSaver AI Assistant! I'm here to help you optimize your energy usage." },
      { keywords: ["goal", "target", "streak"], answer: "Setting a goal on your dashboard helps you stay accountable. Aim for a 5% reduction this week!" }
    ];

    let bestMatch = null;
    let maxMatches = 0;

    for (const item of knowledgeBase) {
      let matches = 0;
      for (const kw of item.keywords) {
        if (lowerMsg.includes(kw)) matches++;
      }
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = item.answer;
      }
    }

    if (bestMatch) {
      return bestMatch;
    }
    
    return `I see you're asking about "${message}". Since my advanced AI brain is currently offline (waiting for a valid AIzaSy API Key), I can't generate a specific answer for that. Try asking me about AC, heating, laundry, or lights!`;
  }
}

module.exports = { generateTips, chatWithAI };
