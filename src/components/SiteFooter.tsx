import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-surface/60">
      <div className="container-page grid gap-8 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Leaf className="h-5 w-5" />
            </span>
            NutriSight
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Personal food intelligence before you eat.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Product</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/demo" className="hover:text-foreground">Try Demo</Link></li>
            <li><Link to="/how-it-works" className="hover:text-foreground">How it works</Link></li>
            <li><Link to="/glasses" className="hover:text-foreground">AI Glasses Vision</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/disclaimer" className="hover:text-foreground">Disclaimer</Link></li>
            <li><a href="mailto:hello@nutrisight.app" className="hover:text-foreground">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container-page flex flex-col items-start justify-between gap-2 py-5 text-xs text-muted-foreground md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} NutriSight. Estimated nutrition guidance — not medical advice.</span>
          <span>Built for XPRIZE-style demos.</span>
        </div>
      </div>
    </footer>
  );
}
