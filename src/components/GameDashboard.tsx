import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Trophy, Flame, Zap, Target, Check, Lock, Star, Award, Crown,
  Sparkles, GraduationCap, Camera, TrendingUp, Shield,
} from "lucide-react";
import { getMyLessons } from "@/lib/learning.functions";

type Profile = {
  xp: number;
  streak_days: number;
  display_name: string | null;
  daily_sugar_target_g: number;
  daily_protein_target_g: number;
};

type Meal = {
  id: string;
  health_score: number | null;
  sugar_g: number;
  protein_g: number;
};

// Level curve: each level needs +50 XP more than the last (50, 100, 150...)
function levelFromXp(xp: number) {
  let level = 1;
  let need = 50;
  let total = 0;
  while (xp >= total + need) {
    total += need;
    level++;
    need += 50;
  }
  return { level, xpInLevel: xp - total, xpForNext: need, totalToNext: total + need };
}

const RANKS = [
  { min: 1, name: "Rookie", icon: Sparkles, color: "from-slate-400 to-slate-500" },
  { min: 3, name: "Scout", icon: Target, color: "from-emerald-400 to-teal-500" },
  { min: 6, name: "Tracker", icon: Zap, color: "from-sky-400 to-indigo-500" },
  { min: 10, name: "Strategist", icon: Shield, color: "from-violet-500 to-fuchsia-500" },
  { min: 15, name: "Master", icon: Crown, color: "from-amber-400 to-orange-500" },
];

function rankFor(level: number) {
  return [...RANKS].reverse().find((r) => level >= r.min) ?? RANKS[0];
}

