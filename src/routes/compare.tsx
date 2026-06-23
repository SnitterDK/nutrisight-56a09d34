import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Upload, Loader2, Sparkles, AlertCircle, Trophy, RefreshCw, Scale } from "lucide-react";
import { compareFoods, type CompareOutput } from "@/lib/scan.functions";
import { Section } from "@/components/Section";
import { GeminiBadge } from "@/components/GeminiBadge";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Choose Better — Compare two foods with AI | NutriSight" },
      { name: "description", content: "Upload two food photos and let AI compare calories, protein, sugar, fiber, satiety and blood-sugar stability. Pick the better option for your goal — before you eat." },
      { property: "og:title", content: "Choose Better — Compare two foods with AI" },
      { property: "og:description", content: "Side-by-side AI nutrition comparison. Burger vs salad. Donut vs yogurt. Choose better, before you eat." },
      { property: "og:url", content: "https://nutrisight.lovable.app/compare" },
    ],
    links: [{ rel: "canonical", href: "https://nutrisight.lovable.app/compare" }],
  }),
  component: ComparePage,
});

async function downscale(file: File, maxSize = 1024): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(bitmap, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.85);
}

function Slot({ label, image, onPick }: { label: string; image: string | null; onPick: (f: File) => void }) {
  const id = `pick-${label}`;
  return (
    <label htmlFor={id} className="group relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-border bg-muted/40 transition hover:border-primary hover:bg-primary/5">
      {image ? (
        <img src={image} alt={`Option ${label}`} className="h-full w-full object-cover" />
      ) : (
        <div className="flex flex-col items-center gap-2 p-6 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Upload className="h-6 w-6" />
          </span>
          <p className="text-sm font-semibold">Option {label}</p>
          <p className="text-xs text-muted-foreground">Tap to upload a photo</p>
        </div>
      )}
      <input id={id} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onPick(e.target.files[0])} />
      <span className="absolute left-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-background text-sm font-bold shadow">{label}</span>
    </label>
  );
}

