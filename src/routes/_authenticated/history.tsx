import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Trash2, Calendar } from "lucide-react";
import { Section } from "@/components/Section";
import { getRecentMeals, deleteMeal } from "@/lib/meals.functions";

export const Route = createFileRoute("/_authenticated/history")({
  head: () => ({ meta: [{ title: "History — NutriSight" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const qc = useQueryClient();
  const fetch = useServerFn(getRecentMeals);
  const del = useServerFn(deleteMeal);
  const { data, isLoading } = useQuery({ queryKey: ["meals", "recent"], queryFn: () => fetch() });
  const delMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["meals"] }),
  });

  if (isLoading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  const meals = data ?? [];
  // Group by day
  const groups = new Map<string, typeof meals>();
  for (const m of meals) {
    const day = new Date(m.eaten_at).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
    const arr = groups.get(day) ?? [];
    arr.push(m);
    groups.set(day, arr);
  }

  return (
    <Section eyebrow="Meal memory" title="Your scan history" subtitle="Everything you've scanned and saved. Notice patterns — that's how you learn.">
      {meals.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">No meals logged yet. Head to the scanner and snap your first food.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Array.from(groups.entries()).map(([day, items]) => {
            const dayTotals = items.reduce((a, m) => ({ kcal: a.kcal + Number(m.calories_kcal), sugar: a.sugar + Number(m.sugar_g) }), { kcal: 0, sugar: 0 });
            return (
              <div key={day}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    <Calendar className="h-4 w-4" /> {day}
                  </h3>
                  <p className="text-xs text-muted-foreground">{Math.round(dayTotals.kcal)} kcal · {Math.round(dayTotals.sugar)} g sugar</p>
                </div>
                <ul className="space-y-2">
                  {items.map((m) => {
                    const score = m.health_score;
                    const tone = score == null ? "muted" : score >= 70 ? "success" : score >= 40 ? "warning" : "destructive";
                    const ring =
                      tone === "success" ? "ring-success/40 text-success" :
                      tone === "warning" ? "ring-warning/40 text-warning-foreground" :
                      tone === "destructive" ? "ring-destructive/40 text-destructive" : "ring-border text-muted-foreground";
                    return (
                      <li key={m.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
                        <div className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl ring-2 ${ring}`}>
                          <span className="text-sm font-bold leading-none">{score ?? "—"}</span>
                          <span className="text-[9px] opacity-70">/100</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold">{m.food_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(m.eaten_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ·{" "}
                            {Math.round(Number(m.calories_kcal))} kcal · {Math.round(Number(m.sugar_g))} g sugar · {Math.round(Number(m.protein_g))} g protein
                          </p>
                          {m.recommendation && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{m.recommendation}</p>}
                        </div>
                        <button
                          onClick={() => delMut.mutate(m.id)}
                          className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-destructive"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </Section>
  );
}