export function GameDashboard({
  profile,
  todayMeals,
}: {
  profile: Profile | null | undefined;
  todayMeals: Meal[];
}) {
  const fetchLessons = useServerFn(getMyLessons);
  const lessonsQ = useQuery({
    queryKey: ["lessons"],
    queryFn: () => fetchLessons(),
    enabled: !!profile,
  });

  if (!profile) {
    return (
      <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-8 text-center">
        <Trophy className="mx-auto h-10 w-10 text-primary" />
        <h3 className="mt-3 text-xl font-bold">Unlock the game</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Sign in to earn XP, level up, build streaks, unlock ranks and complete daily quests every time you scan or learn.
        </p>
        <Link to="/auth" className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow">
          Start playing
        </Link>
      </div>
    );
  }

  const xp = profile.xp ?? 0;
  const streak = profile.streak_days ?? 0;
  const { level, xpInLevel, xpForNext } = levelFromXp(xp);
  const rank = rankFor(level);
  const RankIcon = rank.icon;
  const pct = Math.min(100, (xpInLevel / xpForNext) * 100);

  // Quest progress
  const scansToday = todayMeals.length;
  const healthyToday = todayMeals.filter((m) => (m.health_score ?? 0) >= 70).length;
  const sugarToday = todayMeals.reduce((s, m) => s + Number(m.sugar_g || 0), 0);
  const proteinToday = todayMeals.reduce((s, m) => s + Number(m.protein_g || 0), 0);
  const lessonsDone = lessonsQ.data?.length ?? 0;

  const quests = [
    { id: "scan3", label: "Scan 3 meals today", value: Math.min(scansToday, 3), goal: 3, xp: 15, icon: Camera },
    { id: "healthy1", label: "Pick 1 meal with score ≥ 70", value: Math.min(healthyToday, 1), goal: 1, xp: 20, icon: Star },
    { id: "sugar", label: `Stay under sugar target (${profile.daily_sugar_target_g}g)`, value: Math.min(sugarToday, profile.daily_sugar_target_g), goal: profile.daily_sugar_target_g, xp: 25, icon: Shield, invert: true },
    { id: "lesson", label: "Finish 1 lesson today", value: lessonsDone > 0 ? 1 : 0, goal: 1, xp: 15, icon: GraduationCap, link: "/learn" },
  ];

  const achievements = [
    { id: "first", label: "First Scan", icon: Camera, unlocked: scansToday + (todayMeals.length === 0 ? 0 : 1) > 0 || xp > 0 },
    { id: "streak3", label: "3-Day Streak", icon: Flame, unlocked: streak >= 3 },
    { id: "streak7", label: "Week Warrior", icon: TrendingUp, unlocked: streak >= 7 },
    { id: "scholar", label: "Scholar (3 lessons)", icon: GraduationCap, unlocked: lessonsDone >= 3 },
    { id: "lvl5", label: "Level 5", icon: Award, unlocked: level >= 5 },
    { id: "lvl10", label: "Level 10", icon: Crown, unlocked: level >= 10 },
  ];

  return (
    <div className="space-y-5">
      {/* Player card */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className={`bg-gradient-to-br ${rank.color} p-6 text-white`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                <RankIcon className="h-7 w-7" />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest opacity-80">{rank.name} · Level {level}</p>
                <p className="text-xl font-extrabold leading-tight">{profile.display_name ?? "Player"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold backdrop-blur">
                <Trophy className="h-3.5 w-3.5" /> {xp} XP
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold backdrop-blur">
                <Flame className="h-3.5 w-3.5" /> {streak}d
              </span>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider opacity-90">
              <span>Level {level}</span>
              <span>{xpInLevel} / {xpForNext} XP → Lvl {level + 1}</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-white shadow-inner transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Daily quests */}
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Daily quests</p>
            <h3 className="text-lg font-bold">Complete today · earn XP</h3>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            {quests.filter((q) => q.value >= q.goal).length} / {quests.length}
          </span>
        </div>

        <ul className="space-y-3">
          {quests.map((q) => {
            const done = q.invert ? q.value < q.goal && todayMeals.length > 0 : q.value >= q.goal;
            const pctQ = Math.min(100, (q.value / q.goal) * 100);
            const Icon = q.icon;
            const content = (
              <div className={`flex items-center gap-3 rounded-2xl border p-3 transition ${done ? "border-success/40 bg-success/5" : "border-border bg-background hover:border-primary/40"}`}>
                <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${done ? "bg-success text-success-foreground" : "bg-primary/10 text-primary"}`}>
                  {done ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold">{q.label}</p>
                    <span className={`shrink-0 text-xs font-bold ${done ? "text-success" : "text-primary"}`}>+{q.xp} XP</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className={`h-full rounded-full ${done ? "bg-success" : "bg-primary"}`} style={{ width: `${pctQ}%` }} />
                  </div>
                </div>
              </div>
            );
            return (
              <li key={q.id}>
                {q.link ? <Link to={q.link}>{content}</Link> : content}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Achievements */}
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Achievements</p>
            <h3 className="text-lg font-bold">Badges unlocked</h3>
          </div>
          <span className="text-xs font-bold text-muted-foreground">
            {achievements.filter((a) => a.unlocked).length} / {achievements.length}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {achievements.map((a) => {
            const Icon = a.icon;
            return (
              <div key={a.id} className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition ${a.unlocked ? "border-primary/40 bg-primary/5" : "border-dashed border-border bg-muted/30 opacity-60"}`}>
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${a.unlocked ? "bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow" : "bg-muted text-muted-foreground"}`}>
                  {a.unlocked ? <Icon className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
                </span>
                <p className="text-[10px] font-semibold leading-tight">{a.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Protein bonus tracker */}
      {proteinToday > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-brand-blue/30 bg-brand-blue/5 p-4">
          <Zap className="h-5 w-5 text-brand-blue" />
          <p className="text-sm">
            <span className="font-bold">{Math.round(proteinToday)}g</span> protein logged today.
            {proteinToday >= profile.daily_protein_target_g
              ? " Target hit — bonus quest available tomorrow!"
              : ` ${Math.round(profile.daily_protein_target_g - proteinToday)}g to hit your daily target.`}
          </p>
        </div>
      )}
    </div>
  );
}
