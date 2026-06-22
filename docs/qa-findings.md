# Splash + Auth QA — findings log

> **Scope:** the splash site (`loomlance.com`) and the **signup → confirm → login → dashboard** workflow (shared Supabase; hands off to `app.loomlance.com`).
> **Mode:** 🎥 **CAPTURE** — findings are logged as they're observed; **fixes are held until the user says "QA done,"** then triaged.
> **Started:** 2026-06-22.

## Environment
- **Live:** splash `https://loomlance.com` → dashboard `https://app.loomlance.com` (both on Amplify). Primary QA target.
- **Local (if needed):** splash `http://localhost:8080`, dashboard preview `http://localhost:4173`.
- Shared Supabase project `zbipqfsqxnvrzhpdjvvy`. Auth handoff via token hash (`auth-loomlance.js`, hostname-aware).
- **Known pending config (expected, not bugs):** Supabase Auth URL config (Site URL / Redirect URLs) not yet set; Supabase built-in auth email is rate-limited; Stripe still test mode.

## Status legend
🆕 Captured · 🔧 Triaged (fix planned) · ✅ Fixed · ⏭️ Deferred (future phase) · ❎ Not a bug / by design

## Pages in scope
`index.html` (home) · `pricing.html` · `signup.html` · `signin.html` · `contact.html` · the auth handoff + dashboard landing.

---

## Findings

### F1 — Splash redesign to match the dashboard's color theme 🧪 (brainstorming) · 🆕 Captured
- **Page(s):** site-wide (starting with `index.html`); applies to all splash pages for consistency.
- **Severity:** P2 (visual/brand consistency — not a functional break).
- **Observation:** the splash's visual design (notably the **color theme** — currently an orange `#F39C12`/`#E67E22` + slate `#2D3E50` palette) is **out of line with the dashboard's established theme** ("Slate Pro" design system). The marketing site and the app should feel like one product.
- **Ask:** a **redesign pass** to bring the splash in line with the dashboard's colors (and likely typography/components/spacing too). User explicitly tagged this for **brainstorming + a dedicated UI/UX design pass** before any implementation — not a quick CSS tweak.
- **References for the design pass:** dashboard design tokens / "Slate Pro" UI (`loomlance-dashboard/src/components/ui/*`, theme CSS vars like `--color-*`), and the splash's own `LoomLance-Design-System.md`. Decide the canonical palette (does the dashboard theme win outright, or keep an accent from the splash?) during brainstorm.
- **Scope add (layout & component uniformity):** beyond color, the **visual layout is inconsistent** — items/sections, **buttons**, and **form fields** aren't uniform; there are **visual artifacts** in how things are organized/aligned/spaced across pages. The redesign must establish a **codified set of UI rules the splash follows** — same approach we took with the dashboard's design system: standardize button variants/sizes, input/field styling, spacing scale, section layout/rhythm, typography, and reuse them everywhere instead of per-page one-off inline styles (the splash currently has lots of inline `style="…"` and per-page `<style>` blocks). Goal: one consistent system, no ad-hoc artifacts.
- **Status:** 🆕 captured — defer to a UI/UX brainstorm → design spec (a real splash design system / rule set) → implement (after "QA done").

### F2 — Unify sign-in into a single page (+ "Remember me") 🆕 Captured
- **Page(s):** splash `signin.html` **and** dashboard `LoginPage.jsx` (`app.loomlance.com/login`) — there are currently **two** sign-in pages.
- **Severity:** P2 (UX clarity / maintenance — two diverging login UIs to keep in sync).
- **Observation:** we built a sign-in on the splash, but the dashboard already has its own login page → **two places to sign in**, confusing and duplicative.
- **Ask:** consolidate to **one** sign-in page so the flow is simple. **Open decision (triage):** which is canonical?
  - (a) **Splash `signin.html` is the only login** → dashboard `/login` redirects to it (keeps "marketing/auth lives on splash"), or
  - (b) **Dashboard login is canonical** → splash "Sign in" links straight to `app.loomlance.com/login` (drop the splash form). Note original architecture was "dashboard owns login."
- **Also add "Remember me"** — a checkbox that controls session persistence: checked → persist across browser restarts (localStorage, current default); unchecked → session-only (sessionStorage, clears on close). Implement on whichever page becomes canonical (Supabase client `persistSession`/storage handling).
- **Status:** 🆕 captured — decide canonical page at triage; then implement single page + remember-me.

