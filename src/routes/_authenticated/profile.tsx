import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Save, Loader2, Trophy, Flame, BookOpen } from "lucide-react";
import { Section } from "@/components/Section";
import { getMyProfile, updateMyProfile } from "@/lib/profile.functions";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Your profile — NutriSight" }] }),
  component: ProfilePage,
});

const GOALS = [
  ["sugar", "Reduce sugar"], ["weight", "Lose weight"], ["glucose", "Stable blood sugar"], ["keto", "Ketogenic / low-carb"],
  ["protein", "More protein"], ["fiber", "More fiber"], ["salt", "Reduce salt"],
  ["calories", "Reduce calories"], ["processed", "Less ultra-processed"], ["overall", "Healthier overall"],
] as const;

function ProfilePage() {
  const qc = useQueryClient();
  const fetchProfile = useServerFn(getMyProfile);
  const updateProfile = useServerFn(updateMyProfile);
  const { data: profile, isLoading } = useQuery({ queryKey: ["profile"], queryFn: () => fetchProfile() });

  const [form, setForm] = useState({
    display_name: "",
    primary_goal: "sugar",
    daily_calorie_target: 2000,
    daily_sugar_target_g: 50,
    daily_protein_target_g: 90,
    daily_fiber_target_g: 30,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        display_name: profile.display_name ?? "",
        primary_goal: profile.primary_goal ?? "sugar",
        daily_calorie_target: profile.daily_calorie_target ?? 2000,
        daily_sugar_target_g: profile.daily_sugar_target_g ?? 50,
        daily_protein_target_g: profile.daily_protein_target_g ?? 90,
        daily_fiber_target_g: profile.daily_fiber_target_g ?? 30,
      });
    }
  }, [profile]);

  const mut = useMutation({
    mutationFn: () => updateProfile({ data: { ...form, onboarded: true } }),
    onSuccess: () => {
      setSaved(true);
      qc.invalidateQueries({ queryKey: ["profile"] });
      setTimeout(() => setSaved(false), 2500);
    },
  });

  if (isLoading || !profile) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <>
      <Section eyebrow="Your profile" title={`Hi, ${profile.display_name ?? "friend"} 👋`} subtitle="Tune your goal and daily targets — NutriSight uses these for every recommendation.">
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard icon={Trophy} label="XP earned" value={profile.xp} tone="primary" />
          <StatCard icon={Flame} label="Day streak" value={profile.streak_days} tone="warning" />
          <StatCard icon={BookOpen} label="Last active" value={profile.last_active_date ?? "—"} tone="blue" />
        </div>
      </Section>

      <Section eyebrow="Settings" title="Goal & daily targets">
        <form
          onSubmit={(e) => { e.preventDefault(); mut.mutate(); }}
          className="space-y-6 rounded-3xl border border-border bg-card p-6"
        >
          <Field label="Display name">
            <input
              value={form.display_name}
              onChange={(e) => setForm({ ...form, display_name: e.target.value })}
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              maxLength={60}
            />
          </Field>

          <Field label="Primary focus goal">
            <div className="grid gap-2 sm:grid-cols-3">
              {GOALS.map(([id, label]) => {
                const active = form.primary_goal === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setForm({ ...form, primary_goal: id })}
                    className={`rounded-xl border px-3 py-2 text-left text-sm font-medium transition ${
                      active ? "border-primary bg-primary/10 text-primary" : "border-border bg-background hover:border-primary/40"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField label="Daily calories (kcal)" value={form.daily_calorie_target} min={800} max={6000} step={50} onChange={(v) => setForm({ ...form, daily_calorie_target: v })} />
            <NumberField label="Daily sugar (g)" value={form.daily_sugar_target_g} min={5} max={300} step={5} onChange={(v) => setForm({ ...form, daily_sugar_target_g: v })} />
            <NumberField label="Daily protein (g)" value={form.daily_protein_target_g} min={20} max={400} step={5} onChange={(v) => setForm({ ...form, daily_protein_target_g: v })} />
            <NumberField label="Daily fiber (g)" value={form.daily_fiber_target_g} min={5} max={100} step={1} onChange={(v) => setForm({ ...form, daily_fiber_target_g: v })} />
          </div>

          <button
            type="submit"
            disabled={mut.isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow disabled:opacity-60"
          >
            {mut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saved ? "Saved" : "Save changes"}
          </button>
          {mut.error && <p className="text-xs text-destructive">{(mut.error as Error).message}</p>}
        </form>
      </Section>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function NumberField({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <Field label={label}>
      <input
        type="number" value={value} min={min} max={max} step={step}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
      />
    </Field>
  );
}

function StatCard({ icon: Icon, label, value, tone }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number | string; tone: "primary" | "warning" | "blue" }) {
  const cls = tone === "primary" ? "bg-primary/10 text-primary" : tone === "warning" ? "bg-warning/15 text-warning-foreground" : "bg-brand-blue/15 text-brand-blue-foreground";
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${cls}`}><Icon className="h-5 w-5" /></span>
      <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
