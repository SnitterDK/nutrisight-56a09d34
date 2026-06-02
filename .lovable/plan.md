
This is a very large scope. To ship something high-quality for XPRIZE/Devpost rather than a thin pass over 30 features, I'll break it into phases and deliver Phase 1 now. You can approve more after.

## Phase 1 — Ship now (this turn)

**A. Landing page upgraded for Google AI Mode / AI Overviews (May 2026)**
- New `<AnswerBlocks>` section: 10 conversational H2s ("What is NutriSight?", "Can NutriSight estimate calories from a photo?", "Is NutriSight medical advice?", etc.) with 40–60 word extractable answers.
- New comparison table component: NutriSight vs traditional calorie trackers; Scan vs Describe vs Compare; What it can/can't estimate.
- New FAQ section with `FAQPage` JSON-LD schema (matching visible content).
- Add `SoftwareApplication` + `Organization` JSON-LD to root.
- `HowTo` JSON-LD on the existing "How it works" section.
- Tighten `head()` meta on `/`, `/learn`, `/how-it-works`, `/about`, `/glasses`, `/disclaimer` (unique title + description + og tags per route, no duplicates).
- Limitations + trust blocks (extractable, plain text).

**B. "Choose Better" comparison feature** (the core differentiator)
- New route `/compare` + dashboard quick action.
- Two upload slots → AI returns a side-by-side table (calories, protein, sugar, fiber, satiety, blood-sugar stability) + 1-line recommendation tied to user's goal.
- New server fn `compareFoods` in `src/lib/scan.functions.ts` (Gemini 2.5 Pro, structured JSON).

**C. "Describe Meal" flow**
- New route `/describe` + dashboard quick action.
- Text input → server fn `describeMeal` parses to structured items + nutrition estimate + confidence + edit/save to `meals`.
- Voice button stub (mic icon, "Coming soon" tooltip).

**D. Today dashboard polish** (`/app`)
- Time-of-day greeting (morning/afternoon/evening).
- 6 quick-action buttons: Scan, Describe, Compare, Receipt/Menu (existing recipe mode), Ask, Add manually (stub).
- "Today's Insight" AI card based on today's meal totals vs goal.
- Meal Impact card on each saved meal.

## Phase 2 — Next turn (if approved)
- Receipt/label scan polish, health-data placeholder screens (Google Fit/Apple Health "Connect" UI), content hub article templates with `Article` schema, dark-mode pass, skeleton loaders, optimistic save.

## Phase 3
- Voice transcription, manual add form, full edit/delete flows, performance audit, accessibility audit.

## Out of scope (won't fake)
- Real OCR for receipts/labels (kept as Gemini vision, labeled "estimate").
- Real Health Connect / Apple Health (UI placeholder only, clearly labeled).
- Fake reviews/ratings in schema.

## Technical notes
- All AI calls go through existing `createServerFn` + Lovable AI Gateway pattern.
- JSON-LD injected via TanStack `head().scripts` (per `head-meta` rules — `og:image` only on leaves, canonical only on leaves).
- New components live in `src/components/`, no design-token violations, mobile-first.

Approve Phase 1 and I'll build it.
