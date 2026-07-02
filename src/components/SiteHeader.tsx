import { Link, useNavigate } from "@tanstack/react-router";
import { Leaf, LogOut, User as UserIcon, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/app", label: "Scan" },
  { to: "/compare", label: "Compare" },
  { to: "/learn", label: "Learn" },
  { to: "/pricing", label: "Pricing" },
  { to: "/ai-operations", label: "AI Ops" },
] as const;


export function SiteHeader() {
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Link to="/" aria-label="NutriSight home" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Leaf className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>NutriSight</span>
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[status=active]:bg-primary/10 data-[status=active]:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Admin
                </Link>
              )}
              <Link to="/profile" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-muted">
                <UserIcon className="h-3.5 w-3.5" aria-hidden="true" /> Profile
              </Link>
              <button
                onClick={signOut}
                aria-label="Sign out"
                title="Sign out"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </>
          ) : (
            <Link to="/auth" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90">
              Sign in
            </Link>
          )}
        </div>
      </div>
      <nav aria-label="Primary mobile" className="container-page flex gap-1 overflow-x-auto pb-2 md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/" }}
            className="whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground data-[status=active]:border-primary data-[status=active]:bg-primary/10 data-[status=active]:text-foreground"
          >
            {item.label}
          </Link>
        ))}
        {user ? (
          <>
            {isAdmin && (
              <Link to="/admin" className="whitespace-nowrap rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                Admin
              </Link>
            )}
            <Link to="/profile" className="whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold">
              Profile
            </Link>
            <button
              onClick={signOut}
              aria-label="Sign out"
              className="whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground"
            >
              Sign out
            </button>
          </>
        ) : (
          <Link to="/auth" className="whitespace-nowrap rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}
