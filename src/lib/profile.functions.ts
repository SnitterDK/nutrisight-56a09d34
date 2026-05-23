import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

const updateSchema = z.object({
  display_name: z.string().trim().min(1).max(60).optional(),
  primary_goal: z.string().trim().min(1).max(40).optional(),
  daily_calorie_target: z.number().int().min(800).max(6000).optional(),
  daily_sugar_target_g: z.number().int().min(5).max(300).optional(),
  daily_protein_target_g: z.number().int().min(20).max(400).optional(),
  daily_fiber_target_g: z.number().int().min(5).max(100).optional(),
  onboarded: z.boolean().optional(),
});

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => updateSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("profiles")
      .update(data)
      .eq("id", userId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const addXp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ amount: z.number().int().min(1).max(500) }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: cur } = await supabase.from("profiles").select("xp").eq("id", userId).single();
    const newXp = (cur?.xp ?? 0) + data.amount;
    const { error } = await supabase.from("profiles").update({ xp: newXp }).eq("id", userId);
    if (error) throw new Error(error.message);
    return { xp: newXp };
  });
