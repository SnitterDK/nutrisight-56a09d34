import { Sparkles } from "lucide-react";
import type { AiMetaPublic } from "@/lib/scan.functions";

const MODEL_LABEL: Record<string, string> = {
  "google/gemini-2.5-flash": "Gemini 2.5 Flash",
  "google/gemini-2.5-pro": "Gemini 2.5 Pro",
  "google/gemini-3-flash-preview": "Gemini 3 Flash",
};

export function GeminiBadge({ meta, className = "" }: { meta?: AiMetaPublic; className?: string }) {
  if (!meta) return null;
  const label = MODEL_LABEL[meta.model] ?? meta.model.replace("google/", "");
  const sec = (meta.latency_ms / 1000).toFixed(1);
  return (
    <div
      className={`inline-flex flex-wrap items-center gap-1.5 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-2.5 py-1 text-[10px] font-semibold text-brand-blue-foreground ${className}`}
      title={`Analyzed by ${label} via Lovable AI Gateway — ${meta.latency_ms} ms`}
    >
      <Sparkles className="h-3 w-3" />
      <span>Analyzed by Google {label}</span>
      <span className="opacity-60">·</span>
      <span className="opacity-80">{sec}s</span>
    </div>
  );
}
