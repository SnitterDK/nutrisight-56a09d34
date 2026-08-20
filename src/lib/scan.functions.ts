import { createServerFn } from "@tanstack/react-start";

export type ScanMode = "food" | "menu" | "recipe";
type ScanInput = { imageDataUrl: string; goal: string; mode?: ScanMode };

export type AiMetaPublic = { model: string; latency_ms: number; provider: string };

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
  _meta?: AiMetaPublic;
};

export type CompareItem = {
  name: string;
  calories_kcal: number;
  protein_g: number;
  sugar_g: number;
  carbs_g: number;
  fiber_g: number;
  satiety: "low" | "medium" | "high";
  glucose_stability: "low" | "medium" | "high";
  notes: string;
};

export type CompareOutput = {
  items: CompareItem[];
  winner_index: number;
  recommendation: string;
  _meta?: AiMetaPublic;
};

export type DescribeOutput = ScanOutput & {
  items: { name: string; quantity: string; calories_kcal: number; protein_g: number }[];
};

const LOVABLE_AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

export type AiMeta = { model: string; latency_ms: number; provider: string };

async function callAI(body: Record<string, unknown>): Promise<{ data: any; meta: AiMeta }> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");
  const started = Date.now();
  const res = await fetch(LOVABLE_AI_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const latency_ms = Date.now() - started;
  if (!res.ok) {
    const text = await res.text();
    if (res.status === 429) throw new Error("Rate limit reached — try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Lovable settings.");
    throw new Error(`AI request failed [${res.status}]: ${text.slice(0, 300)}`);
  }
  const json = await res.json();
  const content: string = json?.choices?.[0]?.message?.content ?? "";
  const meta: AiMeta = {
    model: String(body.model ?? "google/gemini-2.5-flash"),
    latency_ms,
    provider: "Google Gemini via Lovable AI Gateway",
  };
  const tryParse = (s: string) => {
    try { return JSON.parse(s); } catch {
      const m = s.match(/\{[\s\S]*\}/);
      if (!m) throw new Error("AI returned an unparseable response.");
      return JSON.parse(m[0]);
    }
  };
  return { data: tryParse(content), meta };
}

export const analyzeFood = createServerFn({ method: "POST" })
  .inputValidator((data: ScanInput) => {
    if (!data || typeof data.imageDataUrl !== "string" || !data.imageDataUrl.startsWith("data:image/")) {
      throw new Error("Invalid image");
    }
    if (data.imageDataUrl.length > 8_000_000) throw new Error("Image too large (max ~6MB)");
    const goal = typeof data.goal === "string" && data.goal.length < 80 ? data.goal : "Healthier choices overall";
    const mode: ScanMode = data.mode === "menu" || data.mode === "recipe" ? data.mode : "food";
    return { imageDataUrl: data.imageDataUrl, goal, mode };
  })
  .handler(async ({ data }) => {
    const modeInstructions: Record<ScanMode, string> = {
      food: `The image is a PHOTO OF FOOD or a meal. Identify the visible item(s) and estimate nutrition for a typical serving you can see on the plate.`,
      menu: `The image is a MENU or food list. Pick the dish that BEST matches the user's goal. Put the dish name in food_name and estimate nutrition for one typical serving. In "notes", briefly say which item you picked and why.`,
      recipe: `The image is a RECIPE with an ingredient list. READ the printed gram/ml/unit quantities and SUM nutrition. Divide by stated servings (default 1). In "notes", state the servings used and list 2-3 biggest sugar/carb contributors.`,
    };

    const systemPrompt = `You are NutriSight, an AI nutrition assistant. Estimates only — never medical advice.

${modeInstructions[data.mode]}

If the user's goal mentions ketogenic or low-carb: score mainly on net carbs (carbs minus fiber) and added sugar, mention approximate net carbs in "notes", and suggest a lower-carb swap. Never claim a diet treats, prevents or cures any disease; if the user hints at illness, gently suggest talking to their doctor.

Respond ONLY with strict JSON:
{
  "food_name": string,
  "confidence": "low"|"medium"|"high",
  "calories_kcal": number,
  "sugar_g": number,
  "carbs_g": number,
  "protein_g": number,
  "fiber_g": number,
  "salt_level": "low"|"medium"|"high",
  "sugar_cubes": number,
  "carb_impact": "low"|"medium"|"high",
  "health_score": number,
  "recommendation": string,
  "notes": string
}`;

    const { data: parsed, meta } = await callAI({
      model: data.mode === "recipe" || data.mode === "menu" ? "google/gemini-2.5-pro" : "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            { type: "text", text: `My goal: ${data.goal}. Mode: ${data.mode}. Analyze and recommend.` },
            { type: "image_url", image_url: { url: data.imageDataUrl } },
          ],
        },
      ],
      response_format: { type: "json_object" },
    });

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
      _meta: meta,
    };
    return out;
  });

