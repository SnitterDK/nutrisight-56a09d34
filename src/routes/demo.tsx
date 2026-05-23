import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Scale, CandyOff, Activity, Beef, Wheat, Droplets, Flame, Salad,
  Coffee, ScanText, Camera, Sparkles, Check, ArrowRight, Trophy,
} from "lucide-react";
import { Section } from "@/components/Section";
import { LiveScanner } from "@/components/LiveScanner";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Try the Demo — NutriSight" },
      { name: "description", content: "Pick a goal, pick a scenario, and watch NutriSight recommend a healthier choice in real time." },
      { property: "og:title", content: "Try the NutriSight demo" },
      { property: "og:description", content: "Interactive prototype: goal → scan → recommendation." },
    ],
  }),
  component: DemoPage,
});

const GOALS = [
  { id: "weight", label: "Lose weight", icon: Scale },
  { id: "sugar", label: "Reduce sugar", icon: CandyOff },
  { id: "glucose", label: "Stabilize blood sugar", icon: Activity },
  { id: "protein", label: "Eat more protein", icon: Beef },
  { id: "fiber", label: "Eat more fiber", icon: Wheat },
  { id: "salt", label: "Reduce salt", icon: Droplets },
  { id: "calories", label: "Reduce calories", icon: Flame },
  { id: "processed", label: "Avoid ultra-processed", icon: Salad },
  { id: "overall", label: "Healthier choices overall", icon: Sparkles },
] as const;

const SCENARIOS = [
  { id: "cafe", label: "Café choice", body: "Salad vs Donut — classic comparison.", icon: Coffee },
  { id: "menu", label: "Menu scan", body: "Snap a restaurant menu and rank choices.", icon: ScanText },
  { id: "meal", label: "Meal photo", body: "Photograph a plated meal for instant insights.", icon: Camera },
] as const;

