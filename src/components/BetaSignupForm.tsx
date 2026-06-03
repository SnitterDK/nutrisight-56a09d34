import { useState, type FormEvent } from "react";
import { Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const GOALS = [
  { value: "lose_weight", label: "Lose weight" },
  { value: "reduce_sugar", label: "Reduce sugar" },
  { value: "stabilize_glucose", label: "Stabilize blood sugar" },
  { value: "more_protein", label: "Eat more protein" },
  { value: "more_fiber", label: "Eat more fiber" },
  { value: "reduce_salt", label: "Reduce salt" },
  { value: "healthier_overall", label: "Healthier choices overall" },
];

export function BetaSignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [goal, setGoal] = useState(GOALS[0].value);
  const [message, setMessage] = useState("");
  const [consentContact, setConsentContact] = useState(true);
  const [consentTestimonial, setConsentTestimonial] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!name.trim() || !email.trim()) {
      setErr("Name and email are required.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("beta_signups").insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      selected_goal: goal,
      message: message.trim() || null,
      source_page: typeof window !== "undefined" ? window.location.pathname : null,
      consent_contact: consentContact,
      consent_testimonial: consentTestimonial,
    });
    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-primary/30 bg-primary/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
        <h3 className="mt-4 text-2xl font-bold">You're on the list 🎉</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks {name.split(" ")[0]} — we'll be in touch when your NutriSight beta access opens.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-7 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Sparkles className="h-4 w-4" />
        </span>
        <h3 className="text-lg font-bold">Join the NutriSight beta</h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
        </label>
      </div>

      <label className="mt-3 block">
        <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">Your main goal</span>
        <select value={goal} onChange={(e) => setGoal(e.target.value)}
          className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm">
          {GOALS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
        </select>
      </label>

      <label className="mt-3 block">
        <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">What do you want NutriSight to help with? (optional)</span>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} maxLength={500}
          placeholder="e.g. I keep eating hidden sugar at breakfast — help me see it before I order."
          className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm" />
      </label>

      <div className="mt-4 space-y-2 text-xs text-muted-foreground">
        <p>
          I agree that NutriSight may store this information to provide the demo experience, improve the product, and contact me about beta testing.
        </p>
        <label className="flex items-start gap-2">
          <input type="checkbox" checked={consentContact} onChange={(e) => setConsentContact(e.target.checked)} className="mt-0.5" />
          <span>I agree to be contacted about NutriSight beta testing.</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" checked={consentTestimonial} onChange={(e) => setConsentTestimonial(e.target.checked)} className="mt-0.5" />
          <span>I agree that my feedback may be used as a public testimonial.</span>
        </label>
      </div>

      {err && <p className="mt-3 rounded-lg bg-destructive/10 p-3 text-xs text-destructive">{err}</p>}

      <button type="submit" disabled={loading}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 disabled:opacity-50">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Request beta access
      </button>
    </form>
  );
}
