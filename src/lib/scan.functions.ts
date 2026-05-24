import { createServerFn } from "@tanstack/react-start";

export type ScanMode = "food" | "menu" | "recipe";
type ScanInput = { imageDataUrl: string; goal: string; mode?: ScanMode };

export type ScanOutput = {
  food_name: string;
  confidence: string;
  calories_kcal: number;
  sugar_g: number;
  carbs_g: number;
  protein_g: number;
  fiber_g: number;
  salt_level: string;
  sugar_cubes: number;
  carb_impact: string;
  health_score: number;
  recommendation: string;
  notes: string;
};

export const analyzeFood = createServerFn({ method: "POST" })
  .inputValidator((data: ScanInput) => {
    if (!data || typeof data.imageDataUrl !== "string" || !data.imageDataUrl.startsWith("data:image/")) {
      throw new Error("Invalid image");
    }
    if (data.imageDataUrl.length > 8_000_000) {
      throw new Error("Image too large (max ~6MB)");
    }
    const goal = typeof data.goal === "string" && data.goal.length < 80 ? data.goal : "Healthier choices overall";
    const mode: ScanMode = data.mode === "menu" || data.mode === "recipe" ? data.mode : "food";
    return { imageDataUrl: data.imageDataUrl, goal, mode };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const modeInstructions: Record<ScanMode, string> = {
      food: `The image is a PHOTO OF FOOD or a meal. Identify the visible item(s) and estimate nutrition for a typical serving you can see on the plate.`,
      menu: `The image is a MENU or food list (restaurant, café, supermarket shelf). Pick the single dish that BEST matches the user's goal, or if one item is clearly highlighted, analyze that. Put the dish name in food_name and estimate nutrition for one typical serving of that dish. In "notes", briefly say which item you picked and why.`,
      recipe: `The image is a RECIPE with an ingredient list. READ THE EXACT GRAM / ML / UNIT QUANTITIES printed in the recipe and SUM the nutrition across all ingredients. Then divide by the number of servings stated (default to 1 if not stated). Use the printed quantities as ground truth — do not guess serving sizes. In "notes", state the number of servings you divided by and list 2-3 of the biggest contributors to sugar or carbs.`,
    };

    const systemPrompt = `You are NutriSight, an AI nutrition assistant. The user sends an image and their personal health goal.

${modeInstructions[data.mode]}

Respond ONLY with a strict JSON object matching this schema (no markdown, no commentary):
{
  "food_name": string,                  // short name of the main item/dish
  "confidence": "low"|"medium"|"high",
  "calories_kcal": number,              // per serving
  "sugar_g": number,
  "carbs_g": number,
  "protein_g": number,
  "fiber_g": number,
  "salt_level": "low"|"medium"|"high",
  "sugar_cubes": number,                // ~4g sugar per cube; 0 if not sugary
  "carb_impact": "low"|"medium"|"high",
  "health_score": number,               // 0-100 for the user's stated goal
  "recommendation": string,             // 1-2 short sentences, personal, actionable, not medical advice
  "notes": string                       // caveats; for recipes include servings used
}

If the image is not relevant (not food, not a menu, not a recipe), return food_name "Not recognized" with health_score 0 and explain in recommendation.`;

    const userPrompt = `My goal: ${data.goal}. Mode: ${data.mode}. Analyze and recommend.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: userPrompt },
              { type: "image_url", image_url: { url: data.imageDataUrl } },
            ],
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new Error("Rate limit reached — please try again in a moment.");
      if (res.status === 402) throw new Error("AI credits exhausted. Please add credits in Lovable settings.");
      throw new Error(`AI request failed [${res.status}]: ${text.slice(0, 300)}`);
    }

    const json = await res.json();
    const content: string = json?.choices?.[0]?.message?.content ?? "";
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("AI returned an unparseable response.");
      parsed = JSON.parse(match[0]);
    }
    const str = (v: unknown, d = "") => (typeof v === "string" ? v : d);
    const num = (v: unknown, d = 0) => (typeof v === "number" && isFinite(v) ? v : d);
    const out: ScanOutput = {
      food_name: str(parsed.food_name, "Unknown"),
      confidence: str(parsed.confidence, "medium"),
      calories_kcal: num(parsed.calories_kcal),
      sugar_g: num(parsed.sugar_g),
      carbs_g: num(parsed.carbs_g),
      protein_g: num(parsed.protein_g),
      fiber_g: num(parsed.fiber_g),
      salt_level: str(parsed.salt_level, "medium"),
      sugar_cubes: num(parsed.sugar_cubes),
      carb_impact: str(parsed.carb_impact, "medium"),
      health_score: num(parsed.health_score),
      recommendation: str(parsed.recommendation, ""),
      notes: str(parsed.notes, ""),
    };
    return out;
  });
