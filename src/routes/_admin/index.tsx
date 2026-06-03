import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Users, Inbox, ScanLine, Sparkles, Activity, MessageSquare, Target, Heart, DollarSign, Calendar, TrendingUp, BookOpen } from "lucide-react";
import { getAdminKpis } from "@/lib/admin.functions";

export const Route = createFileRoute("/_admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const fetchKpis = useServerFn(getAdminKpis);
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["admin", "kpis"],
    queryFn: () => fetchKpis(),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
        Failed to load KPIs: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }
  if (!data) return null;

  const cards: Array<{ label: string; value: string | number; icon: any; sub?: string }> = [
    { label: "Total users", value: data.totalUsers, icon: Users },
    { label: "Beta signups", value: data.totalSignups, icon: Inbox, sub: `${data.signupsToday} today · ${data.signupsThisWeek} this week` },
    { label: "Total scans", value: data.totalScans, icon: ScanLine, sub: `${data.scansToday} today` },
    { label: "Gemini calls", value: data.geminiCalls, icon: Sparkles, sub: `${data.geminiCallsToday} today` },
    { label: "Active today", value: data.activeToday, icon: Activity },
    { label: "Active this week", value: data.activeWeek, icon: TrendingUp },
    { label: "Feedback", value: data.feedbackCount, icon: MessageSquare },
    { label: "Saved meals", value: data.mealsCount, icon: BookOpen },
    { label: "Top goal", value: data.topGoal, icon: Target },
    { label: "Avg health score", value: data.avgHealthScore || "—", icon: Heart },
    { label: "Signup conversion", value: data.totalUsers ? `${Math.round((data.totalSignups / Math.max(data.totalUsers, 1)) * 100)}%` : "—", icon: Calendar },
    { label: "Revenue (USD)", value: `$${data.revenueUsd}`, icon: DollarSign, sub: "Monetization not enabled" },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Live KPIs across users, beta signups, scans, and Gemini usage.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold hover:bg-muted disabled:opacity-50"
        >
          {isFetching && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Refresh
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, sub }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-extrabold tracking-tight">{value}</p>
            {sub && <p className="mt-1 text-[11px] text-muted-foreground">{sub}</p>}
          </div>
        ))}
      </div>

      {Object.keys(data.goalCounts ?? {}).length > 0 && (
        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-base font-bold">Goal distribution (beta signups)</h2>
          <div className="mt-4 space-y-2">
            {Object.entries(data.goalCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([goal, count]) => {
                const total = Object.values(data.goalCounts).reduce((s, n) => s + n, 0);
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={goal} className="text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium capitalize">{goal}</span>
                      <span className="text-muted-foreground">{count} · {pct}%</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        Charts (signups over time, scans over time, Gemini latency) and tables for Users, Scan Events, Gemini Logs, Feedback, Reports, and Export will arrive in the next phase.
      </p>
    </div>
  );
}
