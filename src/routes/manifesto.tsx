import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Rocket, Users, Cpu, Layers, Sparkles, Monitor, GaugeCircle,
  FlaskConical, Compass, MessagesSquare, Target, ArrowRight,
} from "lucide-react";
import { Section } from "@/components/Section";

export const Route = createFileRoute("/manifesto")({
  head: () => ({
    meta: [
      { title: "Manifesto — NutriSight as an Exponential Organization" },
      { name: "description", content: "How NutriSight is built as an Exponential Organization (ExO): our Massive Transformative Purpose, SCALE and IDEAS attributes, and the 10x playbook we follow." },
      { property: "og:title", content: "The NutriSight Manifesto — An Exponential Organization for food" },
      { property: "og:description", content: "Our MTP, SCALE & IDEAS attributes, and how we plan to make healthy eating 10x cheaper, faster and more accessible." },
      { property: "og:url", content: "https://nutrisight.lovable.app/manifesto" },
    ],
    links: [{ rel: "canonical", href: "https://nutrisight.lovable.app/manifesto" }],
  }),
  component: Manifesto,
});

const SCALE = [
  { icon: Users, key: "S", title: "Staff on Demand", body: "Core team stays tiny. Specialist nutritionists, designers and researchers are hired on-demand per moonshot, not as fixed payroll." },
  { icon: MessagesSquare, key: "C", title: "Community & Crowd", body: "Beta users, dietitians and the OpenExO network co-create the product. Every scan, correction and review feeds back into the system." },
  { icon: Cpu, key: "A", title: "Algorithms", body: "Google Gemini multimodal AI powers vision, reasoning and personalization — turning every meal into structured, learnable data." },
  { icon: Layers, key: "L", title: "Leveraged Assets", body: "We own no cameras, no servers, no labs. Google Cloud, Lovable Cloud and users' own phones do the heavy lifting." },
  { icon: Sparkles, key: "E", title: "Engagement", body: "Streaks, goal-based scoring, public AI Operations dashboard and a referral loop turn users into evangelists." },
];

const IDEAS = [
  { icon: Monitor, key: "I", title: "Interfaces", body: "Scan, Describe and Compare flows hide all complexity. One tap → one decision. AI-glasses-ready." },
  { icon: GaugeCircle, key: "D", title: "Dashboards", body: "Live KPIs on /ai-operations and a private admin dashboard make every metric visible in real-time." },
  { icon: FlaskConical, key: "E", title: "Experimentation", body: "Ship weekly. A/B test pricing, prompts and UI. Kill what doesn't move the MTP forward." },
  { icon: Compass, key: "A", title: "Autonomy", body: "Small autonomous pods own scan, learn, growth and trust — no committees, no gate-keeping." },
  { icon: MessagesSquare, key: "S", title: "Social Technologies", body: "Public roadmap, open metrics, Discord-style community and shareable meal cards build the nervous system." },
];

const DS = [
  { title: "Digitize", body: "Every meal becomes structured data — no paper diaries." },
  { title: "Deceptive", body: "Today: a hackathon demo. Tomorrow: a billion daily food decisions." },
  { title: "Disruptive", body: "Replaces calorie counters, dietitian appointments and food labels." },
  { title: "Dematerialize", body: "No hardware. No clinic visit. Just a camera you already own." },
  { title: "Demonetize", body: "Free tier covers the daily user. Pro is €4.99/mo — 10–100× cheaper than a nutritionist." },
  { title: "Democratize", body: "Same AI nutritionist for a student in Lagos and a CEO in Copenhagen." },
];

function Manifesto() {
  return (
    <>
      <section className="container-page pb-12 pt-16 md:pt-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Rocket className="h-3.5 w-3.5" /> The NutriSight Manifesto
        </span>
        <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-[1.05] md:text-6xl">
          Built as an <span className="gradient-text">Exponential Organization</span> for food.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          We follow the ExO playbook by Salim Ismail: a small team, a Massive Transformative Purpose,
          accelerating technology and a community — aimed at 10× the impact of any traditional nutrition company.
        </p>
      </section>

      {/* MTP */}
      <Section eyebrow="Chapter 4 · The MTP" title="Our Massive Transformative Purpose">
        <div className="rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-brand-blue/10 p-8 md:p-12">
          <Target className="mb-4 h-10 w-10 text-primary" />
          <p className="text-2xl font-extrabold leading-tight md:text-4xl">
            “Help every human on Earth understand what food does to their body —
            <span className="gradient-text"> before</span> they eat it.”
          </p>
          <p className="mt-6 max-w-2xl text-sm text-muted-foreground">
            Massive enough to outlive any single product. Transformative enough to change behaviour.
            Purposeful enough that talent, capital and community rally around it.
          </p>
        </div>
      </Section>

      {/* 6 Ds */}
      <Section eyebrow="Chapter 3 · The 6 Ds" title="The exponential path to 10× impact">
        <div className="grid gap-4 md:grid-cols-3">
          {DS.map((d) => (
            <div key={d.title} className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold gradient-text">{d.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* SCALE */}
      <Section eyebrow="Chapters 5–9 · SCALE (external)" title="How we scale without scaling headcount">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SCALE.map(({ icon: Icon, key, title, body }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-extrabold">{key}</span>
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-3 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* IDEAS */}
      <Section eyebrow="Chapters 10–14 · IDEAS (internal)" title="How we stay fast on the inside">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {IDEAS.map(({ icon: Icon, key, title, body }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue text-white font-extrabold">{key}</span>
                <Icon className="h-5 w-5 text-brand-blue" />
              </div>
              <h3 className="mt-3 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Moonshots */}
      <Section eyebrow="Chapter 16 · Building an ExO" title="Our 12-step moonshot plan">
        <ol className="grid gap-3 md:grid-cols-2">
          {[
            "Lock the MTP and never dilute it",
            "Join MTP communities (OpenExO, XPRIZE, health tech)",
            "Keep a tiny, autonomous core team",
            "Bet on a breakthrough idea: vision-first nutrition",
            "Maintain a living ExO Canvas, not a static plan",
            "Validate the business model with paying users (€4.99 Pro)",
            "Ship the MVP weekly — Scan, Describe, Compare",
            "Validate marketing & sales through public metrics",
            "Implement SCALE + IDEAS attributes (this page)",
            "Establish a culture of transparency and experimentation",
            "Ask the hard ExO questions every quarter",
            "Become a platform — open the API to partners",
          ].map((step, i) => (
            <li key={step} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm">{step}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Join the exponential mission">
        <div className="flex flex-wrap gap-3">
          <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">
            Try NutriSight <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/ai-operations" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold">
            See live metrics
          </Link>
          <Link to="/pricing" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold">
            Pricing
          </Link>
        </div>
        <p className="mt-6 max-w-2xl text-xs text-muted-foreground">
          Inspired by <em>Exponential Organizations 2.0</em> by Salim Ismail and the OpenExO community.
          Concepts are theirs; the execution against the food & health vertical is ours.
        </p>
      </Section>
    </>
  );
}
