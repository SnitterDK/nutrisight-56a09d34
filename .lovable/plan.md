# NutriSight Admin Dashboard — Plan

## Important clarification: Firebase vs Lovable Cloud

NutriSight already runs on **Lovable Cloud** (managed Postgres + Auth + Storage + AI Gateway), with Google sign-in wired through the Lovable auth broker. Switching to **Firebase Authentication** would mean:
- migrating every existing user, profile, meal, scan, and learning_progress row out of Postgres,
- rewriting every server function and RLS policy,
- losing Lovable AI Gateway integration (Gemini calls go through it today),
- maintaining two auth systems in parallel during the XPRIZE deadline.

I will **keep Lovable Cloud** and implement the admin exactly as you described — Google login restricted to `kasper.mathiesen@gmail.com`, server-side role check, no public exposure. This is functionally identical security-wise and ships ~10× faster. If you specifically want Firebase later, we can migrate post-XPRIZE.

If you want Firebase anyway, stop me here and I'll re-plan.

---

## Build order (your priority list)

### Phase 1 — Foundation (this turn)
1. **Secure admin gate**
   - DB: `app_role` enum (`admin`, `user`), `user_roles` table, `has_role()` security-definer function (per Lovable security rules — roles never live on profiles).
   - Seed the admin role for `kasper.mathiesen@gmail.com` on first sign-in via a trigger that checks `auth.users.email`.
   - Route: `src/routes/_admin/route.tsx` — client-rendered gate (`ssr:false`) that calls a server fn `requireAdmin` and redirects non-admins to `/` with a toast.
   - `robots.txt` already blocks crawlers for `/admin*`; add `<meta name="robots" content="noindex,nofollow">` in the admin layout `head()`.

2. **KPI Dashboard** (`/admin`)
   - Server fn `getAdminKpis` (admin-only) aggregates from existing tables (`profiles`, `meals`, `learning_progress`) + new `beta_signups`, `feedback`, `gemini_logs`, `scan_events`.
   - KPI cards: total users, signups today/week, total scans, scans today, Gemini calls, active users today/week, top goal, avg health score, feedback count, signup conversion, revenue ($0).

3. **New tables (one migration)**
   - `beta_signups` (name, email, selected_goal, message, source_page, consent_contact, consent_testimonial, status enum, internal_notes, created_at)
   - `feedback` (user_id nullable, email, rating 1–5, feedback_text, feature_area, testimonial_permission, created_at)
   - `gemini_logs` (user_id nullable, input_type, prompt_summary, response_summary, model_used, status, latency_ms, token_usage jsonb, safety_flags, created_at)
   - `scan_events` (user_id nullable, anonymous_id, input_type, selected_goal, detected_food_items jsonb, calories/sugar/carbs/protein/fiber/salt numeric, recommendation, confidence numeric, used_gemini bool, safety_disclaimer_shown bool, created_at)
   - All with RLS: owner-insert + admin-read via `has_role(auth.uid(),'admin')`. GRANTs included.
   - Wire existing `scan.functions.ts` and `compareFoods`/`describeMeal` to write into `gemini_logs` and `scan_events`.

4. **Beta Signups page** (`/admin/beta`)
   - Public landing form (`<BetaSignupForm>` on `/`) → inserts into `beta_signups` with consent checkboxes.
   - Admin table: search, filter by status/goal, change status, internal notes, CSV export.

### Phase 2 — Visibility (next turn)
5. **Charts** (recharts, already installed)
   - Signups over time, scans over time, goal distribution pie, input-type bar, Gemini calls line, success/error split.
6. **Users page** — list with scan counts, last_seen (computed), delete/anonymize.
7. **Scan Events page** + **Gemini Logs page** ("Gemini API usage evidence" header for XPRIZE).
8. **Feedback page** + inline feedback widget in `/app`.

### Phase 3 — Polish
9. **Reports page** — Traction / AI Usage / Learning / Business, each downloadable as CSV + Markdown.
10. **Export page** — date-filtered CSV exports for every table.
11. **Email notifications** — Lovable Emails (sender domain setup dialog first) → `kasper.mathiesen@gmail.com` on new beta signup / feedback / scan milestone. If you'd rather skip the domain setup, I can use a transactional connector instead — tell me which.
12. **Settings page** — feature flags stored in a single-row `admin_settings` table.

---

## Technical details

- **No Firebase.** Lovable Cloud Postgres + Lovable Auth (Google via broker) + Lovable AI Gateway (Gemini).
- **Admin check is server-side only.** Client never decides admin status; every admin server fn calls a `requireAdmin` middleware that runs `has_role(userId, 'admin')`. Client UI checks are cosmetic.
- **Anonymous scan logging.** `scan_events` and `gemini_logs` accept `anonymous_id` (localStorage UUID) so demo users on the public landing page generate real telemetry without auth.
- **No PII in client bundles.** Admin email lives only in the DB seed trigger; not hardcoded in any frontend file.
- **`noindex`** via meta + existing `robots.txt` disallow.
- **GRANTs** on every new public-schema table (per Lovable rules).
- **Realtime not enabled** on admin tables — pull on navigation, refresh button per page.

---

## Out of scope for this plan
- Switching to Firebase (see top).
- Payment integration (cards show $0 placeholder until Stripe is enabled).
- Sending real emails before a sender domain is configured — Phase 3 will trigger the domain-setup dialog.

Reply **"go"** to start Phase 1, or tell me which phases to drop / reorder.