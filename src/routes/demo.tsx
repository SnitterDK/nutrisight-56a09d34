import { createFileRoute, Navigate } from "@tanstack/react-router";

// /demo now redirects to the unified /app surface.
export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Redirecting… — NutriSight" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => <Navigate to="/app" />,
});
