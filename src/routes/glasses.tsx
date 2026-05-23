import { createFileRoute } from "@tanstack/react-router";
import { Glasses, MessageCircle, Sparkles } from "lucide-react";
import { Section } from "@/components/Section";

export const Route = createFileRoute("/glasses")({
  head: () => ({
    meta: [
      { title: "AI Glasses Vision — NutriSight" },
      { name: "description", content: "Private real-time nutrition guidance while looking at menus, supermarket shelves and café counters — designed for the future of AI glasses." },
      { property: "og:title", content: "NutriSight for AI Glasses" },
      { property: "og:description", content: "Private nutrition guidance, hands-free." },
    ],
  }),
  component: GlassesPage,
});

function GlassesPage() {
  return (
    <>
      <section className="container-page pt-14 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-blue-foreground">
          <Glasses className="h-3.5 w-3.5" /> Future-ready
        </span>
        <h1 className="mt-4 text-4xl font-bold md:text-5xl">Designed for the future of AI glasses.</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground md:text-lg">
          With AI glasses, NutriSight could give private nutrition guidance while you look at a menu,
          supermarket shelf, café counter or meal — without taking out a phone.
        </p>
      </section>

      <Section>
        <div className="grid items-center gap-8 lg:grid-cols-2">
          {/* Mockup */}
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-brand-blue/30 via-primary/20 to-transparent blur-2xl" />
            <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-stone-100 via-amber-50 to-emerald-100 p-6 shadow-2xl dark:from-stone-900 dark:via-stone-800 dark:to-emerald-950">
              {/* faux menu */}
              <div className="rounded-2xl bg-card/80 p-5 shadow-md backdrop-blur">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Café menu</p>
                <h3 className="font-display text-lg font-bold">Lunch</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex justify-between"><span>Chicken Caesar salad</span><span className="text-muted-foreground">€11</span></li>
                  <li className="flex justify-between rounded-md bg-primary/15 px-2 py-1 font-semibold">
                    <span>Grilled salmon bowl</span><span>€13</span>
                  </li>
                  <li className="flex justify-between"><span>Glazed donut</span><span className="text-muted-foreground">€3</span></li>
                  <li className="flex justify-between"><span>Pasta carbonara</span><span className="text-muted-foreground">€12</span></li>
                </ul>
              </div>

              {/* overlay HUD */}
              <div className="mt-5 rounded-2xl border border-primary/30 bg-card/90 p-4 shadow-lg backdrop-blur">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> NutriSight overlay
                </div>
                <p className="mt-1.5 text-sm font-medium">
                  Best for your goal: <span className="font-bold">Salmon bowl</span>. Skip the donut — would use most of today's sugar budget.
                </p>
              </div>
            </div>
          </div>

          {/* Voice scenario */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <MessageCircle className="h-3.5 w-3.5" /> You
              </div>
              <p className="mt-1 text-base">"What is the best choice for me right now?"</p>
            </div>
            <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-brand-blue/10 p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <Sparkles className="h-3.5 w-3.5" /> NutriSight
              </div>
              <p className="mt-1 text-base font-medium leading-relaxed">
                "You've already eaten 1,070 calories today. Choose the salad with dressing on the side.
                The donut would use most of your remaining sugar budget."
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Private, hands-free guidance — exactly when and where the decision happens.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
