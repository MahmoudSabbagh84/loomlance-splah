# Spec — Splash redesign (design system + dashboard alignment)

> **Status:** ✅ Decisions locked (2026-06-22). Covers splash QA **Track A** — F1 (redesign + design system), F2 (unified sign-in + remember-me), F3 (signup fields + autofill), F5 (logout redirect).
> **Goal:** the marketing site and the app feel like one product. Adopt the dashboard's design tokens, codify a reusable system, kill per-page inline styles / one-off hex.

## Decisions
- **Palette:** **full dashboard palette** — violet primary `#6D45F0` + neutral grays (mirror `loomlance-dashboard/src/styles/tokens.css`). **Drop the orange/slate** entirely.
- **Tone:** **light, with dark hero/footer/CTA bands** (premium marketing feel) — dark uses `data-theme="dark"` token values + violet.
- **Implementation:** **add Tailwind** to the splash (build step), mirroring the dashboard's config so utility classes match (`bg-bg`, `text-fg-muted`, `bg-primary`, etc.).
- **Font:** **Outfit** (the dashboard's font), replacing Inter.

## Design system (mirror the dashboard)
- **Tokens:** copy `tokens.css` (`--color-bg/-elevated/-muted`, `--color-fg/-muted/-subtle`, `--color-border/-strong`, `--color-primary/-fg/-hover`, `--color-accent`, success/warning/danger/info) for both light `:root` and `:root[data-theme='dark']`.
- **Tailwind config:** same `theme.extend.colors` → CSS vars mapping; `fontFamily.sans = ['Outfit', …]`; `darkMode: ['class', '[data-theme="dark"]']`; `content: ['./*.html']`.
- **Components (utility-class conventions, consistent across pages):** buttons (primary = `bg-primary text-primary-fg hover:bg-primary-hover rounded-lg`, secondary, ghost, sizes), inputs/labels/field-error, cards (`bg-bg-elevated border border-border rounded-xl`), badges, section container (`mx-auto max-w-6xl px-...`), consistent vertical rhythm + heading scale. No inline `style=`.
- Rewrite `LoomLance-Design-System.md` to the new system (supersede the orange v1.0).

## Tailwind setup (buildful)
- `package.json` (devDeps: `tailwindcss@^3.4`, `postcss`, `autoprefixer`) + script `build:css`.
- `tailwind.config.js` (mirror dashboard, content = HTML files).
- `src/input.css` = `@import tokens` + `@tailwind base/components/utilities` + base layer (Outfit body, focus ring).
- Output → `styles.css` (replace the old hand-written one), referenced by every page.
- **Outfit font** via Google Fonts `<link>` on each page (replace the Inter link).

## Page rebuild plan (each → Tailwind, on the system)
1. **index.html** (home) — establishes the visual language (dark hero + violet, light feature sections, dark footer).
2. **pricing.html** — rebuild the 4 cards (content already correct from Track B) on the system.
3. **signup.html** — rebuild form on the system **+ F3** (drop username, fix `autocomplete` so email is saved; trim fields to what `profiles` uses).
4. **signin.html** — rebuild **as the unified sign-in (F2)** + **remember-me**; decide canonical page (see F2). 
5. **contact.html** — rebuild on the system.
6. **F5** — point dashboard logout at the unified sign-in once F2's canonical page is set.

## Amplify build change
Splash app build spec changes from "no build" to: `npm ci` → `npm run build:css`; artifacts = repo root (HTML + built `styles.css` + assets). Verify the deploy still serves.

## Phases
1. ✅ **Foundation (done, commit `8f8eebc`):** Tailwind tooling (`package.json`, `tailwind.config.js`, `postcss.config.js`), `src/tokens.css` (mirrors dashboard), `src/input.css` (base + component classes `.btn/.btn-primary/.card/.field-*/.section`), builds to `app.css`. Outfit font. Amplify stays no-build → **commit the built `app.css`**; run `npm run build:css` before each commit (Tailwind tree-shakes by scanned classes).
2. ✅ **Home (`index.html`) rebuilt (done, commit `5cbf6af`):** dark violet hero + product preview, light feature grid (real shipped features) + "more on the way" line, about, dark CTA band + footer; truthful value props; no inline styles; links `app.css` + Outfit.
3. ✅ **Pricing, Contact rebuilt (done, commit `d08f68d`):** both on the system — shared sticky header + dark CTA band + dark footer (mirroring `index.html`). `pricing.html`: 4 cards (Solo / Freelancer-featured / Studio / Agency-coming-soon) on the finalized matrix, monthly/annual segmented toggle ($19/$16, $49/$41), native `<details>` FAQ rewritten for 2026 (Studio is live; dropped the stale "Studio coming Q2 2025" item + fixed trial/payment copy). `contact.html`: info + form cards; preserved the validation/rate-limit/mailto JS (reworked the char-counter to toggle classes, not replace `className`, so Tailwind utilities survive). **Head note:** matched `index.html` and dropped the old CSP meta (its `script-src 'self'` blocked gtag/unpkg-lucide/Google Fonts — i.e. it was already non-functional); flagged for the user in case they want CSP re-added at the Amplify/server layer.
4. 🔶 **Sign-in unification done; signup remaining.** ✅ **Signin / F2 + remember-me + F5:** splash `signin.html` → hostname-aware redirect to dashboard `/login`; dashboard `LoginPage` got Remember-me (`lib/authStorage.js` switchable storage adapter, 9 tests); F5 was a no-op. 🔜 **Signup (+F3: drop username, fix email autocomplete)** still to do.
5. 🔜 Rewrite `LoomLance-Design-System.md` to the new system; final build; deploy.

> **Resume:** next is Phase 4 — `signup.html` then `signin.html`. ⚠️ Both currently carry large per-page `<style>` blocks + the auth JS (`auth-loomlance.js`); rebuild markup on the system but **preserve the auth wiring**. `signin.html` is the **F2 unified sign-in** (decide canonical page vs. dashboard `/login` first) + **remember-me**; then **F5** (point dashboard logout there). `signup.html` gets **F3** (drop username, fix `autocomplete` so the browser saves email). Pattern per page: head → `index.html` style (Outfit + `app.css`), rebuild markup with utilities + component classes, drop `styles.css`, `npm run build:css`, verify on the local server, commit. `styles.css` (old orange) can be deleted once signup + signin are off it (they're the last two).

> HARD GATE per phase: review before moving on.

### F2 / F5 decision — SETTLED (2026-06-22)
**Canonical sign-in = dashboard `/login`** (option b). The dashboard owns the session + `AuthGate` already targets `/login` + it's already redesigned → no cross-domain handoff hop, minimal rebuild. Consequences for Phase 4:
- **Splash `signin.html`** → drop the form; make it a **redirect** to the dashboard login (hostname-aware: `localhost:4173/login` / `app.loomlance.com/login`, reuse `auth-loomlance.js`'s `DASHBOARD_URL` logic). Point all splash "Sign in" links at the dashboard login. This also retires `signin.html`'s dependence on `styles.css`.
- **"Remember me"** → built on the **dashboard `LoginPage.jsx`** (Supabase storage: localStorage when checked, sessionStorage when not — supabase-js v2 selects storage at client creation, so use a storage adapter keyed on the checkbox).
- **F5 (logout redirect)** → **no-op**: `useSignOut.js` already `navigate('/login')` = the canonical page.
- **`signup.html`** → redesign on the system + **F3** (drop username, fix `autocomplete` so the browser saves email). Independent of the F2 work.
- `styles.css` (old orange) can be deleted once `signup.html` is redesigned and `signin.html` is a redirect (the last two consumers).
