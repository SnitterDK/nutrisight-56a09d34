import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Camera, Brain, Target, Sparkles, Clock, EyeOff, Utensils,
  ScanLine, ChartBar, BadgeCheck, Glasses, ShieldAlert,
  Cpu, Heart, ArrowRight, GraduationCap, Trophy, Flame,
} from "lucide-react";
import { Section } from "@/components/Section";
import { LiveScanner } from "@/components/LiveScanner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NutriSight — Understand food before you eat it" },
      { name: "description", content: "AI vision, personal goals and meal memory for healthier food choices in real time." },
      { property: "og:title", content: "NutriSight — Understand food before you eat it" },
      { property: "og:description", content: "Real-time AI nutrition assistant for phones and future AI glasses." },
    ],
  }),
  component: Home,
});

function Home() {
  const [scannerOpen, setScannerOpen] = useState(false);

  return (
    <>
      {/* HERO — hybrid: pitch + big scan CTA */}
      <section className="container-page grid items-center gap-10 pb-12 pt-12 md:grid-cols-[1.05fr_1fr] md:pt-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Real-time AI nutrition assistant
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] md:text-6xl">
            Understand food <span className="gradient-text">before</span> you eat it.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            NutriSight uses live camera AI, your personal health goal and meal memory to help you
            choose better — at cafés, supermarkets, on your phone and on future AI glasses.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => setScannerOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/30 transition hover:opacity-90"
            >
              <Camera className="h-5 w-5" /> Scan a food now
            </button>
            <Link to="/learn" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-4 text-sm font-semibold transition hover:bg-muted">
              <GraduationCap className="h-4 w-4" /> Learn the science
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-primary" /> Personalized to your goals</div>
            <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Decisions in seconds</div>
            <div className="flex items-center gap-2"><Glasses className="h-4 w-4 text-primary" /> AI-glasses ready</div>
          </div>
        </div>

        {/* Inline scanner preview / trigger */}
        <button
          onClick={() => setScannerOpen(true)}
          className="group relative aspect-[3/4] overflow-hidden rounded-[2.5rem] border-4 border-foreground/10 bg-gradient-to-br from-primary/15 via-card to-brand-blue/15 p-2 shadow-2xl transition hover:shadow-primary/20"
        >
          <div className="absolute inset-2 flex flex-col items-center justify-center rounded-[2rem] bg-gradient-to-b from-black/80 to-black text-white">
            <div className="absolute inset-x-6 top-6 rounded-2xl border-2 border-white/60 p-3 text-left">
              <p className="text-[10px] font-bold uppercase tracking-wider text-success">● Live</p>
              <p className="mt-1 text-sm font-semibold">Point camera at any food</p>
            </div>
            <div className="pointer-events-none absolute inset-x-10 top-1/2 -translate-y-1/2 aspect-square rounded-2xl border-2 border-white/70" />
            <div className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-2">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-2xl ring-4 ring-white/30 transition group-hover:scale-105">
                <span className="h-12 w-12 rounded-full bg-primary" />
              </span>
              <p className="text-xs font-semibold text-white/80">Tap to open scanner</p>
            </div>
          </div>
        </button>
      </section>

      {/* SCANNER MODAL */}
      {scannerOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-background/95 backdrop-blur-xl">
          <div className="container-page py-8">
            <LiveScanner goalLabel="Healthier overall" autoOpen onClose={() => setScannerOpen(false)} />
          </div>
        </div>
      )}

      {/* WHY NUTRISIGHT */}
      <Section
        eyebrow="The problem"
        title="Most apps track food after the damage is done."
        subtitle="NutriSight helps you decide before you eat — with vision, personal goals and learning."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: EyeOff, title: "Hidden calories", body: "You can't see sugar, fat, salt and portions hiding in everyday meals." },
            { icon: Clock, title: "Tracking is slow", body: "Manual logging is annoying. The choice was already made hours ago." },
            { icon: Utensils, title: "Choices happen now", body: "Real food decisions happen at cafés, supermarkets and at home — not later in an app." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section eyebrow="The solution" title="Camera → goal → memory → recommendation.">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { icon: Target, title: "Pick your focus", body: "Less sugar, more protein, stable glucose, lose weight, etc." },
            { icon: Camera, title: "Live scan", body: "Point your camera. Tap. AI sees food, menus, café counters." },
            { icon: Brain, title: "Estimate impact", body: "Calories, sugar cubes, carbs, protein, fiber, salt — all visible." },
            { icon: Sparkles, title: "Get a recommendation", body: "Personalized to your goal and what you ate today." },
          ].map(({ icon: Icon, title, body }, i) => (
            <div key={title} className="relative rounded-3xl border border-border bg-card p-6">
              <div className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-primary-foreground">
                {String(i + 1).padStart(2, "0")}
              </div>
              <Icon className="mt-2 h-6 w-6 text-primary" />
              <h3 className="mt-3 text-base font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* LEARN + GAMIFY */}
      <Section
        eyebrow="Education + gamification"
        title="The more you learn, the smarter your choices get."
        subtitle="NutriSight isn't just a scanner — it's a coach. Each focus goal unlocks short lessons that teach the why behind the numbers. Finish lessons to earn XP, build streaks, and turn understanding into habit."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: GraduationCap, title: "Tiny science lessons", body: "What sugar actually does to body fat. Why protein is the cheat-code macro. How to flatten glucose spikes. Real science, 2-minute reads." },
            { icon: Trophy, title: "Earn XP for learning", body: "Every lesson and every scan gives you XP. See your knowledge grow alongside your healthier habits." },
            { icon: Flame, title: "Streaks beat willpower", body: "Open the app once a day, scan one meal. The streak builds. The habit builds itself." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-3xl border border-border bg-card p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-blue/15 text-brand-blue-foreground"><Icon className="h-5 w-5" /></span>
              <h3 className="mt-4 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/learn" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20">
            Open NutriSight Academy <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* SUGAR CUBES */}
      <Section eyebrow="Visual intelligence" title="Sugar cubes & carb impact — at a glance" subtitle="Numbers don't change behavior. Pictures do. NutriSight turns invisible sugar into visible cubes.">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-7">
            <p className="text-sm font-semibold text-muted-foreground">Soda 330ml</p>
            <h3 className="text-2xl font-bold">~9 sugar cubes</h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-9 w-9 rounded-md bg-gradient-to-br from-white to-amber-100 shadow-md ring-1 ring-amber-200" />
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-7">
            <p className="text-sm font-semibold text-muted-foreground">Bowl of white rice</p>
            <h3 className="text-2xl font-bold">High carbohydrate impact</h3>
            <div className="mt-5 h-3 w-full rounded-full bg-muted">
              <div className="h-3 w-4/5 rounded-full bg-gradient-to-r from-brand-blue to-warning" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Rice doesn't carry sugar cubes — we show its blood-sugar impact instead.</p>
          </div>
        </div>
      </Section>

      {/* AGENTS */}
      <Section eyebrow="Under the hood" title="A team of specialized AI agents">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: ScanLine, name: "Food Recognition Agent", body: "Identifies dishes, ingredients and portions from the camera." },
            { icon: Utensils, name: "Menu Understanding Agent", body: "Reads café and restaurant menus to extract real choices." },
            { icon: ChartBar, name: "Nutrition Estimation Agent", body: "Estimates calories, sugar, carbs, protein, fiber and salt." },
            { icon: Brain, name: "Meal Memory Agent", body: "Remembers your day to keep guidance personal, not generic." },
            { icon: GraduationCap, name: "Coach & Learning Agent", body: "Teaches the science behind every recommendation." },
            { icon: ShieldAlert, name: "Safety Agent", body: "Adds disclaimers and avoids medical claims." },
          ].map(({ icon: Icon, name, body }) => (
            <div key={name} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/15 text-brand-blue-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-sm font-semibold">{name}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* TECH */}
      <Section eyebrow="Built with" title="Modern AI & cloud stack">
        <div className="flex flex-wrap justify-center gap-2.5">
          {["Gemini 2.5 Flash", "Lovable AI Gateway", "Lovable Cloud", "TanStack Start", "React 19", "TypeScript", "Tailwind v4", "Camera vision"].map((t) => (
            <span key={t} className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm">{t}</span>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="container-page pb-24">
        <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-card to-brand-blue/15 p-10 text-center md:p-16">
          <h2 className="text-3xl font-bold md:text-4xl">Start scanning. Start learning.</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Create a free account to save scans, build streaks and earn XP as you learn what food really does to your body.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={() => setScannerOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20">
              <Camera className="h-4 w-4" /> Scan a food
            </button>
            <Link to="/auth" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold">
              <Heart className="h-4 w-4" /> Create account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
