import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Quote } from "lucide-react";
import { getPublicStats } from "@/lib/public-stats.functions";

const testimonials = [
  { quote: "Use this slot for a real beta tester quote.", who: "Beta tester slot" },
  { quote: "Use this slot for a real beta tester quote.", who: "Beta tester slot" },
  { quote: "Use this slot for a real beta tester quote.", who: "Beta tester slot" },
];

export function SocialProof() {
  const fetchStats = useServerFn(getPublicStats);
  const { data } = useQuery({
    queryKey: ["public-stats"],
    queryFn: () => fetchStats(),
    staleTime: 60_000,
  });

  return (
    <section className="container-page pb-12 pt-8">
      <div className="mx-auto mb-10 grid max-w-4xl gap-4 rounded-3xl border border-border bg-card p-6 sm:grid-cols-4">
        <Stat n={data?.users} label="Users" />
        <Stat n={data?.scans} label="Scans analyzed" />
        <Stat n={data?.lessons} label="Lessons completed" />
        <Stat n={data?.beta_signups} label="Beta signups" />
      </div>
      <h3 className="text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">Beta testimonials</h3>
      <div className="mx-auto mt-4 grid max-w-5xl gap-4 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <div key={i} className="rounded-2xl border border-dashed border-border bg-card/60 p-5">
            <Quote className="h-4 w-4 text-primary" />
            <p className="mt-2 text-sm italic text-muted-foreground">"{t.quote}"</p>
            <p className="mt-3 text-xs font-semibold text-foreground/70">— {t.who}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-[11px] text-muted-foreground">
        Placeholder slots — to be filled with real verified quotes only. We never invent testimonials.
      </p>
    </section>
  );
}

function Stat({ n, label }: { n: number | undefined; label: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-2xl font-extrabold">{n == null ? "—" : n.toLocaleString()}</p>
      <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
