import { Section } from "@/components/Section";
import { Check, X } from "lucide-react";

export function ComparisonTables() {
  return (
    <>
      <Section
        eyebrow="vs traditional trackers"
        title="NutriSight vs the calorie-tracking app you tried last year"
        subtitle="Most apps log food after the damage is done. NutriSight is built to help you decide before you eat."
      >
        <div className="overflow-x-auto rounded-3xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left">
                <th className="p-4 font-semibold text-muted-foreground">Capability</th>
                <th className="p-4 font-semibold">NutriSight</th>
                <th className="p-4 font-semibold text-muted-foreground">Traditional calorie trackers</th>
              </tr>
            </thead>
            <tbody className="[&>tr]:border-b [&>tr]:border-border/60 [&>tr:last-child]:border-0">
              {[
                ["Scan food from a photo", true, false],
                ["Read menus and recipes with vision AI", true, false],
                ["Parse meals from plain text", true, "Sometimes"],
                ["Compare two food choices side-by-side", true, false],
                ["Goal-based recommendation per scan", true, false],
                ["Manual barcode logging", "Optional", true],
                ["Calm, non-judgmental tone", true, "Mixed"],
                ["Future-ready for AI glasses", true, false],
              ].map(([cap, ns, trad]) => (
                <tr key={cap as string}>
                  <td className="p-4 text-muted-foreground">{cap as string}</td>
                  <td className="p-4 font-medium">{renderCell(ns)}</td>
                  <td className="p-4 font-medium text-muted-foreground">{renderCell(trad)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        eyebrow="Three ways to log a meal"
        title="Scan, describe, or compare — pick the lowest-friction path"
      >
        <div className="overflow-x-auto rounded-3xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left">
                <th className="p-4 font-semibold text-muted-foreground">Mode</th>
                <th className="p-4 font-semibold">Best for</th>
                <th className="p-4 font-semibold">Speed</th>
                <th className="p-4 font-semibold">Accuracy</th>
              </tr>
            </thead>
            <tbody className="[&>tr]:border-b [&>tr]:border-border/60 [&>tr:last-child]:border-0">
              <tr><td className="p-4 font-semibold">Scan</td><td className="p-4">Plates, dishes, café meals</td><td className="p-4">~3 seconds</td><td className="p-4">Medium (vision-based)</td></tr>
              <tr><td className="p-4 font-semibold">Recipe</td><td className="p-4">Printed recipes with gram amounts</td><td className="p-4">~5 seconds</td><td className="p-4">High (reads exact grams)</td></tr>
              <tr><td className="p-4 font-semibold">Menu</td><td className="p-4">Restaurant or café menus</td><td className="p-4">~5 seconds</td><td className="p-4">Medium (picks best match)</td></tr>
              <tr><td className="p-4 font-semibold">Describe</td><td className="p-4">Quick text or voice logging</td><td className="p-4">~4 seconds</td><td className="p-4">Medium (depends on detail)</td></tr>
              <tr><td className="p-4 font-semibold">Compare</td><td className="p-4">Choosing between two options</td><td className="p-4">~6 seconds</td><td className="p-4">Medium (relative is easier)</td></tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section eyebrow="Honest scope" title="What NutriSight can and cannot do">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-success/40 bg-success/5 p-6">
            <h3 className="text-base font-bold">Can estimate</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {["Calories, protein, sugar, carbs, fiber, salt level", "Sugar-cube and carb-impact visuals", "Goal-based health score (0–100)", "Better-choice between two food options", "Daily totals and trends in your meal memory"].map((t) => (
                <li key={t} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />{t}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-warning/40 bg-warning/5 p-6">
            <h3 className="text-base font-bold">Cannot guarantee</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {["Exact lab-grade nutrition values", "Hidden oils, sauces or marinades you can't see", "Personal blood-glucose response", "Medical diagnosis or treatment", "Micronutrient (vitamin/mineral) accuracy"].map((t) => (
                <li key={t} className="flex gap-2"><X className="mt-0.5 h-4 w-4 shrink-0 text-warning" />{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}

function renderCell(v: boolean | string) {
  if (v === true) return <span className="inline-flex items-center gap-1 text-success"><Check className="h-4 w-4" /> Yes</span>;
  if (v === false) return <span className="inline-flex items-center gap-1 text-muted-foreground"><X className="h-4 w-4" /> No</span>;
  return <span>{v}</span>;
}
