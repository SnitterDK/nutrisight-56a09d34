import { Lightbulb, Activity, Info, AlertTriangle, ArrowDown, Leaf, ExternalLink, BookOpen, Eye, Scale } from "lucide-react";
import { Section } from "@/components/Section";

export function NutritionEducation() {
  return (
    <>
      {/* SECTION 1: Why visual nutrition matters */}
      <Section
        eyebrow="Education"
        title="Why visual nutrition matters"
        subtitle="Nutrition labels can be hard to understand in the moment. Calories, grams of sugar, carbohydrates, salt, protein and fiber are useful numbers, but many people do not know what they mean when they are about to choose food."
      >
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card/60 p-6 text-center text-muted-foreground md:p-8 md:text-lg">
          NutriSight makes nutrition easier to understand by translating complex food data into simple
          visual guidance. Instead of only showing numbers after a meal, NutriSight helps people
          understand the likely impact <strong className="text-foreground">before</strong> they eat.
        </div>

        {/* From numbers to decisions card */}
        <div className="mx-auto mt-8 max-w-3xl rounded-3xl border border-border bg-card p-7 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/15 text-brand-blue-foreground">
              <Eye className="h-5 w-5" />
            </span>
            <h3 className="text-lg font-semibold">From numbers to decisions</h3>
          </div>
          <ul className="mt-5 space-y-3">
            {[
              "Calories, sugar, carbs, protein, fiber and salt are often difficult to interpret",
              "NutriSight turns food data into simple visual guidance",
              "For sugary foods, it can show sugar-cube impact",
              "For rice, bread, pasta and potatoes, it shows carbohydrate or blood-glucose impact estimates",
              "The app compares options based on the user's personal goal and today's intake",
            ].map((text) => (
              <li key={text} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* SECTION 2: Why glucose impact matters */}
      <Section
        eyebrow="Glucose science"
        title="Why glucose impact matters"
        subtitle="Some foods do not taste sweet, but can still have a strong effect on blood glucose. Foods such as rice, bread, pasta and potatoes contain starch, which is a type of carbohydrate. During digestion, many carbohydrates are broken down into glucose, which enters the bloodstream and can raise blood glucose levels."
      >
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card/60 p-6 text-center text-muted-foreground md:p-8 md:text-lg">
          Dr. David Unwin's sugar infographics helped make this idea easier to understand by comparing
          the <strong className="text-foreground">blood-glucose effect</strong> of common foods with
          teaspoons of table sugar. NutriSight builds on that communication idea by making nutrition
          impact visual, simple and personal.
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {/* What is glucose? */}
          <div className="rounded-3xl border border-border bg-card p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/15 text-brand-blue-foreground">
                <BookOpen className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-semibold">What is glucose?</h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Glucose is a sugar in the blood and an important energy source for the body. After eating
              carbohydrates, the body breaks many of them down into glucose. This is normal, but large
              or frequent glucose spikes may matter for people who want stable energy, weight
              management, or better blood-sugar awareness.
            </p>
          </div>

          {/* Why this matters */}
          <div className="rounded-3xl border border-border bg-card p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Scale className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-semibold">Why this matters</h3>
            </div>
            <ul className="mt-4 space-y-3">
              {[
                "Calories do not tell the whole story",
                "A food can be low in sugar but high in starch or carbohydrate",
                "Portion size changes the impact",
                "Protein, fat and fiber can slow digestion and change the response",
                "People have different goals, so guidance should be personal",
              ].map((text) => (
                <li key={text} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* SECTION 3: Same meal size, different impact */}
      <Section
        eyebrow="Visual comparison"
        title="Same meal size, different impact"
        subtitle="These simplified examples show how different foods can affect glucose and energy differently."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {/* Donut */}
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-7 text-center shadow-sm">
            <div className="absolute right-4 top-4 rounded-full bg-destructive/10 px-3 py-1 text-[11px] font-bold text-destructive">
              High sugar impact
            </div>
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center">
              {/* Donut visual */}
              <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-amber-300 to-rose-400 ring-4 ring-amber-100">
                <div className="absolute inset-[28%] rounded-full bg-card" />
              </div>
            </div>
            <h3 className="text-lg font-bold">Donut</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Fast energy, high sugar, lower fiber
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-6 w-6 rounded-sm bg-gradient-to-br from-white to-amber-100 shadow-sm ring-1 ring-amber-200"
                />
              ))}
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground">~6 sugar cubes worth of glucose effect</p>
          </div>

          {/* Rice bowl */}
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-7 text-center shadow-sm">
            <div className="absolute right-4 top-4 rounded-full bg-warning/15 px-3 py-1 text-[11px] font-bold text-warning-foreground">
              High carbohydrate impact
            </div>
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center">
              {/* Rice bowl visual */}
              <div className="relative flex h-16 w-16 items-end justify-center">
                <div className="h-10 w-14 rounded-b-2xl bg-gradient-to-t from-slate-200 to-white ring-1 ring-slate-200" />
                <div className="absolute -top-1 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-2.5 w-2.5 rounded-full bg-slate-100 ring-1 ring-slate-200" />
                  ))}
                </div>
              </div>
            </div>
            <h3 className="text-lg font-bold">Rice bowl</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              May not taste sweet, but starch can break down into glucose
            </p>
            <div className="mt-4 h-3 w-full rounded-full bg-muted">
              <div className="h-3 w-4/5 rounded-full bg-gradient-to-r from-brand-blue to-warning" />
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground">High blood-glucose effect</p>
          </div>

          {/* Salad */}
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-7 text-center shadow-sm">
            <div className="absolute right-4 top-4 rounded-full bg-success/15 px-3 py-1 text-[11px] font-bold text-success-foreground">
              Lower glucose impact
            </div>
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center">
              {/* Salad visual */}
              <div className="relative flex h-16 w-16 items-end justify-center">
                <div className="h-10 w-14 rounded-b-2xl bg-gradient-to-t from-emerald-100 to-white ring-1 ring-emerald-200" />
                <Leaf className="absolute -top-1 h-6 w-6 text-emerald-500" />
              </div>
            </div>
            <h3 className="text-lg font-bold">Salad</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Depends on dressing, toppings and portion size
            </p>
            <div className="mt-4 h-3 w-full rounded-full bg-muted">
              <div className="h-3 w-1/4 rounded-full bg-gradient-to-r from-success to-emerald-300" />
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground">Lower blood-glucose effect</p>
          </div>
        </div>

        <div className="mx-auto mt-6 flex max-w-2xl items-start gap-3 rounded-2xl border border-border bg-surface p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            These are simplified estimates for education. Real nutrition depends on portion size,
            ingredients, preparation and the individual.
          </p>
        </div>
      </Section>

      {/* SECTION 3b: Low-carb / ketogenic focus */}
      <Section
        eyebrow="Low-carb & keto"
        title="A ketogenic focus — explained honestly"
        subtitle="When carbohydrate intake stays very low, the liver makes ketones from fat instead of relying on glucose. NutriSight now includes a Ketogenic / low-carb focus goal that scores every scan on net carbs and sugar load."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-success/15 text-success-foreground">
                <Leaf className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-semibold">What research supports</h3>
            </div>
            <ul className="mt-4 space-y-3">
              {[
                "Established medical therapy for drug-resistant epilepsy",
                "Improved blood-sugar control and triglycerides for many with type 2 diabetes or insulin resistance",
                "Lower appetite and fewer glucose spikes for many people",
                "Researchers are studying ketogenic diets and fasting alongside standard cancer treatment — this is early, experimental science",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-border bg-card p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-warning/15 text-warning-foreground">
                <ArrowDown className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-semibold">What it is not</h3>
            </div>
            <ul className="mt-4 space-y-3">
              {[
                "A diet is not a treatment for cancer and cannot replace oncology care",
                "Unintended weight loss during illness or treatment can be harmful",
                "Not suitable for everyone — pregnancy, type 1 diabetes, eating-disorder history, kidney or liver disease",
                "A moderate low-carb pattern gives most of the blood-sugar benefit with less restriction",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-6 flex max-w-2xl items-start gap-3 rounded-2xl border border-border bg-surface p-4">
          <Activity className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Educational information only. Always discuss diet changes with a qualified clinician — especially
            during illness, cancer treatment, pregnancy or when taking medication.
          </p>
        </div>
      </Section>

      {/* SECTION 4: Source / inspiration */}
      <section className="container-page py-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-surface p-6 md:p-8">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Lightbulb className="h-4 w-4 text-primary" />
            Visual nutrition inspiration
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Dr. David Unwin / Public Health Collaboration sugar infographics.
          </p>
          <a
            href="https://phcuk.org/resources/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            phcuk.org/resources
          </a>
        </div>
      </section>

      {/* SECTION 5: Safety note */}
      <section className="container-page pb-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-warning/10 p-6 md:p-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-1 text-warning" />
            <div>
              <p className="text-sm font-semibold text-foreground">Important note</p>
              <p className="mt-2 text-sm text-muted-foreground">
                NutriSight provides estimated nutrition guidance and is not medical advice. Nutrition
                estimates may be inaccurate. People with diabetes, eating disorders, pregnancy, medical
                conditions or special dietary needs should consult a qualified healthcare professional.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
