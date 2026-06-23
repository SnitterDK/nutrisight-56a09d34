import { createServerFn } from "@tanstack/react-start";

export type PublicStats = {
  users: number;
  scans: number;
  lessons: number;
  beta_signups: number;
  gemini_calls: number;
};

export const getPublicStats = createServerFn({ method: "GET" }).handler(async (): Promise<PublicStats> => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [u, s, l, b, g] = await Promise.all([
    supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("scan_events").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("learning_progress").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("beta_signups").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("gemini_logs").select("*", { count: "exact", head: true }),
  ]);
  return {
    users: u.count ?? 0,
    scans: s.count ?? 0,
    lessons: l.count ?? 0,
    beta_signups: b.count ?? 0,
    gemini_calls: g.count ?? 0,
  };
});
