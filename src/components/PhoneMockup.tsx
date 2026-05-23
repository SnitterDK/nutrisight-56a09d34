import { Camera, Sparkles, Check } from "lucide-react";

export function PhoneMockup() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-primary/30 via-brand-blue/20 to-transparent blur-2xl" />
      <div className="rounded-[2.5rem] border border-border bg-card p-3 shadow-2xl">
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-b from-surface to-background">
          {/* status bar */}
          <div className="flex items-center justify-between px-5 pt-4 text-[10px] font-medium text-muted-foreground">
            <span>9:41</span>
            <span>NutriSight</span>
            <span>100%</span>
          </div>
          {/* camera viewport */}
          <div className="relative mx-4 mt-3 aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-200/60 via-lime-100 to-amber-100">
            {/* faux salad + donut */}
            <div className="absolute left-4 top-6 h-24 w-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg">
              <div className="absolute inset-3 rounded-full bg-gradient-to-br from-lime-300 to-green-500 opacity-90" />
              <div className="absolute left-3 top-4 h-3 w-3 rounded-full bg-rose-400" />
              <div className="absolute right-4 top-7 h-2 w-2 rounded-full bg-orange-400" />
            </div>
            <div className="absolute bottom-8 right-5 h-20 w-20 rounded-full border-[10px] border-amber-300 bg-amber-200 shadow-lg">
              <div className="absolute -top-2 left-3 h-3 w-1 rotate-12 bg-pink-300" />
              <div className="absolute top-2 right-2 h-2 w-1 rotate-45 bg-pink-300" />
            </div>
            {/* scan frame */}
            <div className="absolute inset-6 rounded-2xl border-2 border-white/80 shadow-[0_0_0_2000px_rgba(0,0,0,0.05)]" />
            <div className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-[10px] font-medium text-white backdrop-blur">
              <span className="inline-flex items-center gap-1"><Camera className="h-3 w-3" /> Scanning…</span>
            </div>
          </div>
          {/* recommendation */}
          <div className="m-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Recommendation
            </div>
            <p className="mt-1 text-sm font-semibold leading-snug">
              Pick the salad — fits your sugar & calorie budget today.
            </p>
            <div className="mt-3 flex gap-2">
              <div className="flex-1 rounded-xl bg-success/15 px-3 py-2">
                <p className="text-[10px] text-muted-foreground">Salad</p>
                <p className="text-sm font-semibold text-success">82/100</p>
              </div>
              <div className="flex-1 rounded-xl bg-destructive/10 px-3 py-2">
                <p className="text-[10px] text-muted-foreground">Donut</p>
                <p className="text-sm font-semibold text-destructive">38/100</p>
              </div>
            </div>
            <button className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground">
              <Check className="h-3.5 w-3.5" /> Save to today's intake
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
