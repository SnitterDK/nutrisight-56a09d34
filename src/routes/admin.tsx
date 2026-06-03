import { createFileRoute, Outlet, Navigate, Link, useRouterState } from "@tanstack/react-router";
import { Loader2, LayoutDashboard, Users, Inbox, ScanLine, Sparkles, MessageSquare, FileText, Download, Settings, ShieldAlert } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — NutriSight" },
      { name: "robots", content: "noindex,nofollow,noarchive" },
    ],
  }),
  component: AdminLayout,
});

const adminNav: Array<{ to: string; label: string; icon: any; exact: boolean; soon?: boolean }> = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/beta", label: "Beta Signups", icon: Inbox, exact: false },
  { to: "/admin/users", label: "Users", icon: Users, exact: false, soon: true },
  { to: "/admin/scans", label: "Scan Events", icon: ScanLine, exact: false, soon: true },
  { to: "/admin/gemini", label: "Gemini Logs", icon: Sparkles, exact: false, soon: true },
  { to: "/admin/feedback", label: "Feedback", icon: MessageSquare, exact: false, soon: true },
  { to: "/admin/reports", label: "Reports", icon: FileText, exact: false, soon: true },
  { to: "/admin/export", label: "Export", icon: Download, exact: false, soon: true },
  { to: "/admin/settings", label: "Settings", icon: Settings, exact: false, soon: true },
];

function AdminLayout() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading } = useIsAdmin();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" />;
  if (!isAdmin) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <ShieldAlert className="h-7 w-7" />
        </span>
        <h1 className="mt-5 text-2xl font-bold">Access denied</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          This area is restricted to the NutriSight founder. If you think this is a mistake, sign in with the admin account.
        </p>
        <Link to="/" className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page grid gap-6 py-8 lg:grid-cols-[220px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-border bg-card p-3">
          <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Founder console
          </p>
          <nav className="flex flex-col gap-0.5">
            {adminNav.map(({ to, label, icon: Icon, exact, soon }) => {
              const active = exact ? pathname === to : pathname.startsWith(to);
              const className = `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              } ${soon ? "cursor-not-allowed opacity-50" : ""}`;
              return soon ? (
                <span key={to} className={className} title="Coming next phase">
                  <Icon className="h-4 w-4" />
                  {label}
                  <span className="ml-auto text-[9px] uppercase">soon</span>
                </span>
              ) : (
                <Link key={to} to={to} className={className}>
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
