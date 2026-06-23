import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Sparkles, Zap } from "lucide-react";
import { Section } from "@/components/Section";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — NutriSight Free & Pro plans (EUR)" },
      { name: "description", content: "NutriSight is free to start. Upgrade to Pro for €4.99/month: unlimited scans, Compare mode, full Academy, and a weekly AI nutrition report." },
      { property: "og:title", content: "NutriSight Pricing — Free and Pro plans" },
      { property: "og:description", content: "Start free. Upgrade to Pro for €4.99/month for unlimited AI nutrition scans." },
    ],
    links: [{ rel: "canonical", href: "https://nutrisight.lovable.app/pricing" }],
  }),
  component: PricingPage,
});

const free = [
  "5 AI food scans per day",
  "Describe-a-meal (text → nutrition)",
  "Basic Academy lessons",
  "Personal goal & meal memory",
  "Web app on any device",
];

const pro = [
  "Unlimited AI food scans",
  "Compare two foods side-by-side",
  "Full NutriSight Academy",
  "Weekly AI nutrition report by email",
  "Priority support",
  "Early access to AI-glasses features",
];

function PricingPage() {
  return (
    <>
      <section className="container-page pb-6 pt-16 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Simple pricing
        </span>
        <h1 className="mt-4 text-4xl font-extrabold md:text-5xl">Start free. Upgrade when you're ready.</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Powered by Google Gemini. Cancel any time. Prices in EUR, billed monthly.
        </p>
      </section>

      <Section eyebrow="Plans" title="Pick the plan that fits your goal">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <PlanCard
            name="Free"
            price="€0"
            period="forever"
            description="Perfect for trying NutriSight and building a daily habit."
            features={free}
            cta={<Link to="/auth" className="block rounded-full border border-border bg-card px-5 py-3 text-center text-sm font-semibold transition hover:bg-muted">Create free account</Link>}
          />
          <PlanCard
            highlight
            name="NutriSight Pro"
            price="€4.99"
            period="/ month"
            description="For people serious about understanding what they eat."
            features={pro}
            cta={
              <button
                disabled
                className="block w-full cursor-not-allowed rounded-full bg-primary/40 px-5 py-3 text-center text-sm font-bold text-primary-foreground"
                title="Pro checkout opens at public launch"
              >
                <Zap className="mr-1 inline h-4 w-4" /> Coming soon — join Beta below
              </button>
            }
          />
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Pro checkout opens at public launch. Beta testers will get the first 3 months free.
        </p>
      </Section>

      <Section eyebrow="Questions" title="Pricing FAQ">
        <div className="mx-auto max-w-3xl space-y-4">
          {[
            { q: "Is NutriSight really free to start?", a: "Yes. The Free plan includes 5 AI scans per day, the Describe-a-meal flow, and basic Academy lessons. No card required." },
            { q: "What's in Pro for €4.99/month?", a: "Unlimited scans, the Compare mode, the full Academy, a weekly personalized AI nutrition report by email, and priority support." },
            { q: "Can I cancel any time?", a: "Yes — cancel any time from your profile. You keep Pro until the end of the billing period." },
            { q: "Do you offer student or annual discounts?", a: "Annual billing and a student discount are planned for public launch. Beta testers get the first 3 months free." },
            { q: "Is this medical advice?", a: "No. NutriSight gives estimates and goal-based guidance — it is not medical or nutritional advice. Always consult a professional for medical concerns." },
          ].map(({ q, a }) => (
            <div key={q} className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-semibold">{q}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{a}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

function PlanCard({
  name, price, period, description, features, cta, highlight,
}: {
  name: string; price: string; period: string; description: string;
  features: string[]; cta: React.ReactNode; highlight?: boolean;
}) {
  return (
    <div className={`relative rounded-3xl border-2 p-7 ${highlight ? "border-primary bg-gradient-to-br from-primary/10 via-card to-brand-blue/10 shadow-xl shadow-primary/10" : "border-border bg-card"}`}>
      {highlight && (
        <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground">
          Most popular
        </span>
      )}
      <h3 className="text-xl font-bold">{name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-5 flex items-baseline gap-1">
        <span className="text-4xl font-extrabold">{price}</span>
        <span className="text-sm text-muted-foreground">{period}</span>
      </div>
      <ul className="mt-6 space-y-2.5">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-7">{cta}</div>
    </div>
  );
}
