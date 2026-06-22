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
1. **Foundation:** Tailwind tooling + tokens + config + input.css + build + Amplify spec + Outfit. (No visual change yet beyond wiring.)
2. **Home (index.html)** rebuilt — review the language.
3. **Pricing, Contact** rebuilt.
4. **Signup (+F3)**, **Signin (unified +F2 remember-me)**, **F5 logout**.
5. Rewrite the design-system doc; final lint/build; deploy.

> HARD GATE per phase: review before moving on. Open F2 decision (canonical sign-in: splash vs dashboard) to settle at Phase 4.
