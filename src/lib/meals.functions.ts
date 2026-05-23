import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const mealSchema = z.object({
  food_name: z.string().trim().min(1).max(200),
  calories_kcal: z.number().min(0).max(10000).default(0),
  sugar_g: z.number().min(0).max(1000).default(0),
  carbs_g: z.number().min(0).max(2000).default(0),
  protein_g: z.number().min(0).max(1000).default(0),
  fiber_g: z.number().min(0).max(500).default(0),
  salt_level: z.string().max(20).optional(),
  health_score: z.number().int().min(0).max(100).optional(),
  recommendation: z.string().max(2000).optional(),
  goal: z.string().max(60).optional(),
  image_url: z.string().max(2_000_000).optional(),
  scan_payload: z.record(z.unknown()).optional(),
});

export const saveMeal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => mealSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const insertRow = { ...data, user_id: userId } as never;
    const { data: row, error } = await supabase
      .from("meals")
      .insert(insertRow)
      .select()
      .single();
    if (error) throw new Error(error.message);

    // bump XP for logging a meal (+5)
    const { data: prof } = await supabase.from("profiles").select("xp,last_active_date,streak_days").eq("id", userId).single();
    const today = new Date().toISOString().slice(0, 10);
    let streak = prof?.streak_days ?? 0;
    if (prof?.last_active_date !== today) {
      const yest = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
      streak = prof?.last_active_date === yest ? streak + 1 : 1;
    }
    await supabase
      .from("profiles")
      .update({ xp: (prof?.xp ?? 0) + 5, last_active_date: today, streak_days: streak })
      .eq("id", userId);

    return row;
  });

export const getTodayMeals = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const { data, error } = await supabase
      .from("meals")
      .select("*")
      .eq("user_id", userId)
      .gte("eaten_at", start.toISOString())
      .order("eaten_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getRecentMeals = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("meals")
      .select("*")
      .eq("user_id", userId)
      .order("eaten_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const deleteMeal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("meals").delete().eq("id", data.id).eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
