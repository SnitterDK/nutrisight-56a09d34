import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/Section";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — NutriSight" },
      { name: "description", content: "How NutriSight collects, uses and protects your data. GDPR-aware, EU-based service." },
      { property: "og:title", content: "NutriSight Privacy Policy" },
      { property: "og:description", content: "What data we store, why, and your rights under GDPR." },
    ],
    links: [{ rel: "canonical", href: "https://nutrisight.lovable.app/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <Section eyebrow="Legal" title="Privacy Policy">
      <div className="prose-like mx-auto max-w-3xl space-y-5 text-sm leading-relaxed text-muted-foreground">
        <p className="text-xs uppercase tracking-wider text-foreground/70">Last updated: June 2026</p>
        <p>
          NutriSight (\"we\", \"us\") is an AI nutrition assistant operated from the European Union.
          This page explains what personal data we collect, why, and your rights under the EU General
          Data Protection Regulation (GDPR).
        </p>

        <h2 className="mt-6 text-lg font-bold text-foreground">1. Data we collect</h2>
        <ul className="list-inside list-disc space-y-1.5">
          <li><strong>Account data</strong> — email address and display name from your sign-in (Lovable Auth, Google login optional).</li>
          <li><strong>Profile preferences</strong> — your chosen health goal, optional age/activity, optional dietary preferences.</li>
          <li><strong>Meals and scans</strong> — food images you upload, AI-generated nutrition estimates, and notes you save.</li>
          <li><strong>Learning progress</strong> — which Academy lessons you completed and earned XP.</li>
          <li><strong>Anonymous telemetry</strong> — for users without an account, we may store a random device ID with scan events to count usage.</li>
          <li><strong>Beta signup</strong> — name, email and goal you submit voluntarily.</li>
        </ul>

        <h2 className="mt-6 text-lg font-bold text-foreground">2. How we use it</h2>
        <ul className="list-inside list-disc space-y-1.5">
          <li>To run the product: scan analysis, meal memory, daily totals, personalized recommendations.</li>
          <li>To improve the product: aggregated, de-identified analytics on which features are used.</li>
          <li>To contact you: beta updates and important service notices (you can opt out anytime).</li>
        </ul>

        <h2 className="mt-6 text-lg font-bold text-foreground">3. AI processing</h2>
        <p>
          Food images and descriptions are sent to <strong>Google Gemini</strong> via the Lovable AI Gateway for analysis.
          We do not use your images to train any third-party model. Gemini requests are logged with model
          name, latency, and outcome (not the image content) for operational monitoring.
        </p>

        <h2 className="mt-6 text-lg font-bold text-foreground">4. Where data lives</h2>
        <p>
          Data is stored on managed cloud infrastructure (Lovable Cloud, EU region). Access is restricted
          by row-level security so users can only read their own data.
        </p>

        <h2 className="mt-6 text-lg font-bold text-foreground">5. Your GDPR rights</h2>
        <p>You have the right to access, correct, export, restrict or delete your personal data. To exercise any of these rights, email <a className="text-primary underline" href="mailto:hello@nutrisight.app">hello@nutrisight.app</a>. We respond within 30 days.</p>

        <h2 className="mt-6 text-lg font-bold text-foreground">6. Cookies</h2>
        <p>We use a single first-party session cookie for authentication. No third-party advertising cookies.</p>

        <h2 className="mt-6 text-lg font-bold text-foreground">7. Children</h2>
        <p>NutriSight is not intended for children under 13. We do not knowingly collect data from children.</p>

        <h2 className="mt-6 text-lg font-bold text-foreground">8. Changes</h2>
        <p>If we materially change this policy, we'll notify active users by email at least 14 days in advance.</p>

        <p className="mt-8 text-xs">Contact: <a className="text-primary underline" href="mailto:hello@nutrisight.app">hello@nutrisight.app</a></p>
      </div>
    </Section>
  );
}
