import { createFileRoute, Link } from "@tanstack/react-router";
import { Section } from "@/components/Section";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — NutriSight" },
      { name: "description", content: "NutriSight is a real-time AI nutrition assistant helping people make healthier food choices before they eat." },
      { property: "og:title", content: "About NutriSight" },
      { property: "og:description", content: "Personal food intelligence before you eat." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <section className="container-page pt-14 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">About</p>
        <h1 className="mt-2 text-4xl font-bold md:text-5xl">Personal food intelligence, before you eat.</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground md:text-lg">
          NutriSight is a real-time nutrition assistant for phones and future AI glasses. We use AI camera
          vision, personal health goals, meal memory and nutrition estimates to help people make better
          everyday food choices — in the moment.
        </p>
      </section>

      <Section eyebrow="Mission" title="Make healthy choices the easy choice.">
        <div className="mx-auto max-w-3xl space-y-4 text-muted-foreground md:text-lg">
          <p>
            Most nutrition apps track food after the choice has been made. NutriSight flips that around:
            it understands what's in front of you and gives clear, personalized guidance before you eat —
            so the better choice is the obvious one.
          </p>
          <p>
            Built for everyday life: cafés, restaurants, supermarkets, home meals. Designed to work
            today on phones, and tomorrow on AI glasses.
          </p>
        </div>
      </Section>

      <Section eyebrow="Submission" title="Built for XPRIZE-style demos">
        <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-7">
          <p className="text-muted-foreground">
            This site is a polished MVP demo: a clear product story, an interactive prototype, and a
            vision for how NutriSight extends from phones to future AI glasses. The full nutrition
            engine is an active area of research and development.
          </p>
          <Link to="/demo" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
            Try the demo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
