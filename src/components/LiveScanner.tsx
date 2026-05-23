import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Camera, Upload, Loader2, Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import { analyzeFood } from "@/lib/scan.functions";

type ScanResult = {
  food_name?: string;
  confidence?: string;
  calories_kcal?: number;
  sugar_g?: number;
  carbs_g?: number;
  protein_g?: number;
  fiber_g?: number;
  salt_level?: string;
  sugar_cubes?: number;
  carb_impact?: string;
  health_score?: number;
  recommendation?: string;
  notes?: string;
};

export function LiveScanner({ goalLabel }: { goalLabel: string }) {
  const analyze = useServerFn(analyzeFood);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setResult(null);
    const dataUrl = await downscaleToDataUrl(file, 1024);
    setImageUrl(dataUrl);
    setLoading(true);
    try {
      const res = (await analyze({ data: { imageDataUrl: dataUrl, goal: goalLabel } })) as ScanResult;
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setImageUrl(null);
    setResult(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
    if (cameraRef.current) cameraRef.current.value = "";
  }

  return (
    <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/5 via-card to-brand-blue/5 p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Live AI scanner · Beta</p>
          <h3 className="mt-1 text-2xl font-bold">Scan real food with your camera</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Optimizing for: <span className="font-semibold text-foreground">{goalLabel}</span>
          </p>
        </div>
        {(imageUrl || result || error) && (
          <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted">
            <RefreshCw className="h-3.5 w-3.5" /> Scan another
          </button>
        )}
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {/* Image side */}
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted">
          {imageUrl ? (
            <img src={imageUrl} alt="Scanned food" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6 text-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <Camera className="h-7 w-7" />
              </span>
              <p className="text-sm text-muted-foreground">
                Snap a photo of any food, meal, menu or café counter.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => cameraRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow"
                >
                  <Camera className="h-4 w-4" /> Open camera
                </button>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-muted"
                >
                  <Upload className="h-4 w-4" /> Upload image
                </button>
              </div>
              <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </div>
          )}
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Analyzing with AI…</p>
            </div>
          )}
        </div>

        {/* Result side */}
        <div className="rounded-2xl border border-border bg-card p-5">
          {!result && !error && !loading && (
            <div className="flex h-full flex-col items-center justify-center text-center text-sm text-muted-foreground">
              <Sparkles className="mb-3 h-6 w-6 text-primary" />
              Your personalized nutrition estimate and recommendation will appear here.
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 rounded-xl bg-destructive/10 p-4 text-destructive">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">Couldn't analyze the image</p>
                <p className="mt-1 text-xs">{error}</p>
              </div>
            </div>
          )}

          {result && <ScanResultView result={result} />}
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Estimates only — not medical advice. AI vision may be inaccurate.
      </p>
    </div>
  );
}

function ScanResultView({ result }: { result: ScanResult }) {
  const score = typeof result.health_score === "number" ? Math.max(0, Math.min(100, Math.round(result.health_score))) : null;
  const scoreTone = score == null ? "muted" : score >= 70 ? "success" : score >= 40 ? "warning" : "destructive";
  const ringClass =
    scoreTone === "success" ? "ring-success/40 bg-success/10 text-success" :
    scoreTone === "warning" ? "ring-warning/40 bg-warning/15 text-warning-foreground" :
    scoreTone === "destructive" ? "ring-destructive/40 bg-destructive/10 text-destructive" :
    "ring-border bg-muted text-muted-foreground";

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {result.confidence ? `${result.confidence} confidence` : "Detected"}
          </p>
          <h4 className="text-xl font-bold">{result.food_name ?? "Unknown"}</h4>
        </div>
        {score != null && (
          <div className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl ring-2 ${ringClass}`}>
            <span className="text-lg font-bold leading-none">{score}</span>
            <span className="text-[10px] opacity-80">/100</span>
          </div>
        )}
      </div>

      <dl className="grid grid-cols-3 gap-2">
        <Stat k="Calories" v={fmt(result.calories_kcal, "kcal")} />
        <Stat k="Sugar" v={fmt(result.sugar_g, "g")} />
        <Stat k="Carbs" v={fmt(result.carbs_g, "g")} />
        <Stat k="Protein" v={fmt(result.protein_g, "g")} />
        <Stat k="Fiber" v={fmt(result.fiber_g, "g")} />
        <Stat k="Salt" v={cap(result.salt_level) ?? "—"} />
      </dl>

      {!!result.sugar_cubes && result.sugar_cubes > 0 && (
        <div>
          <p className="mb-1.5 text-xs font-semibold text-muted-foreground">~{result.sugar_cubes} sugar cubes</p>
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: Math.min(20, Math.round(result.sugar_cubes)) }).map((_, i) => (
              <div key={i} className="h-5 w-5 rounded bg-gradient-to-br from-white to-amber-100 shadow-sm ring-1 ring-amber-200" />
            ))}
          </div>
        </div>
      )}

      {result.carb_impact && (
        <div className="rounded-xl bg-muted px-3 py-2 text-sm">
          <span className="text-muted-foreground">Carb impact:</span>{" "}
          <span className="font-semibold">{cap(result.carb_impact)}</span>
        </div>
      )}

      {result.recommendation && (
        <div className="rounded-xl border border-primary/30 bg-primary/10 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Recommendation
          </div>
          <p className="mt-1 text-sm font-medium leading-snug">{result.recommendation}</p>
        </div>
      )}

      {result.notes && <p className="text-xs text-muted-foreground">{result.notes}</p>}
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl bg-muted px-3 py-2">
      <dt className="text-[10px] text-muted-foreground">{k}</dt>
      <dd className="text-sm font-semibold">{v}</dd>
    </div>
  );
}

function fmt(n: number | undefined, unit: string): string {
  if (typeof n !== "number" || !isFinite(n)) return "—";
  return `${Math.round(n)} ${unit}`;
}
function cap(s: string | undefined): string | undefined {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : undefined;
}

async function downscaleToDataUrl(file: File, maxSize: number): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(bitmap, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.85);
}
