import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import {
  Scale, CandyOff, Activity, Beef, Wheat, Droplets, Flame, Salad, Sparkles, Check,
  TrendingUp,
} from "lucide-react";
import { Section } from "@/components/Section";
import { LiveScanner } from "@/components/LiveScanner";
import { GameDashboard } from "@/components/GameDashboard";
import { useAuth } from "@/hooks/useAuth";
import { getMyProfile } from "@/lib/profile.functions";
import { getTodayMeals } from "@/lib/meals.functions";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Scan food — NutriSight" },
      { name: "description", content: "Live AI camera scanner. Pick a focus goal and instantly understand any food." },
    ],
  }),
  component: AppPage,
});

const GOALS = [
  { id: "sugar", label: "Reduce sugar", icon: CandyOff },
  { id: "weight", label: "Lose weight", icon: Scale },
  { id: "glucose", label: "Stable blood sugar", icon: Activity },
  { id: "protein", label: "More protein", icon: Beef },
  { id: "fiber", label: "More fiber", icon: Wheat },
  { id: "salt", label: "Reduce salt", icon: Droplets },
  { id: "calories", label: "Reduce calories", icon: Flame },
  { id: "processed", label: "Less ultra-processed", icon: Salad },
  { id: "overall", label: "Healthier overall", icon: Sparkles },
] as const;

function AppPage() {
  const { user } = useAuth();
  const fetchProfile = useServerFn(getMyProfile);
  const fetchToday = useServerFn(getTodayMeals);

  const profileQ = useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchProfile(),
    enabled: !!user,
  });
  const todayQ = useQuery({
    queryKey: ["meals", "today"],
    queryFn: () => fetchToday(),
    enabled: !!user,
    refetchInterval: 8000,
  });

  const initialGoal = (profileQ.data?.primary_goal as string | undefined) ?? "sugar";
  const [goal, setGoal] = useState<string>(initialGoal);
  useEffect(() => {
    if (profileQ.data?.primary_goal) setGoal(profileQ.data.primary_goal);
  }, [profileQ.data?.primary_goal]);

  const goalLabel = GOALS.find((g) => g.id === goal)?.label ?? "Healthier overall";

  const totals = (todayQ.data ?? []).reduce(
    (acc, m) => {
      acc.kcal += Number(m.calories_kcal) || 0;
      acc.sugar += Number(m.sugar_g) || 0;
      acc.protein += Number(m.protein_g) || 0;
      acc.fiber += Number(m.fiber_g) || 0;
      return acc;
    },
    { kcal: 0, sugar: 0, protein: 0, fiber: 0 },
  );

  const targets = {
    kcal: profileQ.data?.daily_calorie_target ?? 2000,
    sugar: profileQ.data?.daily_sugar_target_g ?? 50,
    protein: profileQ.data?.daily_protein_target_g ?? 90,
    fiber: profileQ.data?.daily_fiber_target_g ?? 30,
  };

  return (
    <>
      {/* Game dashboard — level, quests, achievements */}
      <Section eyebrow="Your game" title="Level up by eating smarter" subtitle="Every scan, every lesson, every healthy choice earns XP. Build streaks, unlock ranks, smash daily quests.">
        <GameDashboard profile={profileQ.data ?? null} todayMeals={todayQ.data ?? []} />
      </Section>


      {/* Scanner */}
      <Section eyebrow="Live scan" title="Scan food right now" subtitle="Tap to capture. AI analyzes it against your goal in seconds.">
        <LiveScanner goalLabel={goalLabel} autoOpen={false} />
      </Section>

      {/* Goal picker */}
      <Section eyebrow="Focus goal" title="What do you want NutriSight to optimize for?" subtitle="Your focus goal becomes the scoring lens for every scan. You learn faster about what matters to you.">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {GOALS.map(({ id, label, icon: Icon }) => {
            const active = goal === id;
            return (
              <button
                key={id}
                onClick={() => setGoal(id)}
                className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                  active ? "border-primary bg-primary/10 shadow-md" : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold">{label}</span>
                {active && <Check className="ml-auto h-4 w-4 text-primary" />}
              </button>
            );
          })}
        </div>
        {user && goal !== profileQ.data?.primary_goal && (
          <p className="mt-3 text-xs text-muted-foreground">Tip: <Link to="/profile" className="underline">save this goal</Link> to your profile so every future scan uses it.</p>
        )}
      </Section>

      {/* Today */}
      <Section eyebrow="Meal memory" title="Today so far" subtitle="Your scans land here automatically when you're signed in.">
        {!user ? (
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center">
            <p className="text-sm">
              <Link to="/auth" className="font-semibold text-primary hover:underline">Sign in</Link>{" "}
              to save scans, see your daily balance, build streaks and earn XP.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold text-muted-foreground">Meals today</h3>
              <ul className="mt-4 space-y-2">
                {(todayQ.data ?? []).length === 0 && (
                  <li className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                    No meals yet — your first scan above will land here.
                  </li>
                )}
                {(todayQ.data ?? []).map((m) => (
                  <li key={m.id} className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{m.food_name}</p>
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                        {new Date(m.eaten_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <span className="rounded-full bg-card px-3 py-1 text-xs font-semibold">{Math.round(Number(m.calories_kcal))} kcal</span>
                  </li>
                ))}
              </ul>
              <Link to="/history" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                <TrendingUp className="h-3.5 w-3.5" /> See full history
              </Link>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold text-muted-foreground">Daily balance</h3>
              <div className="mt-4 space-y-4">
                <Bar label="Calories" value={Math.round(totals.kcal)} max={targets.kcal} unit="kcal" />
                <Bar label="Sugar" value={Math.round(totals.sugar)} max={targets.sugar} unit="g" warn />
                <Bar label="Protein" value={Math.round(totals.protein)} max={targets.protein} unit="g" tone="blue" />
                <Bar label="Fiber" value={Math.round(totals.fiber)} max={targets.fiber} unit="g" tone="blue" />
              </div>
            </div>
          </div>
        )}
      </Section>
    </>
  );
}


function Bar({ label, value, max, unit, warn = false, tone = "primary" }: { label: string; value: number; max: number; unit: string; warn?: boolean; tone?: "primary" | "blue" }) {
  const pct = Math.min(100, (value / max) * 100);
  const over = value > max;
  const color = warn || over ? "from-warning to-destructive" : tone === "blue" ? "from-brand-blue to-primary" : "from-primary to-success";
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className={over ? "text-destructive font-semibold" : "text-muted-foreground"}>{value} / {max} {unit}</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-muted">
        <div className={`h-2.5 rounded-full bg-gradient-to-r ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
