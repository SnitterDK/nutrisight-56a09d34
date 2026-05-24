import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { Camera, Upload, Loader2, Sparkles, RefreshCw, AlertCircle, X, Check, Trophy, Utensils, ScrollText, ClipboardList } from "lucide-react";
import { analyzeFood, type ScanMode } from "@/lib/scan.functions";
import { saveMeal } from "@/lib/meals.functions";
import { useAuth } from "@/hooks/useAuth";

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

export function LiveScanner({ goalLabel, autoOpen = false, onClose }: { goalLabel: string; autoOpen?: boolean; onClose?: () => void }) {
  const analyze = useServerFn(analyzeFood);
  const save = useServerFn(saveMeal);
  const { user } = useAuth();

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [mode, setMode] = useState<ScanMode>("food");

  useEffect(() => {
    if (autoOpen) void startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpen]);

  // Attach stream once the <video> is mounted (avoids race where srcObject
  // is set before the element exists in the DOM).
  useEffect(() => {
    const v = videoRef.current;
    const s = streamRef.current;
    if (cameraActive && v && s && v.srcObject !== s) {
      v.srcObject = s;
      v.play().catch(() => {});
    }
  }, [cameraActive]);

  async function startCamera() {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraActive(true);
    } catch (e) {
      setCameraError(e instanceof Error ? e.message : "Camera unavailable. You can upload an image instead.");
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  }

  async function captureFromVideo() {
    const v = videoRef.current;
    if (!v || !v.videoWidth) return;
    const max = 1024;
    const scale = Math.min(1, max / Math.max(v.videoWidth, v.videoHeight));
    const w = Math.round(v.videoWidth * scale);
    const h = Math.round(v.videoHeight * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(v, 0, 0, w, h);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    stopCamera();
    await runAnalysis(dataUrl);
  }

  async function handleFile(file: File) {
    const dataUrl = await downscaleToDataUrl(file, 1024);
    await runAnalysis(dataUrl);
  }

  async function runAnalysis(dataUrl: string) {
    setError(null);
    setResult(null);
    setSaved(false);
    setImageUrl(dataUrl);
    setLoading(true);
    try {
      const res = (await analyze({ data: { imageDataUrl: dataUrl, goal: goalLabel, mode } })) as ScanResult;
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!result || !user) return;
    try {
      await save({
        data: {
          food_name: result.food_name || "Unknown",
          calories_kcal: result.calories_kcal ?? 0,
          sugar_g: result.sugar_g ?? 0,
          carbs_g: result.carbs_g ?? 0,
          protein_g: result.protein_g ?? 0,
          fiber_g: result.fiber_g ?? 0,
          salt_level: result.salt_level,
          health_score: typeof result.health_score === "number" ? Math.round(result.health_score) : undefined,
          recommendation: result.recommendation,
          goal: goalLabel,
        },
      });
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save meal");
    }
  }

  function reset() {
    setImageUrl(null);
    setResult(null);
    setError(null);
    setSaved(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/5 via-card to-brand-blue/5 p-5 md:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Live AI scanner</p>
          <h3 className="mt-1 text-xl font-bold md:text-2xl">Point the camera at any food</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Goal: <span className="font-semibold text-foreground">{goalLabel}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(imageUrl || result || error) && (
            <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted">
              <RefreshCw className="h-3.5 w-3.5" /> Scan again
            </button>
          )}
          {onClose && (
            <button onClick={() => { stopCamera(); onClose(); }} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card hover:bg-muted" title="Close">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {([
          { id: "food", label: "Mad", icon: Utensils, hint: "Foto af måltid" },
          { id: "menu", label: "Menukort", icon: ScrollText, hint: "Vælger bedste ret" },
          { id: "recipe", label: "Opskrift", icon: ClipboardList, hint: "Læser eksakte gram" },
        ] as const).map((m) => {
          const Icon = m.icon;
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${active ? "border-primary bg-primary text-primary-foreground shadow" : "border-border bg-card text-foreground hover:bg-muted"}`}
              title={m.hint}
            >
              <Icon className="h-3.5 w-3.5" /> {m.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">

        {/* Camera / image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-black">
          {/* Video viewfinder */}
          {cameraActive && !imageUrl && (
            <>
              <video ref={videoRef} playsInline muted className="h-full w-full object-cover" />
              {/* viewfinder reticle */}
              <div className="pointer-events-none absolute inset-6 rounded-2xl border-2 border-white/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.25)]" />
              <div className="absolute inset-x-0 bottom-4 flex justify-center">
                <button
                  onClick={captureFromVideo}
                  className="group inline-flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-2xl ring-4 ring-white/30 transition active:scale-95"
                  aria-label="Capture"
                >
                  <span className="h-12 w-12 rounded-full bg-primary transition group-active:bg-primary/80" />
                </button>
              </div>
              <div className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                Live
              </div>
            </>
          )}

          {/* Captured image preview */}
          {imageUrl && <img src={imageUrl} alt="Scanned food" className="h-full w-full object-cover" />}

          {/* Idle state */}
          {!cameraActive && !imageUrl && (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-muted p-6 text-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <Camera className="h-7 w-7" />
              </span>
              <p className="text-sm text-muted-foreground">
                {mode === "recipe" && "Tag billede af en opskrift — AI'en læser de eksakte gram og lægger ingredienserne sammen."}
                {mode === "menu" && "Tag billede af et menukort — AI'en finder den ret der passer bedst til dit mål."}
                {mode === "food" && "Start live-kameraet og tryk for at scanne, eller upload et billede af din mad."}
              </p>
              {cameraError && (
                <p className="text-xs text-destructive">{cameraError}</p>
              )}
              <div className="flex flex-wrap justify-center gap-2">
                <button onClick={startCamera} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow">
                  <Camera className="h-4 w-4" /> Start live camera
                </button>
                <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-muted">
                  <Upload className="h-4 w-4" /> Upload image
                </button>
              </div>
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
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/85 backdrop-blur">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Analyzing with AI…</p>
            </div>
          )}
        </div>

        {/* Result */}
        <div className="rounded-2xl border border-border bg-card p-5">
          {!result && !error && !loading && (
            <div className="flex h-full flex-col items-center justify-center text-center text-sm text-muted-foreground">
              <Sparkles className="mb-3 h-6 w-6 text-primary" />
              Your personalized nutrition estimate will appear here.
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

          {result && (
            <div className="space-y-4">
              <ScanResultView result={result} />
              {user ? (
                <button
                  onClick={handleSave}
                  disabled={saved}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow disabled:opacity-60"
                >
                  {saved ? <><Check className="h-4 w-4" /> Saved to today (+5 XP)</> : <><Trophy className="h-4 w-4" /> Save to today's log</>}
                </button>
              ) : (
                <Link to="/auth" className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">
                  Sign in to save meals & earn XP
                </Link>
              )}
            </div>
          )}
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

      {result.recommendation && (
        <div className="rounded-xl border border-primary/30 bg-primary/10 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Recommendation
          </div>
          <p className="mt-1 text-sm font-medium leading-snug">{result.recommendation}</p>
        </div>
      )}
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