### F3 — Reconsider signup data collection + fix email/username autofill mismatch 🆕 Captured
- **Page(s):** `signup.html` (and the login identifier consistency with `signin.html`).
- **Severity:** P2 (UX/logistics + data hygiene).
- **Observation:** signup collects a **username**, but **login uses email** — and the browser offered to save the **username** for autofill instead of the email, so on return the autofill won't match the login field. Mismatch between what we collect, what identifies the user, and what the browser remembers.
- **Underlying facts:** the system identifies users by **email** (Supabase auth) + `profiles.display_name`; **there is no `username` column** in `profiles` (the signup currently stuffs `username` into user metadata, where it's unused). Current signup fields: firstName, lastName, email, **username**, password, confirmPassword, phone, terms, marketing-opt-in (+ plan/card).
- **Ask:** audit every field for **relevance** and optimize for **user convenience**:
  - Drop **username** (or repurpose) since login is email-based and it's not stored/used — eliminates the autofill confusion.
  - Ensure **autocomplete** attributes align so browsers save/offer **email** for login (`autocomplete="email"` on email, `autocomplete="current-password"`/`"new-password"` appropriately; remove `autocomplete="username"` on the email field, etc.).
  - Reconsider **phone** and **first/last vs. a single name** — collect only what the product needs (names → `display_name`).
  - Tie required fields to what actually flows into Supabase metadata / `profiles`.
- **Status:** 🆕 captured — decide the final field set at triage (overlaps with F1 form redesign and the pricing/plan review); then trim fields + fix autocomplete.

### F4 — Confirmation email is unbranded (sent as Supabase, not LoomLance) 🆕 Captured
- **Flow:** signup → email confirmation.
- **Severity:** P1 (trust/brand — first email a new user receives looks like a generic Supabase message, not LoomLance).
- **Observation:** the confirmation email arrives from Supabase's **default sender + default template** (generic "Supabase" branding / from-address), not from LoomLance.
- **Resolution path (triage):**
  1. **Custom SMTP in Supabase** (Auth → Settings → SMTP) so auth emails send from a LoomLance address — **reuse AWS SES** (we already have the verified `send.loomlance.com` domain). Note: this needs **SES SMTP credentials** (generated in the SES console — distinct from the IAM API keys we made for the invoice function) and a verified from-address (e.g. `noreply@send.loomlance.com`, or verify `loomlance.com` root in SES for `noreply@loomlance.com`).
  2. **Brand the email templates** (Auth → Email Templates: Confirm signup, Magic Link, Reset Password, etc.) — LoomLance logo, colors, copy, and correct links.
  3. Removes the built-in email **rate limit** too (the noted pre-launch concern).
- **Status:** 🆕 captured — needs SES SMTP creds + Supabase SMTP/template config (USER provisions SES SMTP; I can draft the branded templates). Ties into F1 brand work.

### F5 — Logout lands on the dashboard's own sign-in page (should go to the unified page) 🆕 Captured
- **Page(s):** dashboard logout → currently routes to `app.loomlance.com/login` (the dashboard's `LoginPage`).
- **Severity:** P2 (UX consistency).
- **Observation:** logging out of the dashboard sends the user to the **dashboard's** sign-in page — but once sign-in is unified (**F2**), logout should land on that single canonical page instead.
- **Ask:** after F2 decides the canonical sign-in, point the dashboard's **post-logout redirect** there (e.g. `https://loomlance.com/signin` if the splash page is canonical, or stay on `/login` if the dashboard page wins). Resolve **together with F2**.
- **Status:** 🆕 captured — dependent on F2 (fix logout redirect when sign-in is unified).

### F6 — Wire Stripe to collect LoomLance subscriptions (set tier) 🧪 (brainstorming/build) · 🆕 Captured
- **Scope:** the **platform subscription** billing — LoomLance charging the freelancer for their plan (Solo/Freelancer/Studio → `profiles.subscription_tier`). This is the deferred **pricing-review** task.
- **Severity:** P1 (no revenue collection until done).
- **⚠️ Distinct from Stripe Connect:** we already built **Stripe Connect** (freelancers collecting from *their* clients on invoices). This is the **other** Stripe integration — **Stripe Billing/Checkout in subscription mode** for LoomLance's own plans. Keep the two separate (different keys/usage, different webhooks/events).
- **Needs (triage/brainstorm):**
  - Stripe **Products + recurring Prices** per plan (monthly/annual?), `price_…` IDs.
  - **Checkout Session in `mode: 'subscription'`** (from pricing/signup) → a Stripe **Customer** mapped to the Supabase user.
  - **Webhook** on `customer.subscription.created/updated/deleted` + `invoice.paid` → set/clear `profiles.subscription_tier` (and trial handling — signup mentions a 14-day trial).
  - **Self-service:** Stripe **Customer Portal** so users can upgrade/downgrade/cancel/update card.
  - Schema: store `stripe_customer_id`, `stripe_subscription_id`, status on the profile.
- **Status:** 🆕 captured — major feature; brainstorm → spec → build. Pairs with the **pricing + features finalization** the user flagged.

### F7 — User & subscription management (admin) system 🧪 (brainstorming/build) · 🆕 Captured
- **Scope:** an internal way to **manage users and their subscriptions** — view all users, their tier/subscription status, and act (comp/upgrade/downgrade/cancel, disable, resend confirmation, etc.).
- **Severity:** P2 (operational need once there are real users).
- **Needs (triage/brainstorm):**
  - An **admin role** concept (e.g. `profiles.role`/an allowlist) gating an **admin-only area** (in the dashboard, or a separate backoffice).
  - User list w/ search; per-user detail: email, tier, Stripe subscription state, signup date, activity.
  - Admin actions — backed by **service-role** Edge Functions / RLS-aware admin policies (never expose service role client-side).
  - Lean on **Stripe dashboard + Customer Portal** for billing ops where possible to avoid rebuilding Stripe's UI; build only what's LoomLance-specific.
- **Depends on F6** (subscription data must exist to manage it).
- **Status:** 🆕 captured — major feature; brainstorm → spec → build after F6.

### F8 — Anti-fraud signup measures (phone verification, etc.) for free tier 🧪 (brainstorming/build) · 🆕 Captured
- **Flow:** signup (especially **free tier**).
- **Severity:** P1 (abuse vector — one person spinning up tens of free accounts).
- **Observation:** nothing currently stops mass free-account creation; we want stronger sign-up verification to combat fraud/abuse.
- **Options (triage/brainstorm — layer several):**
  - **Phone verification (SMS OTP)** — Supabase phone auth / OTP, needs an **SMS provider** (Twilio/MessageBird/etc.; cost + friction). Verified phone as a uniqueness signal; consider limiting N free accounts per phone.
  - **CAPTCHA** — Supabase has built-in **hCaptcha / Cloudflare Turnstile** for auth; cheap, low-friction first line.
  - **Require email confirmation** (we already have it as a toggle — enforce it).
  - **Disposable/temp-email blocking**, **rate limiting** per IP, and watching duplicate device/payment fingerprints.
  - Reserve the heaviest verification (phone) for **free tier**; paid tiers are self-limiting via a card.
- **Reconciles with F3:** the signup `phone` field — instead of dropping it (F3), it may become a **verified** field used for anti-fraud. Decide together.
- **Status:** 🆕 captured — brainstorm the layered approach (likely CAPTCHA + enforced email confirm first, phone-OTP for free tier if abuse appears); needs an SMS provider for phone.

---

## Non-QA notes (roadmap)

### N1 — Internal staff/admin console (operations, support, troubleshooting) 🧪 (brainstorming/build)
- **Not a splash-QA bug** — a separate product: an **internal tool for LoomLance employees** to run the platform: manage users & subscriptions, **troubleshoot** issues, **provide customer support**, view activity/logs, impersonate-to-debug, issue refunds/comps, handle account actions, etc.
- **Relationship to F7:** F7 (user & subscription management) is essentially **one module of this larger staff console** — fold F7 into this when scoping.
- **Considerations (future brainstorm → spec):**
  - **Separate app / admin-only area**, behind an **employee role** (distinct from customer accounts), strong auth (SSO/2FA), strict access control.
  - All privileged actions via **service-role Edge Functions** with audit logging — never service-role on the client.
  - Surface support essentials: find a user, see their tier/subscription (Stripe), recent invoices/activity, resend confirmation/reset, safe "view as" for debugging.
  - Reuse the dashboard's design system; lean on Stripe dashboard/Customer Portal for billing ops.
- **Status:** captured as a roadmap initiative — its own brainstorm → spec → build later; absorbs F7.
