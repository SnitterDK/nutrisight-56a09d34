import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  GraduationCap, Trophy, Check, Sparkles, Brain, Zap, Heart,
  Droplets, Flame, Wheat, Beef, Activity,
} from "lucide-react";
import { Section } from "@/components/Section";
import { useAuth } from "@/hooks/useAuth";
import { completeLesson, getMyLessons } from "@/lib/learning.functions";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learn — NutriSight" },
      { name: "description", content: "Short, science-based lessons on sugar, fat, calories, protein and more. Earn XP for every lesson you finish." },
      { property: "og:title", content: "Learn nutrition — NutriSight" },
      { property: "og:description", content: "Tiny lessons. Real understanding. Earn XP as you go." },
    ],
  }),
  component: LearnPage,
});

type Lesson = {
  key: string;
  title: string;
  eyebrow: string;
  icon: React.ComponentType<{ className?: string }>;
  xp: number;
  why: string;
  body: string[];
  takeaway: string;
};

const LESSONS: Lesson[] = [
  {
    key: "sugar-and-fat",
    eyebrow: "Sugar 101",
    title: "What does sugar actually do to body fat?",
    icon: Droplets,
    xp: 20,
    why: "Sugar is the #1 hidden driver of weight gain in modern diets.",
    body: [
      "When you eat sugar, your blood glucose spikes fast. Your pancreas releases insulin to bring it back down.",
      "Insulin's job isn't just to lower blood sugar — it's also a 'storage' signal. While insulin is high, your body stops burning fat and starts storing it.",
      "Excess sugar your body can't burn right away is converted into fat in the liver (de novo lipogenesis) and stored around the belly and organs.",
      "Liquid sugar (soda, juice, sweetened coffee) is worst: no fiber, no chewing, instant spike.",
    ],
    takeaway: "Less sugar → less insulin → more time burning fat. NutriSight shows sugar as cubes so spikes become visible.",
  },
  {
    key: "calories-101",
    eyebrow: "Energy",
    title: "What is a calorie, really?",
    icon: Flame,
    xp: 15,
    why: "Calories aren't moral — they're just energy. But where they come from changes everything.",
    body: [
      "A calorie is a unit of energy. Your body burns calories 24/7 just to stay alive (your basal metabolic rate).",
      "Eat more calories than you burn → surplus is stored (mostly as fat). Eat less → your body taps stored energy.",
      "But 200 kcal of soda hits your hormones very differently than 200 kcal of eggs. Protein and fiber trigger fullness; sugar doesn't.",
      "Don't obsess over numbers. Focus on quality first — calories balance themselves when food is real and satisfying.",
    ],
    takeaway: "Calories matter, but quality (protein, fiber, real food) is the lever that makes the count easy.",
  },
  {
    key: "protein-power",
    eyebrow: "Macros",
    title: "Why protein is the cheat-code macro",
    icon: Beef,
    xp: 15,
    why: "Most people under-eat protein and over-eat sugar and refined carbs.",
    body: [
      "Protein keeps you full longer — it's the most satiating macronutrient by far.",
      "It protects muscle when you lose weight, so you lose fat (not muscle and water).",
      "It costs more energy to digest (the 'thermic effect') than carbs or fat — you literally burn more just eating it.",
      "Good sources: eggs, yogurt, chicken, fish, tofu, legumes, cottage cheese.",
    ],
    takeaway: "Aim for protein at every meal. NutriSight scores protein toward your daily target so it's visible.",
  },
  {
    key: "fiber-friend",
    eyebrow: "Gut",
    title: "Fiber: the most underrated nutrient",
    icon: Wheat,
    xp: 10,
    why: "Fiber slows sugar absorption, feeds gut bacteria, and keeps you full.",
    body: [
      "Fiber doesn't get digested by you — it gets digested by trillions of friendly bacteria in your gut.",
      "Soluble fiber (oats, beans, fruit) slows down how fast sugar hits your blood. That blunts insulin spikes.",
      "Insoluble fiber (vegetables, whole grains) keeps things moving and supports gut barrier health.",
      "Most adults eat half the recommended 25–30g/day.",
    ],
    takeaway: "Add fiber to every carb-heavy meal — fruit with breakfast, veg with lunch and dinner.",
  },
  {
    key: "glucose-spikes",
    eyebrow: "Blood sugar",
    title: "Glucose spikes — why they age you faster",
    icon: Activity,
    xp: 20,
    why: "Big spikes and crashes drive cravings, brain fog, energy dips and long-term disease risk.",
    body: [
      "A 'glucose spike' is a fast, big jump in blood sugar after a meal. The crash that follows triggers cravings — usually for more sugar.",
      "Repeated spikes inflame blood vessels, accelerate skin aging (glycation), and over time increase risk of insulin resistance and type 2 diabetes.",
      "You can flatten spikes with simple tricks: eat veggies/protein BEFORE carbs, add vinegar, walk 10 minutes after eating, never eat carbs naked (always pair).",
    ],
    takeaway: "Order and pairing matters as much as the food itself. NutriSight flags high-impact carbs so you can pair smart.",
  },
  {
    key: "ultra-processed",
    eyebrow: "Real food",
    title: "Why 'ultra-processed' is the new villain",
    icon: Brain,
    xp: 15,
    why: "Ultra-processed foods are engineered to override your fullness signals.",
    body: [
      "Ultra-processed foods (UPFs) are industrial formulations: refined oils, syrups, emulsifiers, flavors, colors. Think chips, candy, instant noodles, packaged pastries.",
      "They're hyperpalatable — designed to make you eat past fullness. A 2019 NIH study showed people ate ~500 extra calories/day on UPFs vs. whole foods.",
      "Even 'healthy' UPFs (protein bars, flavored yogurts) often hide added sugar and weird additives.",
      "Read the ingredient list. If you don't recognize half the words, it's probably ultra-processed.",
    ],
    takeaway: "Shift toward whole foods you cook (or recognize) — your fullness signals come back.",
  },
  {
    key: "salt-truth",
    eyebrow: "Sodium",
    title: "Salt: helpful in food, harmful from packets",
    icon: Zap,
    xp: 10,
    why: "Most salt overload comes from packaged food, not your salt shaker.",
    body: [
      "Salt itself isn't the enemy — your body needs sodium for nerves, muscles and hydration.",
      "The problem is dose: ultra-processed foods sneak 1500–3000mg of sodium into a single meal.",
      "Too much sodium for too long raises blood pressure in salt-sensitive people, stressing heart and kidneys.",
      "Cooking from scratch with normal salt is fine. Eating two restaurant meals + a frozen pizza is not.",
    ],
    takeaway: "Cook more. Salt your own food. Cap restaurant + packaged meals.",
  },
  {
    key: "habit-loop",
    eyebrow: "Behavior",
    title: "Streaks beat motivation — every time",
    icon: Heart,
    xp: 10,
    why: "You don't need willpower. You need a streak you don't want to break.",
    body: [
      "Motivation is unreliable. Habits run on autopilot once they're built.",
      "Tiny, consistent actions (one scan, one smarter swap) compound into a body and brain that prefer healthy choices.",
      "Apps that show your streak hijack your brain's reward system — for once, in your favor.",
      "Skip a day? No drama. Skip two? Reset gently.",
    ],
    takeaway: "Open NutriSight before one meal a day. That's the whole game.",
  },
];

function LearnPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const fetch = useServerFn(getMyLessons);
  const complete = useServerFn(completeLesson);
  const { data } = useQuery({ queryKey: ["lessons"], queryFn: () => fetch(), enabled: !!user });
  const mut = useMutation({
    mutationFn: (vars: { key: string; xp: number }) => complete({ data: { lesson_key: vars.key, xp_earned: vars.xp } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lessons"] });
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
  });
  const completed = new Set((data ?? []).map((l) => l.lesson_key));
  const totalXp = (data ?? []).reduce((s, l) => s + l.xp_earned, 0);
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <section className="container-page pt-14 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <GraduationCap className="h-3.5 w-3.5" /> NutriSight Academy
        </span>
        <h1 className="mx-auto mt-4 max-w-2xl text-4xl font-extrabold leading-tight md:text-5xl">
          Learn what food is <span className="gradient-text">actually doing</span> to your body.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Tiny, science-based lessons on sugar, fat, calories, protein and more. Finish a lesson, earn XP, build your knowledge.
        </p>

        {user ? (
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold shadow-sm">
            <Trophy className="h-4 w-4 text-primary" />
            {completed.size} / {LESSONS.length} lessons · {totalXp} XP earned
          </div>
        ) : (
          <div className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/auth" className="font-semibold text-primary hover:underline">Sign in</Link> to save your progress and earn XP.
          </div>
        )}
      </section>

      <Section eyebrow="Lessons" title="Pick a topic">
        <div className="grid gap-4 md:grid-cols-2">
          {LESSONS.map((lesson) => {
            const done = completed.has(lesson.key);
            const isOpen = open === lesson.key;
            const Icon = lesson.icon;
            return (
              <article key={lesson.key} className={`rounded-3xl border bg-card p-6 transition ${done ? "border-success/40" : "border-border"}`}>
                <div className="flex items-start gap-4">
                  <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${done ? "bg-success/15 text-success" : "bg-primary/10 text-primary"}`}>
                    {done ? <Check className="h-5 w-5" /> : <Icon className="h-6 w-6" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{lesson.eyebrow} · +{lesson.xp} XP</p>
                    <h3 className="mt-1 text-lg font-bold leading-snug">{lesson.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{lesson.why}</p>
                  </div>
                </div>

                {isOpen && (
                  <div className="mt-5 space-y-3 border-t border-border pt-5 text-sm leading-relaxed">
                    {lesson.body.map((p, i) => <p key={i}>{p}</p>)}
                    <div className="rounded-xl border border-primary/30 bg-primary/10 p-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-primary">Takeaway</p>
                      <p className="mt-1 font-semibold">{lesson.takeaway}</p>
                    </div>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => setOpen(isOpen ? null : lesson.key)}
                    className="rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold hover:bg-muted"
                  >
                    {isOpen ? "Hide lesson" : "Read lesson"}
                  </button>

                  {user ? (
                    done ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1.5 text-xs font-semibold text-success">
                        <Check className="h-3.5 w-3.5" /> Completed
                      </span>
                    ) : (
                      <button
                        onClick={() => mut.mutate({ key: lesson.key, xp: lesson.xp })}
                        disabled={mut.isPending}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow disabled:opacity-60"
                      >
                        <Sparkles className="h-3.5 w-3.5" /> Mark complete · +{lesson.xp} XP
                      </button>
                    )
                  ) : (
                    <Link to="/auth" className="text-xs font-semibold text-primary hover:underline">Sign in to earn XP</Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </Section>
    </>
  );
}
