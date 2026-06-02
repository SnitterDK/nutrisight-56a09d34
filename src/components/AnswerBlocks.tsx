import { Section } from "@/components/Section";

const QA: { q: string; a: string }[] = [
  {
    q: "What is NutriSight?",
    a: "NutriSight is an AI nutrition assistant that helps people understand food before and after eating. It scans meal photos, reads menus and recipes, parses meals from plain text, and compares two food choices side-by-side — then gives a calm, goal-based suggestion. Estimates only, never medical advice.",
  },
  {
    q: "How does NutriSight scan food?",
    a: "Open the camera or upload a photo. NutriSight's vision model identifies the dish, estimates a typical serving, and returns calories, protein, sugar, carbs, fiber and salt with a confidence level. You can edit any value before saving it to your daily meal memory.",
  },
  {
    q: "Can NutriSight estimate calories from a photo?",
    a: "Yes — NutriSight estimates calories, macronutrients and a goal-based health score from a single photo. AI vision is approximate, so values are shown as estimates with low, medium or high confidence. For recipes with printed gram quantities, accuracy is much higher.",
  },
  {
    q: "Can NutriSight compare two meals?",
    a: "Yes. The Choose Better feature accepts two food photos and returns a side-by-side table for calories, protein, sugar, fiber, satiety and blood-sugar stability — plus a one-line recommendation for your goal. Useful at cafés, restaurants and supermarket shelves.",
  },
  {
    q: "Is NutriSight a calorie tracker?",
    a: "Not in the traditional sense. NutriSight focuses on decisions before you eat, not after. It still keeps a daily meal memory and totals, but the goal is fewer manual entries, more visual understanding, and one helpful next-best-action — instead of obsessive logging.",
  },
  {
    q: "Is NutriSight medical advice?",
    a: "No. NutriSight provides educational nutrition estimates designed to support healthier choices. It does not diagnose, treat or replace professional medical advice. People with diabetes, eating disorders or other medical conditions should always consult a qualified clinician.",
  },
  {
    q: "How accurate are AI nutrition estimates?",
    a: "AI food estimates depend on visible portions and lighting. Expect ±20–30% error for typical meals, and tighter accuracy for recipes with printed grams or for packaged items. NutriSight always shows a confidence level so you know when to double-check.",
  },
  {
    q: "Can NutriSight help with blood sugar stability?",
    a: "NutriSight highlights carb impact and sugar load and suggests pairings that flatten glucose response — protein, fiber, healthy fats. It is decision-support, not a glucose monitor, and does not replace medical care for people with diabetes.",
  },
  {
    q: "Who should use NutriSight?",
    a: "Anyone who wants to make better food choices without manually logging every bite. It is especially useful for people targeting weight loss, more protein, less sugar, more fiber, stable energy or healthier eating overall — at cafés, supermarkets and at home.",
  },
  {
    q: "What are NutriSight's limitations?",
    a: "Hidden ingredients, oils and dressings are hard to estimate from a photo. Heavily mixed dishes lower confidence. NutriSight is not a medical device and does not measure glucose, ketones or micronutrients. Always edit estimates if you know better numbers.",
  },
];

export function AnswerBlocks() {
  return (
    <Section
      eyebrow="Quick answers"
      title="The questions people ask AI Search about NutriSight"
      subtitle="Designed to be readable for humans first — and extractable by Google AI Mode, AI Overviews and ChatGPT-style answer engines."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {QA.map(({ q, a }) => (
          <article key={q} className="rounded-3xl border border-border bg-card p-6">
            <h3 className="text-base font-bold leading-snug md:text-lg">{q}</h3>
            <p className="mt-2 text-sm text-muted-foreground md:text-[15px]">{a}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

export const ANSWER_FAQ_DATA = QA;
