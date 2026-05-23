import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { Section } from "@/components/Section";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — NutriSight" },
      { name: "description", content: "NutriSight provides estimated nutrition guidance and is not medical advice." },
      { property: "og:title", content: "NutriSight Disclaimer" },
      { property: "og:description", content: "Estimated nutrition guidance — not medical advice." },
    ],
  }),
  component: Disclaimer,
});

function Disclaimer() {
  return (
    <>
      <section className="container-page pt-14 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-warning/15 text-warning-foreground">
          <ShieldAlert className="h-6 w-6" />
        </span>
        <h1 className="mt-4 text-4xl font-bold md:text-5xl">Disclaimer</h1>
      </section>

      <Section>
        <div className="mx-auto max-w-3xl space-y-5 rounded-3xl border border-border bg-card p-8 text-muted-foreground md:text-lg">
          <p>
            NutriSight provides <strong className="text-foreground">estimated nutrition guidance</strong> and is
            <strong className="text-foreground"> not medical advice</strong>. Nutrition estimates may be inaccurate.
          </p>
          <p>
            People with diabetes, eating disorders, medical conditions, pregnancy, or special dietary needs should
            consult a qualified healthcare professional.
          </p>
          <p>
            NutriSight does not diagnose, treat, cure or prevent any disease. All suggestions are personalized
            guidance based on estimates — not clinical recommendations.
          </p>
          <p className="text-sm">
            By using this demo you acknowledge that the information is illustrative and intended for product
            evaluation purposes.
          </p>
        </div>
      </Section>
    </>
  );
}
