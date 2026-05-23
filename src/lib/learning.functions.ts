import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const completeLesson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      lesson_key: z.string().trim().min(1).max(60).regex(/^[a-z0-9_-]+$/),
      xp_earned: z.number().int().min(1).max(100).default(15),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: existing } = await supabase
      .from("learning_progress")
      .select("id")
      .eq("user_id", userId)
      .eq("lesson_key", data.lesson_key)
      .maybeSingle();
    if (existing) return { already: true };

    const { error } = await supabase
      .from("learning_progress")
      .insert({ user_id: userId, lesson_key: data.lesson_key, xp_earned: data.xp_earned });
    if (error) throw new Error(error.message);

    const { data: prof } = await supabase.from("profiles").select("xp").eq("id", userId).single();
    await supabase
      .from("profiles")
      .update({ xp: (prof?.xp ?? 0) + data.xp_earned })
      .eq("id", userId);
    return { already: false, xp_earned: data.xp_earned };
  });

export const getMyLessons = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("learning_progress")
      .select("lesson_key, xp_earned, completed_at")
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return data ?? [];
  });