function DemoPage() {
  const [goal, setGoal] = useState<string>("sugar");
  const [scenario, setScenario] = useState<string>("cafe");
  const [saved, setSaved] = useState(false);

  return (
    <>
      <section className="container-page pt-14">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-primary">Interactive demo</p>
        <h1 className="mt-2 text-center text-4xl font-bold md:text-5xl">Try NutriSight</h1>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          A polished prototype of the real-time NutriSight experience. Pick a goal, pick a scenario,
          and see a personalized recommendation.
        </p>
      </section>

      {/* STEP A */}
      <Section eyebrow="Step A" title="Choose your goal">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {GOALS.map(({ id, label, icon: Icon }) => {
            const active = goal === id;
            return (
              <button
                key={id}
                onClick={() => setGoal(id)}
                className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                  active
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border bg-card hover:border-primary/40"
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
      </Section>

      {/* STEP B */}
      <Section eyebrow="Step B" title="Choose a scenario">
        <div className="grid gap-4 md:grid-cols-3">
          {SCENARIOS.map(({ id, label, body, icon: Icon }) => {
            const active = scenario === id;
            return (
              <button
                key={id}
                onClick={() => setScenario(id)}
                className={`rounded-2xl border p-5 text-left transition ${
                  active ? "border-primary bg-primary/10 shadow-md" : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <Icon className="h-6 w-6 text-primary" />
                <h3 className="mt-3 text-base font-semibold">{label}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{body}</p>
              </button>
            );
          })}
        </div>
      </Section>

      {/* STEP C — Café example */}
      <Section eyebrow="Step C" title="Café example — Salad vs Donut">
        <div className="grid gap-5 md:grid-cols-2">
          <FoodCard
            name="Garden salad with chicken"
            score={82}
            scoreTone="success"
            stats={[
              ["Calories", "420 kcal"],
              ["Sugar", "12 g"],
              ["Carbs", "35 g"],
              ["Protein", "22 g"],
              ["Fiber", "8 g"],
              ["Salt", "Medium"],
            ]}
            best
          />
          <FoodCard
            name="Glazed donut"
            score={38}
            scoreTone="destructive"
            stats={[
              ["Calories", "360 kcal"],
              ["Sugar", "28 g"],
              ["Carbs", "45 g"],
              ["Protein", "5 g"],
              ["Fiber", "2 g"],
              ["Sugar impact", "High"],
            ]}
          />
        </div>

        <div className="mt-8 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 to-brand-blue/10 p-6 md:p-8">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">Personal recommendation</p>
              <p className="mt-2 text-lg font-semibold leading-snug">
                Based on your goal and what you've already eaten today, the salad is the better choice.
                The donut is okay as a treat, but it would use most of your remaining sugar and calorie budget.
              </p>
              <button
                onClick={() => setSaved(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                {saved ? <><Check className="h-4 w-4" /> Saved to today's intake</> : <>Save to today's intake <ArrowRight className="h-4 w-4" /></>}
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* TODAY'S INTAKE */}
      <Section
        eyebrow="Meal memory"
        title="Today's intake"
        subtitle="NutriSight remembers your day, so recommendations become personal — not generic."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-muted-foreground">Meals so far</h3>
            <ul className="mt-4 space-y-3">
              <MealRow time="Breakfast" name="Greek yogurt with granola" kcal={420} />
              <MealRow time="Lunch" name="Chicken sandwich" kcal={650} />
              <MealRow time="Right now" name="Salad or donut?" kcal={undefined} pending />
            </ul>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-muted-foreground">Daily balance</h3>
            <div className="mt-4 space-y-4">
              <Bar label="Calories" value={1070} max={2000} unit="kcal" />
              <Bar label="Sugar" value={42} max={60} unit="g" warn />
              <Bar label="Protein" value={58} max={110} unit="g" tone="blue" />
              <Bar label="Fiber" value={14} max={30} unit="g" tone="blue" />
              <div className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
                <span className="text-sm font-medium">Salt</span>
                <span className="rounded-full bg-warning/20 px-3 py-1 text-xs font-semibold text-warning-foreground">Moderate</span>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

function FoodCard({
  name, score, scoreTone, stats, best = false,
}: {
  name: string;
  score: number;
  scoreTone: "success" | "destructive";
  stats: [string, string][];
  best?: boolean;
}) {
  const ring = scoreTone === "success" ? "ring-success/40 bg-success/10 text-success" : "ring-destructive/40 bg-destructive/10 text-destructive";
  return (
    <div className={`relative rounded-3xl border bg-card p-6 shadow-sm ${best ? "border-primary" : "border-border"}`}>
      {best && (
        <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-primary-foreground">
          <Trophy className="h-3 w-3" /> Best for your goal
        </span>
      )}
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-bold">{name}</h3>
        <div className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl ring-2 ${ring}`}>
          <span className="text-lg font-bold leading-none">{score}</span>
          <span className="text-[10px] opacity-80">/100</span>
        </div>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-3">
        {stats.map(([k, v]) => (
          <div key={k} className="rounded-xl bg-muted px-3 py-2">
            <dt className="text-[11px] text-muted-foreground">{k}</dt>
            <dd className="text-sm font-semibold">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function MealRow({ time, name, kcal, pending = false }: { time: string; name: string; kcal?: number; pending?: boolean }) {
  return (
    <li className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{time}</p>
        <p className="text-sm font-medium">{name}</p>
      </div>
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${pending ? "bg-primary/15 text-primary" : "bg-card"}`}>
        {pending ? "Deciding…" : `${kcal} kcal`}
      </span>
    </li>
  );
}

function Bar({ label, value, max, unit, warn = false, tone = "primary" }: {
  label: string; value: number; max: number; unit: string; warn?: boolean; tone?: "primary" | "blue";
}) {
  const pct = Math.min(100, (value / max) * 100);
  const color = warn ? "from-warning to-destructive" : tone === "blue" ? "from-brand-blue to-primary" : "from-primary to-success";
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{value} / {max} {unit}</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-muted">
        <div className={`h-2.5 rounded-full bg-gradient-to-r ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
