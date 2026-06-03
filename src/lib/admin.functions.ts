import { createServerFn } from "@tanstack/react-start";
import { createMiddleware } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

// Admin-only middleware: checks has_role(user, 'admin')
const requireAdmin = createMiddleware({ type: "function" })
  .middleware([requireSupabaseAuth])
  .server(async ({ next, context }) => {
    const { supabase, userId } = context as { supabase: any; userId: string };
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (error || !data) {
      throw new Error("Forbidden: admin access required");
    }
    return next({ context: { supabase, userId, isAdmin: true } });
  });

// Lightweight self-check the client uses to know if the user can see the admin UI.
export const checkAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context as { supabase: any; userId: string };
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data };
  });

export const getAdminKpis = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async ({ context }) => {
    const { supabase } = context as { supabase: any };
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const headCount = async (table: string, filter?: (q: any) => any) => {
      let q = supabase.from(table).select("*", { count: "exact", head: true });
      if (filter) q = filter(q);
      const { count } = await q;
      return count ?? 0;
    };

    const [
      totalUsers,
      totalSignups,
      signupsToday,
      signupsThisWeek,
      totalScans,
      scansToday,
      geminiCalls,
      geminiCallsToday,
      activeToday,
      activeWeek,
      feedbackCount,
      mealsCount,
    ] = await Promise.all([
      headCount("profiles"),
      headCount("beta_signups"),
      headCount("beta_signups", (q: any) => q.gte("created_at", startOfToday)),
      headCount("beta_signups", (q: any) => q.gte("created_at", weekAgo)),
      headCount("scan_events"),
      headCount("scan_events", (q: any) => q.gte("created_at", startOfToday)),
      headCount("gemini_logs"),
      headCount("gemini_logs", (q: any) => q.gte("created_at", startOfToday)),
      headCount("scan_events", (q: any) => q.gte("created_at", startOfToday)),
      headCount("scan_events", (q: any) => q.gte("created_at", weekAgo)),
      headCount("feedback"),
      headCount("meals"),
    ]);

    // Top goal among beta signups
    const { data: goalRows } = await supabase
      .from("beta_signups")
      .select("selected_goal")
      .not("selected_goal", "is", null)
      .limit(1000);
    const goalCounts: Record<string, number> = {};
    (goalRows ?? []).forEach((r: any) => {
      const g = (r.selected_goal ?? "unknown") as string;
      goalCounts[g] = (goalCounts[g] ?? 0) + 1;
    });
    const topGoal =
      Object.entries(goalCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

    // Avg health score from meals
    const { data: scoreRows } = await supabase
      .from("meals")
      .select("health_score")
      .not("health_score", "is", null)
      .limit(1000);
    const scores = (scoreRows ?? []).map((r: any) => r.health_score as number);
    const avgHealthScore = scores.length
      ? Math.round((scores.reduce((s: number, n: number) => s + n, 0) / scores.length) * 10) / 10
      : 0;

    return {
      totalUsers,
      totalSignups,
      signupsToday,
      signupsThisWeek,
      totalScans,
      scansToday,
      geminiCalls,
      geminiCallsToday,
      activeToday,
      activeWeek,
      feedbackCount,
      mealsCount,
      topGoal,
      avgHealthScore,
      goalCounts,
      revenueUsd: 0,
    };
  });

export const listBetaSignups = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async ({ context }) => {
    const { supabase } = context as { supabase: any };
    const { data, error } = await supabase
      .from("beta_signups")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return { signups: data ?? [] };
  });

export const updateBetaSignup = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input) =>
    z
      .object({
        id: z.string().uuid(),
        status: z
          .enum(["new", "contacted", "tester", "partner", "archived"])
          .optional(),
        internal_notes: z.string().max(2000).nullable().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context as { supabase: any };
    const patch: Record<string, unknown> = {};
    if (data.status !== undefined) patch.status = data.status;
    if (data.internal_notes !== undefined) patch.internal_notes = data.internal_notes;
    const { error } = await supabase.from("beta_signups").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
