import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Loader2, Sparkles, AlertCircle, Trophy, Mic, MessageSquare, Check } from "lucide-react";
import { describeMeal, type DescribeOutput } from "@/lib/scan.functions";
import { saveMeal } from "@/lib/meals.functions";
import { useAuth } from "@/hooks/useAuth";
import { Section } from "@/components/Section";
import { GeminiBadge } from "@/components/GeminiBadge";

export const Route = createFileRoute("/describe")({
  head: () => ({
    meta: [
      { title: "Describe a meal — AI nutrition from text | NutriSight" },
      { name: "description", content: "Type what you ate in plain language. NutriSight estimates calories, protein, sugar, carbs and fiber, then suggests one simple next step for your goal." },
      { property: "og:title", content: "Describe a meal — AI nutrition from text" },
      { property: "og:description", content: "Type your meal. Get instant nutrition. No barcode, no manual logging." },
      { property: "og:url", content: "https://nutrisight.lovable.app/describe" },
    ],
    links: [{ rel: "canonical", href: "https://nutrisight.lovable.app/describe" }],
  }),
  component: DescribePage,
});

const EXAMPLES = [
  "Two slices of rye bread with egg and avocado plus a glass of milk",
  "Chicken caesar salad with parmesan and croutons, large",
  "Bowl of pasta bolognese with parmesan, regular portion",
];

function DescribePage() {
  const describe = useServerFn(describeMeal);
  const save = useServerFn(saveMeal);
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [goal, setGoal] = useState("Healthier overall");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DescribeOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function run() {
    if (text.trim().length < 3) return;
    setLoading(true); setError(null); setResult(null); setSaved(false);
    try {
      const res = await describe({ data: { text, goal } });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not parse meal");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!result || !user) return;
    try {
      await save({
        data: {
          food_name: result.food_name,
          calories_kcal: result.calories_kcal,
          sugar_g: result.sugar_g,
          carbs_g: result.carbs_g,
          protein_g: result.protein_g,
          fiber_g: result.fiber_g,
          salt_level: result.salt_level,
          health_score: Math.round(result.health_score),
          recommendation: result.recommendation,
          goal,
        },
      });
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save meal");
    }
  }

  return (
    <>
      <section className="container-page pt-12 pb-6 md:pt-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <MessageSquare className="h-3.5 w-3.5" /> Describe meal
        </span>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight md:text-5xl">
          Type what you ate. <span className="gradient-text">AI does the math.</span>
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">
          No barcode. No manual logging. Describe your meal in one sentence and NutriSight estimates calories, protein, sugar, carbs and fiber — then suggests the next best step for your goal.
        </p>
      </section>

      <Section eyebrow="Goal" title="Pick your focus">
        <div className="flex flex-wrap gap-2">
          {["Healthier overall", "Lose weight", "Reduce sugar", "More protein", "Stable blood sugar", "More fiber"].map((g) => (
            <button key={g} onClick={() => setGoal(g)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${goal === g ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted"}`}>
              {g}
            </button>
          ))}
        </div>
      </Section>

      <Section eyebrow="Describe" title="What did you eat?">
        <div className="rounded-3xl border border-border bg-card p-5 md:p-7">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. Two slices of rye bread with egg and avocado plus a glass of milk"
            className="min-h-[120px] w-full resize-y rounded-2xl border border-border bg-background p-4 text-base outline-none focus:border-primary"
            maxLength={1000}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button key={ex} onClick={() => setText(ex)} className="rounded-full border border-border bg-muted px-3 py-1 text-xs hover:bg-card">
                Try: {ex.slice(0, 36)}…
              </button>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={run}
              disabled={text.trim().length < 3 || loading}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-base font-bold text-primary-foreground shadow-lg shadow-primary/30 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
              {loading ? "Estimating…" : "Estimate nutrition"}
            </button>
            <button
              disabled
              title="Voice transcription coming soon"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-muted-foreground"
            >
              <Mic className="h-4 w-4" /> Voice (coming soon)
            </button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{text.length}/1000 characters</p>
        </div>
      </Section>

      {error && (
        <Section eyebrow="" title="">
          <div className="flex items-start gap-3 rounded-2xl bg-destructive/10 p-4 text-destructive">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" /><p className="text-sm">{error}</p>
          </div>
        </Section>
      )}

      {result && (
        <Section eyebrow="Result" title={result.food_name}>
          <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/5 via-card to-brand-blue/5 p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{result.confidence} confidence — estimates only</p>
              <GeminiBadge meta={result._meta} />
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
              {[
                ["Calories", `${Math.round(result.calories_kcal)} kcal`],
                ["Protein", `${Math.round(result.protein_g)} g`],
                ["Carbs", `${Math.round(result.carbs_g)} g`],
                ["Sugar", `${Math.round(result.sugar_g)} g`],
                ["Fiber", `${Math.round(result.fiber_g)} g`],
                ["Salt", cap(result.salt_level)],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-muted px-3 py-2.5">
                  <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</dt>
                  <dd className="text-sm font-bold">{v}</dd>
                </div>
              ))}
            </dl>

            {result.items.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-muted-foreground">Items detected</h4>
                <ul className="mt-2 divide-y divide-border rounded-2xl border border-border bg-background">
                  {result.items.map((it, i) => (
                    <li key={i} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                      <span className="min-w-0 truncate"><strong>{it.name}</strong> {it.quantity && <span className="text-muted-foreground">— {it.quantity}</span>}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">{Math.round(it.calories_kcal)} kcal · {Math.round(it.protein_g)} g protein</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.recommendation && (
              <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/10 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> Suggestion for your goal
                </div>
                <p className="mt-1 text-sm font-medium leading-snug">{result.recommendation}</p>
              </div>
            )}

            <div className="mt-6">
              {user ? (
                <button onClick={handleSave} disabled={saved} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow disabled:opacity-60">
                  {saved ? <><Check className="h-4 w-4" /> Saved to today (+5 XP)</> : <><Trophy className="h-4 w-4" /> Save to today's meal log</>}
                </button>
              ) : (
                <Link to="/auth" className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-6 py-3 text-sm font-bold text-primary">
                  Sign in to save meals
                </Link>
              )}
            </div>
          </div>
        </Section>
      )}

      <section className="container-page pb-16 pt-4">
        <p className="text-center text-xs text-muted-foreground">
          AI estimates only — not medical advice. Edit any item if it looks wrong.
        </p>
      </section>
    </>
  );
}

function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
