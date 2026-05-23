import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Camera, Brain, Target, Sparkles, Clock, EyeOff, Utensils,
  Apple, ScanLine, ChartBar, BadgeCheck, Glasses, ShieldAlert,
  Cpu, Building2, Heart, ArrowRight,
} from "lucide-react";
import { PhoneMockup } from "@/components/PhoneMockup";
import { Section } from "@/components/Section";

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
  return (
    <>
      {/* HERO */}
      <section className="container-page grid items-center gap-12 pb-12 pt-16 md:grid-cols-2 md:pt-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Real-time AI nutrition assistant
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] md:text-6xl">
            Understand food <span className="gradient-text">before</span> you eat it.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            NutriSight uses AI vision, personal goals and meal memory to help people choose
            healthier food in real time — from photos, menus and future AI glasses.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/demo" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90">
              Try the demo <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/how-it-works" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold transition hover:bg-muted">
              How it works
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-primary" /> Personalized to your goals</div>
            <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Decisions in seconds</div>
            <div className="flex items-center gap-2"><Glasses className="h-4 w-4 text-primary" /> AI-glasses ready</div>
          </div>
        </div>
        <PhoneMockup />
      </section>

      {/* PROBLEM */}
      <Section
        eyebrow="The problem"
        title="Most nutrition apps track food after you eat."
        subtitle="NutriSight helps you decide before you eat."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: EyeOff, title: "Hidden in plain sight", body: "People don't see hidden calories, sugar, carbs, salt and portion sizes in everyday meals." },
            { icon: Clock, title: "Tracking is too slow", body: "Manual calorie logging is annoying, easy to forget, and happens long after the choice was made." },
            { icon: Utensils, title: "Real-time decisions", body: "Food decisions happen at cafés, restaurants, supermarkets and home — not later in an app." },
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

      {/* SOLUTION */}
      <Section
        eyebrow="The solution"
        title="Turn your camera into a real-time food intelligence assistant."
      >
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { icon: Target, title: "Choose your goal", body: "Lose weight, reduce sugar, eat more protein and more." },
            { icon: Camera, title: "Scan", body: "Snap food, a menu or a meal — phone today, glasses tomorrow." },
            { icon: Brain, title: "Estimate impact", body: "AI estimates calories, sugar, carbs, protein, fiber and salt." },
            { icon: Sparkles, title: "Get a recommendation", body: "Personalized to your goals and what you ate today." },
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
        <div className="mt-10 flex justify-center">
          <Link to="/demo" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20">
            Try the interactive demo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* SUGAR CUBE */}
      <Section
        eyebrow="Visual intelligence"
        title="Sugar-cube & carb-impact visuals"
        subtitle="For sugary foods we show estimated sugar as simple sugar cubes. For foods like rice, bread and pasta, NutriSight shows carbohydrate impact separately."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-7">
            <p className="text-sm font-semibold text-muted-foreground">Soda 330ml</p>
            <h3 className="text-2xl font-bold">~9 sugar cubes</h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-9 w-9 rounded-md bg-gradient-to-br from-white to-amber-100 shadow-md ring-1 ring-amber-200" />
              ))}
            </div>
            <p className="mt-5 text-sm text-muted-foreground">Estimated added sugar shown as cubes for instant intuition.</p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-7">
            <p className="text-sm font-semibold text-muted-foreground">Bowl of white rice</p>
            <h3 className="text-2xl font-bold">High carbohydrate impact</h3>
            <div className="mt-5 h-3 w-full rounded-full bg-muted">
              <div className="h-3 w-4/5 rounded-full bg-gradient-to-r from-brand-blue to-warning" />
            </div>
            <p className="mt-3 text-sm font-medium">Estimated blood-sugar impact: <span className="text-warning-foreground">~80 / 100</span></p>
            <p className="mt-3 text-sm text-muted-foreground">
              Rice doesn't contain sugar cubes — we show its <em>carbohydrate impact</em> and estimated
              blood-sugar effect instead. Clear, honest, never misleading.
            </p>
          </div>
        </div>
      </Section>

      {/* AI AGENTS */}
      <Section
        eyebrow="Under the hood"
        title="A team of specialized AI agents"
        subtitle="These agents work together to recognize food, estimate nutrition, understand your goals, remember previous meals, and recommend better choices in real time."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: ScanLine, name: "Food Recognition Agent", body: "Identifies dishes, ingredients and portions from camera input." },
            { icon: Utensils, name: "Menu Understanding Agent", body: "Reads café and restaurant menus to extract real choices." },
            { icon: ChartBar, name: "Nutrition Estimation Agent", body: "Estimates calories, sugar, carbs, protein, fiber and salt." },
            { icon: Brain, name: "Personal Meal Memory Agent", body: "Remembers what you ate today to keep guidance personal." },
            { icon: Sparkles, name: "Recommendation Agent", body: "Matches choices to your goal and remaining daily budget." },
            { icon: ShieldAlert, name: "Safety & Disclaimer Agent", body: "Adds disclaimers and avoids medical claims." },
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

      {/* BUILT WITH */}
      <Section eyebrow="Built with" title="Modern AI & cloud stack">
        <div className="flex flex-wrap justify-center gap-2.5">
          {[
            "Gemini API", "Google AI Studio", "Google Cloud", "Firebase", "Firestore",
            "Cloud Storage", "React", "TypeScript", "Camera vision", "Nutrition databases",
            "Personal meal memory", "AI agent orchestration",
          ].map((t) => (
            <span key={t} className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm">
              {t}
            </span>
          ))}
        </div>
      </Section>

      {/* BUSINESS */}
      <Section
        eyebrow="Business model"
        title="Free for users first. Premium and B2B later."
      >
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {[
            { icon: Apple, title: "Free app", body: "Viral user growth with a powerful free tier." },
            { icon: Sparkles, title: "Premium reports", body: "Deeper personal nutrition insights." },
            { icon: Heart, title: "Family & coaching", body: "Shared goals, family insights, coaches." },
            { icon: Building2, title: "B2B pilots", body: "Clinics, fitness, insurance, health coaches." },
            { icon: Cpu, title: "API / white-label", body: "For wearables and AI glasses partners." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-5">
              <Icon className="h-5 w-5 text-primary" />
              <h3 className="mt-3 text-sm font-semibold">{title}</h3>
              <p className="mt-1.5 text-xs text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* IMPACT */}
      <Section
        eyebrow="Impact"
        title="Better everyday food decisions, before the damage is done."
      >
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {[
            "Weight management",
            "Sugar reduction",
            "Diabetes-friendly awareness",
            "Healthier family choices",
            "Better restaurant & café decisions",
            "Easier nutrition understanding",
          ].map((t) => (
            <div key={t} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-success/15 text-success">
                <Heart className="h-4 w-4" />
              </span>
              <span className="text-sm font-medium">{t}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="container-page pb-24">
        <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-card to-brand-blue/15 p-10 text-center md:p-16">
          <h2 className="text-3xl font-bold md:text-4xl">See NutriSight in action</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            A polished interactive demo: pick a goal, pick a scenario, and watch a real-time
            recommendation appear — built for a 1–3 minute submission video.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/demo" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20">
              Try the demo <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/glasses" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold">
              See AI glasses vision
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
