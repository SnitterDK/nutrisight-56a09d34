import { Activity, CheckCircle2, FlaskConical, XCircle, ExternalLink, ShieldAlert } from "lucide-react";
import { Section } from "@/components/Section";

const CARDS = [
  {
    icon: CheckCircle2,
    tone: "success" as const,
    label: "Established",
    title: "Where low-carb is proven",
    points: [
      "Ketogenic diets are standard medical therapy for drug-resistant epilepsy",
      "Low-carb eating improves blood-sugar control and triglycerides for many people with type 2 diabetes",
      "Lower glucose spikes often mean steadier energy and appetite",
    ],
  },
  {
    icon: FlaskConical,
    tone: "blue" as const,
    label: "Under investigation",
    title: "What researchers are studying",
    points: [
      "Small clinical studies test ketogenic diets alongside standard cancer treatment (ERGO pilot, recurrent glioblastoma)",
      "Fasting-mimicking diets are being trialled during chemotherapy",
      "Reviews conclude the evidence is early and preliminary — promising signals, no proof of benefit",
    ],
  },
  {
    icon: XCircle,
    tone: "warning" as const,
    label: "Not proven",
    title: "What a diet cannot do",
    points: [
      "No diet treats or cures cancer, and none replaces oncology care",
      "Unintended weight loss during illness or treatment can be harmful",
      "Not suitable for everyone — pregnancy, type 1 diabetes, kidney or liver disease, eating-disorder history",
    ],
  },
];

const TONE: Record<"success" | "blue" | "warning", string> = {
  success: "bg-success/15 text-success-foreground",
  blue: "bg-brand-blue/15 text-brand-blue-foreground",
  warning: "bg-warning/15 text-warning-foreground",
};

const SOURCES = [
  {
    label: "National Cancer Institute — Nutrition in Cancer Care (PDQ)",
    href: "https://www.cancer.gov/about-cancer/treatment/side-effects/appetite-loss/nutrition-pdq",
  },
  {
    label: "Weber et al., Molecular Metabolism 2020 — Ketogenic diet in the treatment of cancer: where do we stand?",
    href: "https://pubmed.ncbi.nlm.nih.gov/31399389/",
  },
  {
    label: "Rieger et al., Int J Oncol 2014 — ERGO: pilot study of ketogenic diet in recurrent glioblastoma",
    href: "https://pubmed.ncbi.nlm.nih.gov/24728273/",
  },
  {
    label: "de Groot et al., Nature Communications 2020 — Fasting-mimicking diet during neoadjuvant chemotherapy",
    href: "https://www.nature.com/articles/s41467-020-16138-3",
  },
];

export function GlucoseCancerFocus() {
  return (
    <Section
      eyebrow="Why glucose is worth watching"
      title="Glucose, low-carb eating and cancer — what the science actually says"
      subtitle="Most cancer cells take up far more glucose than healthy tissue — the Warburg effect. It is why PET scans use a radioactive sugar tracer to find tumours. That biology is well established, and it is one reason understanding your carbohydrate load is worth learning. What follows is education, not treatment advice."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {CARDS.map(({ icon: Icon, tone, label, title, points }) => (
          <article key={title} className="rounded-3xl border border-border bg-card p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${TONE[tone]}`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
            </div>
            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
            <ul className="mt-4 space-y-3">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-border bg-surface p-6">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Activity className="h-4 w-4 text-primary" aria-hidden="true" />
            Sources you can check yourself
          </div>
          <ul className="mt-4 space-y-3">
            {SOURCES.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-1.5 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border-2 border-warning/40 bg-warning/10 p-6">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-foreground">Read this before changing anything</p>
              <p className="mt-2 text-sm text-muted-foreground">
                NutriSight is educational and does not diagnose or treat disease. A ketogenic or low-carb
                diet is a supplement to — never a replacement for — standard cancer treatment. Always talk
                to your doctor or oncologist before changing how you eat during cancer treatment,
                pregnancy, type 1 diabetes, or with a history of eating disorders.
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                In NutriSight you can set <strong className="text-foreground">Ketogenic / low-carb</strong> as
                your focus goal — every scan is then scored on net carbs and sugar load.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export const GLUCOSE_CANCER_FAQ = [
  {
    q: "Can a ketogenic diet treat cancer?",
    a: "No. No diet treats or cures cancer, and no diet replaces oncology care. Researchers are studying ketogenic diets and fasting-mimicking diets as a possible supplement to standard treatment — for example the ERGO pilot study in recurrent glioblastoma — but reviews in Molecular Metabolism conclude the evidence is still early and preliminary. Always talk to your oncologist before changing your diet.",
  },
  {
    q: "Why do cancer cells use so much glucose?",
    a: "Most cancer cells take up far more glucose than healthy tissue and rely heavily on glycolysis even when oxygen is available — known as the Warburg effect. This is established biology and is why PET scans use a radioactive glucose tracer to locate tumours. It does not by itself mean that cutting carbohydrates treats cancer.",
  },
  {
    q: "Where is a low-carb or ketogenic diet actually proven to help?",
    a: "Ketogenic diets are established medical therapy for drug-resistant epilepsy, and low-carb eating improves blood-sugar control and triglycerides for many people with type 2 diabetes or insulin resistance. It is not suitable for everyone — pregnancy, type 1 diabetes, kidney or liver disease and eating-disorder history all require medical guidance.",
  },
];
