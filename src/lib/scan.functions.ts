import { createServerFn } from "@tanstack/react-start";

type ScanInput = { imageDataUrl: string; goal: string };

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
    return { imageDataUrl: data.imageDataUrl, goal };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are NutriSight, an AI nutrition assistant. The user will send a photo of food, a meal, a menu, or a café/supermarket scene, along with their personal health goal.

Identify the food item(s) visible. Estimate nutrition for a typical serving. Then give a short personal recommendation based on their goal.

Respond ONLY with a strict JSON object matching this schema (no markdown, no commentary):
{
  "food_name": string,                  // short name of the main item, or "Multiple items"
  "confidence": "low"|"medium"|"high",
  "calories_kcal": number,              // estimated for typical serving
  "sugar_g": number,
  "carbs_g": number,
  "protein_g": number,
  "fiber_g": number,
  "salt_level": "low"|"medium"|"high",
  "sugar_cubes": number,                // approx 4g sugar per cube; 0 if not sugary
  "carb_impact": "low"|"medium"|"high",
  "health_score": number,               // 0-100 for the user's stated goal
  "recommendation": string,             // 1-2 short sentences, personal, actionable, not medical advice
  "notes": string                       // optional caveats (e.g. "estimate only")
}

If the image is not food, return food_name "Not food" with health_score 0 and a helpful recommendation explaining you can only analyze food images.`;

    const userPrompt = `My goal: ${data.goal}. Analyze this and recommend.`;

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
