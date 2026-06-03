import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Loader2, Download, Search } from "lucide-react";
import { listBetaSignups, updateBetaSignup } from "@/lib/admin.functions";

export const Route = createFileRoute("/_admin/beta")({
  component: BetaSignupsPage,
});

type Signup = {
  id: string;
  name: string;
  email: string;
  selected_goal: string | null;
  message: string | null;
  source_page: string | null;
  consent_contact: boolean;
  consent_testimonial: boolean;
  status: "new" | "contacted" | "tester" | "partner" | "archived";
  internal_notes: string | null;
  created_at: string;
};

const STATUS_OPTIONS = ["new", "contacted", "tester", "partner", "archived"] as const;

function BetaSignupsPage() {
  const fetchSignups = useServerFn(listBetaSignups);
  const updateFn = useServerFn(updateBetaSignup);
  const qc = useQueryClient();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "beta-signups"],
    queryFn: () => fetchSignups(),
  });

  const mut = useMutation({
    mutationFn: (input: { id: string; status?: Signup["status"]; internal_notes?: string | null }) =>
      updateFn({ data: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "beta-signups"] }),
  });

  const signups: Signup[] = (data?.signups ?? []) as Signup[];
  const filtered = useMemo(() => {
    return signups.filter((s) => {
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          (s.selected_goal ?? "").toLowerCase().includes(q) ||
          (s.message ?? "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [signups, query, statusFilter]);

  function exportCsv() {
    const rows = [
      ["name", "email", "selected_goal", "message", "source_page", "consent_contact", "consent_testimonial", "status", "internal_notes", "created_at"],
      ...filtered.map((s) => [
        s.name, s.email, s.selected_goal ?? "", s.message ?? "", s.source_page ?? "",
        s.consent_contact ? "yes" : "no", s.consent_testimonial ? "yes" : "no",
        s.status, s.internal_notes ?? "", s.created_at,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `beta_signups_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (isLoading) {
    return <div className="flex min-h-[40vh] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>;
  }
  if (error) {
    return <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">Failed: {error instanceof Error ? error.message : "Unknown"}</div>;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Beta Signups</h1>
          <p className="mt-1 text-sm text-muted-foreground">{filtered.length} of {signups.length} signups</p>
        </div>
        <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, goal..."
            className="w-full rounded-xl border border-input bg-background px-3 py-2 pl-9 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Goal</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Consent</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-t border-border align-top">
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.email}</td>
                <td className="px-4 py-3 capitalize">{s.selected_goal ?? "—"}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(s.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-xs">
                  {s.consent_contact && <span className="mr-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">contact</span>}
                  {s.consent_testimonial && <span className="inline-block rounded-full bg-brand-blue/15 px-2 py-0.5 text-[10px] font-semibold">testimonial</span>}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={s.status}
                    onChange={(e) => mut.mutate({ id: s.id, status: e.target.value as Signup["status"] })}
                    className="rounded-lg border border-input bg-background px-2 py-1 text-xs"
                  >
                    {STATUS_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <textarea
                    defaultValue={s.internal_notes ?? ""}
                    onBlur={(e) => {
                      if (e.target.value !== (s.internal_notes ?? "")) {
                        mut.mutate({ id: s.id, internal_notes: e.target.value || null });
                      }
                    }}
                    placeholder="Internal notes..."
                    rows={2}
                    className="w-48 rounded-lg border border-input bg-background px-2 py-1 text-xs"
                  />
                  {s.message && (
                    <p className="mt-2 max-w-xs text-[11px] italic text-muted-foreground">"{s.message}"</p>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">No signups yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
