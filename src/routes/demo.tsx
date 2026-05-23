import { createFileRoute, Navigate } from "@tanstack/react-router";

// /demo now redirects to the unified /app surface.
export const Route = createFileRoute("/demo")({
  component: () => <Navigate to="/app" />,
});