// --- Choose Better: compare two food images side-by-side ---
export const compareFoods = createServerFn({ method: "POST" })
  .inputValidator((data: { imageA: string; imageB: string; goal: string }) => {
    for (const k of ["imageA", "imageB"] as const) {
      if (typeof data[k] !== "string" || !data[k].startsWith("data:image/")) {
        throw new Error("Invalid image");
      }
      if (data[k].length > 8_000_000) throw new Error("Image too large (max ~6MB each)");
    }
    const goal = typeof data.goal === "string" && data.goal.length < 80 ? data.goal : "Healthier choices overall";
    return { imageA: data.imageA, imageB: data.imageB, goal };
  })
  .handler(async ({ data }) => {
    const systemPrompt = `You are NutriSight's "Choose Better" agent. Compare TWO food images for the user's goal.

Return strict JSON only:
{
  "items": [
    { "name": string, "calories_kcal": number, "protein_g": number, "sugar_g": number, "carbs_g": number, "fiber_g": number, "satiety": "low"|"medium"|"high", "glucose_stability": "low"|"medium"|"high", "notes": string },
    { "name": string, "calories_kcal": number, "protein_g": number, "sugar_g": number, "carbs_g": number, "fiber_g": number, "satiety": "low"|"medium"|"high", "glucose_stability": "low"|"medium"|"high", "notes": string }
  ],
  "winner_index": 0 | 1,
  "recommendation": string
}

Recommendation: 1-2 sentences explaining the better choice for the user's goal. Calm, supportive, never fear-based. Estimates only.`;

    const { data: parsed, meta } = await callAI({
      model: "google/gemini-2.5-pro",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            { type: "text", text: `My goal: ${data.goal}. Compare option A (first image) vs option B (second image).` },
            { type: "image_url", image_url: { url: data.imageA } },
            { type: "image_url", image_url: { url: data.imageB } },
          ],
        },
      ],
      response_format: { type: "json_object" },
    });

    const num = (v: unknown, d = 0) => (typeof v === "number" && isFinite(v) ? v : d);
    const str = (v: unknown, d = "") => (typeof v === "string" ? v : d);
    const lvl = (v: unknown): "low" | "medium" | "high" =>
      v === "low" || v === "high" ? v : "medium";
    const items = Array.isArray(parsed.items)
      ? parsed.items.slice(0, 2).map((it: Record<string, unknown>) => ({
          name: str(it.name, "Option"),
          calories_kcal: num(it.calories_kcal),
          protein_g: num(it.protein_g),
          sugar_g: num(it.sugar_g),
          carbs_g: num(it.carbs_g),
          fiber_g: num(it.fiber_g),
          satiety: lvl(it.satiety),
          glucose_stability: lvl(it.glucose_stability),
          notes: str(it.notes, ""),
        }))
      : [];
    while (items.length < 2) {
      items.push({ name: "Unknown", calories_kcal: 0, protein_g: 0, sugar_g: 0, carbs_g: 0, fiber_g: 0, satiety: "medium" as const, glucose_stability: "medium" as const, notes: "" });
    }
    const winner = parsed.winner_index === 1 ? 1 : 0;
    const out: CompareOutput = {
      items,
      winner_index: winner,
      recommendation: str(parsed.recommendation, ""),
      _meta: meta,
    };
    return out;
  });

// --- Describe meal: text-to-nutrition ---
export const describeMeal = createServerFn({ method: "POST" })
  .inputValidator((data: { text: string; goal: string }) => {
    if (typeof data.text !== "string" || data.text.trim().length < 3) throw new Error("Describe your meal in a sentence.");
    if (data.text.length > 1000) throw new Error("Description too long (max 1000 chars).");
    const goal = typeof data.goal === "string" && data.goal.length < 80 ? data.goal : "Healthier choices overall";
    return { text: data.text.trim(), goal };
  })
  .handler(async ({ data }) => {
    const systemPrompt = `You are NutriSight. Convert a free-text meal description into structured nutrition estimates.

Return strict JSON only:
{
  "food_name": string,
  "confidence": "low"|"medium"|"high",
  "calories_kcal": number, "sugar_g": number, "carbs_g": number, "protein_g": number, "fiber_g": number,
  "salt_level": "low"|"medium"|"high",
  "sugar_cubes": number,
  "carb_impact": "low"|"medium"|"high",
  "health_score": number,
  "recommendation": string,
  "notes": string,
  "items": [{ "name": string, "quantity": string, "calories_kcal": number, "protein_g": number }]
}

Estimates only — never medical advice. Tone: calm, supportive.`;

    const { data: parsed, meta } = await callAI({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `My goal: ${data.goal}. Meal description: "${data.text}"` },
      ],
      response_format: { type: "json_object" },
    });

    const str = (v: unknown, d = "") => (typeof v === "string" ? v : d);
    const num = (v: unknown, d = 0) => (typeof v === "number" && isFinite(v) ? v : d);
    const items = Array.isArray(parsed.items)
      ? parsed.items.slice(0, 12).map((it: Record<string, unknown>) => ({
          name: str(it.name, "Item"),
          quantity: str(it.quantity, ""),
          calories_kcal: num(it.calories_kcal),
          protein_g: num(it.protein_g),
        }))
      : [];
    const out: DescribeOutput = {
      food_name: str(parsed.food_name, data.text.slice(0, 60)),
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
      _meta: meta,
      items,
    };
    return out;
  });
