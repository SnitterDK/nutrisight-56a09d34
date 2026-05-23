import { createFileRoute, Link } from "@tanstack/react-router";
import { Target, Camera, Brain, Sparkles, ArrowRight } from "lucide-react";
import { Section } from "@/components/Section";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works — NutriSight" },
      { name: "description", content: "Four simple steps: choose a goal, scan, estimate impact, and get a personal recommendation before you eat." },
      { property: "og:title", content: "How NutriSight works" },
      { property: "og:description", content: "Goal → scan → estimate → personal recommendation, in real time." },
    ],
  }),
  component: HowItWorks,
});

const STEPS = [
  { icon: Target, title: "Choose your goal", body: "Lose weight, reduce sugar, eat more protein, stabilize blood sugar, eat more fiber, reduce salt, or healthier choices overall. Your goal shapes every recommendation." },
  { icon: Camera, title: "Scan food, a menu or a meal", body: "Open NutriSight and point your camera at a plate, café counter or printed menu. AI vision recognizes dishes and ingredients in seconds." },
  { icon: Brain, title: "NutriSight estimates nutrition impact", body: "Estimated calories, sugar, carbs, protein, fiber and salt — plus a blood-sugar impact estimate for carb-heavy foods." },
  { icon: Sparkles, title: "Get a personal recommendation before eating", body: "Combined with your goal and what you've already eaten today, NutriSight gives a clear suggestion you can act on right now." },
];

function HowItWorks() {
  return (
    <>
      <section className="container-page pt-14 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">How it works</p>
        <h1 className="mt-2 text-4xl font-bold md:text-5xl">From camera to confident choice in seconds.</h1>
      </section>

      <Section>
        <ol className="mx-auto max-w-3xl space-y-5">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <li key={title} className="flex gap-5 rounded-3xl border border-border bg-card p-6 md:p-8">
              <div className="flex flex-col items-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold">
                  {i + 1}
                </span>
                {i < STEPS.length - 1 && <div className="mt-3 h-full w-px bg-border" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">{title}</h2>
                </div>
                <p className="mt-2 text-muted-foreground">{body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 text-center">
          <Link to="/demo" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20">
            Try it in the demo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