function ComparePage() {
  const compare = useServerFn(compareFoods);
  const [imgA, setImgA] = useState<string | null>(null);
  const [imgB, setImgB] = useState<string | null>(null);
  const [goal, setGoal] = useState("Healthier overall");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompareOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function pick(slot: "A" | "B", file: File) {
    const url = await downscale(file);
    if (slot === "A") setImgA(url); else setImgB(url);
    setResult(null);
    setError(null);
  }

  async function run() {
    if (!imgA || !imgB) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await compare({ data: { imageA: imgA, imageB: imgB, goal } });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Comparison failed");
    } finally {
      setLoading(false);
    }
  }

  function reset() { setImgA(null); setImgB(null); setResult(null); setError(null); }

  return (
    <>
      <section className="container-page pt-12 pb-6 md:pt-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Scale className="h-3.5 w-3.5" /> Choose Better
        </span>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight md:text-5xl">
          Compare two foods with AI <span className="gradient-text">before you eat</span>.
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">
          Burger vs salad. Donut vs yogurt. Pasta vs chicken bowl. Upload two photos and NutriSight tells you which option fits your goal — with calories, protein, sugar, fiber, satiety and blood-sugar stability side-by-side.
        </p>
      </section>

      <Section eyebrow="Step 1" title="Pick your goal">
        <div className="flex flex-wrap gap-2">
          {["Healthier overall", "Lose weight", "Reduce sugar", "More protein", "Stable blood sugar", "More fiber"].map((g) => (
            <button key={g} onClick={() => setGoal(g)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${goal === g ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted"}`}>
              {g}
            </button>
          ))}
        </div>
      </Section>

      <Section eyebrow="Step 2" title="Upload two food photos">
        <div className="grid gap-4 md:grid-cols-2">
          <Slot label="A" image={imgA} onPick={(f) => pick("A", f)} />
          <Slot label="B" image={imgB} onPick={(f) => pick("B", f)} />
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button onClick={run} disabled={!imgA || !imgB || loading} className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-base font-bold text-primary-foreground shadow-lg shadow-primary/30 disabled:opacity-50">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            {loading ? "Analyzing both…" : "Compare with AI"}
          </button>
          {(imgA || imgB) && !loading && (
            <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted">
              <RefreshCw className="h-3.5 w-3.5" /> Reset
            </button>
          )}
        </div>
      </Section>

      {error && (
        <Section eyebrow="" title="">
          <div className="flex items-start gap-3 rounded-2xl bg-destructive/10 p-4 text-destructive">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        </Section>
      )}

      {result && <ResultBlock result={result} imgA={imgA!} imgB={imgB!} />}

      <section className="container-page pb-16 pt-4">
        <p className="text-center text-xs text-muted-foreground">
          AI estimates only — not medical advice. Always check the actual ingredients when in doubt.
        </p>
      </section>
    </>
  );
}

function ResultBlock({ result, imgA, imgB }: { result: CompareOutput; imgA: string; imgB: string }) {
  const [a, b] = result.items;
  const winnerImg = result.winner_index === 0 ? imgA : imgB;
  const winnerName = result.items[result.winner_index]?.name ?? "Option";
  const rows: { label: string; av: string; bv: string; aBetter: boolean }[] = [
    { label: "Calories", av: `${Math.round(a.calories_kcal)} kcal`, bv: `${Math.round(b.calories_kcal)} kcal`, aBetter: a.calories_kcal < b.calories_kcal },
    { label: "Protein", av: `${Math.round(a.protein_g)} g`, bv: `${Math.round(b.protein_g)} g`, aBetter: a.protein_g > b.protein_g },
    { label: "Sugar", av: `${Math.round(a.sugar_g)} g`, bv: `${Math.round(b.sugar_g)} g`, aBetter: a.sugar_g < b.sugar_g },
    { label: "Carbs", av: `${Math.round(a.carbs_g)} g`, bv: `${Math.round(b.carbs_g)} g`, aBetter: a.carbs_g < b.carbs_g },
    { label: "Fiber", av: `${Math.round(a.fiber_g)} g`, bv: `${Math.round(b.fiber_g)} g`, aBetter: a.fiber_g > b.fiber_g },
    { label: "Satiety (fullness)", av: cap(a.satiety), bv: cap(b.satiety), aBetter: rank(a.satiety) > rank(b.satiety) },
    { label: "Blood sugar stability", av: cap(a.glucose_stability), bv: cap(b.glucose_stability), aBetter: rank(a.glucose_stability) > rank(b.glucose_stability) },
  ];

  return (
    <Section eyebrow="Result" title="The better choice for your goal">
      <div className="overflow-hidden rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-brand-blue/10 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-4">
          <img src={winnerImg} alt={winnerName} className="h-20 w-20 rounded-2xl object-cover ring-4 ring-primary/30" />
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
              <Trophy className="h-3.5 w-3.5" /> Better choice: Option {result.winner_index === 0 ? "A" : "B"}
            </div>
            <h3 className="mt-2 text-xl font-bold md:text-2xl">{winnerName}</h3>
            <p className="mt-1 text-sm text-muted-foreground md:text-base">{result.recommendation}</p>
            <GeminiBadge meta={result._meta} className="mt-3" />
          </div>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-3xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left">
              <th className="p-4 font-semibold text-muted-foreground">Comparison</th>
              <th className="p-4 font-semibold">A — {a.name}</th>
              <th className="p-4 font-semibold">B — {b.name}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-border/60 last:border-0">
                <td className="p-4 text-muted-foreground">{r.label}</td>
                <td className={`p-4 font-medium ${r.aBetter ? "text-success" : ""}`}>{r.av}{r.aBetter && " ★"}</td>
                <td className={`p-4 font-medium ${!r.aBetter ? "text-success" : ""}`}>{r.bv}{!r.aBetter && " ★"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
function rank(s: "low" | "medium" | "high") { return s === "high" ? 2 : s === "medium" ? 1 : 0; }
