# LoomLance Design System
**Version 2.0 — "Slate Pro"** | **Last updated:** 2026-06-22

The visual language for the LoomLance **splash/marketing site** (`loomlance.com`), built to feel like one product with the **dashboard** (`app.loomlance.com`). v2.0 **supersedes v1.0** (the October-2024 orange/slate system), which is fully retired — no orange (`#F39C12`), no `#2D3E50`, no hand-written `styles.css`.

> **Source of truth (don't hand-edit derived files):**
> - Tokens → `src/tokens.css` (mirrors `loomlance-dashboard/src/styles/tokens.css`)
> - Tailwind theme → `tailwind.config.js`
> - Base layer + component classes → `src/input.css`
> - Built output → `app.css` (generated; **committed** to the repo)
>
> Change tokens/components in those files, run `npm run build:css`, and commit the regenerated `app.css`.

---

## Philosophy
- **One product.** The marketing site and the app share the same palette, type, and components. A visitor shouldn't feel a seam between `loomlance.com` and `app.loomlance.com`.
- **Violet primary on neutral grays.** Calm, premium, developer-credible. Light by default, with **dark bands** (hero / CTA / footer) for contrast and a premium marketing feel.
- **Tokens + utilities, not one-offs.** Everything maps to a CSS variable consumed through Tailwind. No inline `style=`, no per-page `<style>` blocks, no ad-hoc hex.
- **Accessible.** Sufficient contrast; status conveyed by more than color.

---

## Tooling & build
- **Tailwind CSS 3.4** (buildful). `npm run build:css` compiles `src/input.css` → `app.css` (minified). `npm run watch:css` for local dev.
- **Fonts:** **[Outfit](https://fonts.google.com/specimen/Outfit)** for body/UI; **[Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque)** for display headings (`h1`/`h2`). Both via Google Fonts, loaded per page with a `<link>` + `preconnect`. The `h1, h2` font-family rule lives in `src/input.css` (base layer); `h3`, body, and the wordmark stay Outfit. The **marketing site** uses the display face for personality; the **app/dashboard stays all-Outfit** — a deliberate, restrained divergence (cohesive palette + components, more expressive type on marketing).
- **Icons:** [Lucide](https://lucide.dev) via the UMD script (`<i data-lucide="...">` + `lucide.createIcons()` on load). For icons that must toggle at runtime, use inline `<svg>` instead — `createIcons()` replaces the `<i>` placeholder.
- **Hosting:** AWS Amplify serves the static files **no-build**, so the compiled `app.css` is committed. **Always run `npm run build:css` before committing** any markup/token change — Tailwind tree-shakes by scanned classes (`content: ['./*.html']`), so a class that isn't in an HTML file won't exist in `app.css`.

Per-page `<head>` (mirror `index.html`): `app.css`, the Bricolage Grotesque + Outfit `<link>`, gtag, and the Lucide script. (Security headers like CSP belong at the Amplify/server layer, not as `<meta>` — the old per-page CSP was non-functional and was removed.)

---

## Color tokens

Defined as CSS variables in `src/tokens.css` for both themes, exposed to Tailwind as semantic color utilities (`bg-bg`, `text-fg-muted`, `bg-primary`, `border-border`, …). Dark mode is `data-theme="dark"` on `:root`.

### Light (`:root`)
| Token | Hex | Tailwind | Use |
|---|---|---|---|
| `--color-bg` | `#FBFBFD` | `bg-bg` | Page background |
| `--color-bg-elevated` | `#FFFFFF` | `bg-bg-elevated` | Cards, header, inputs |
| `--color-bg-muted` | `#F1F3F7` | `bg-bg-muted` | Subtle/alt sections, chips |
| `--color-fg` | `#14181F` | `text-fg` | Primary text, headings |
| `--color-fg-muted` | `#5A6472` | `text-fg-muted` | Secondary text, labels |
| `--color-fg-subtle` | `#8A95A5` | `text-fg-subtle` | Hints, placeholders, disabled |
| `--color-border` | `#E4E7EC` | `border-border` | Default borders, dividers |
| `--color-border-strong` | `#CBD2DC` | `border-border-strong` | Hover/emphasis borders |
| `--color-primary` | `#6D45F0` | `bg-primary` / `text-primary` | Primary actions, brand, links |
| `--color-primary-fg` | `#FFFFFF` | `text-primary-fg` | Text on primary |
| `--color-primary-hover` | `#5B37D6` | `hover:bg-primary-hover` | Primary hover |
| `--color-accent` | `#7C5CFF` | `bg-accent` / `text-accent` | Accent dots, "Lance" mark on dark |
| `--color-success` | `#15A66E` | `text-success` | Success |
| `--color-warning` | `#C77A12` | `text-warning` | Warning |
| `--color-danger` | `#DC4040` | `text-danger` | Errors, destructive |
| `--color-info` | `#2D74D6` | `text-info` | Info |

### Dark (`:root[data-theme='dark']`)
| Token | Hex |
|---|---|
| `--color-bg` | `#0B0E14` |
| `--color-bg-elevated` | `#151B26` |
| `--color-bg-muted` | `#1E2532` |
| `--color-fg` | `#E6EDF3` |
| `--color-fg-muted` | `#94A3B8` |
| `--color-fg-subtle` | `#64748B` |
| `--color-border` | `#222B38` |
| `--color-border-strong` | `#324054` |
| `--color-primary` | `#7C5CFF` |
| `--color-primary-hover` | `#8E72FF` |
| `--color-accent` | `#A78BFF` |
| `--color-success` | `#34D399` |
| `--color-warning` | `#F5B14C` |
| `--color-danger` | `#F87171` |
| `--color-info` | `#60A5FA` |

> **Dark marketing bands** (hero / CTA / footer) intentionally use **fixed near-black hexes** for a consistent premium look regardless of theme: section `#0B0E14`, footer `#070A0F`, plus `text-white` and `white/NN` opacities. These are the only sanctioned literal colors; everything else goes through tokens.

### Tailwind mapping (`tailwind.config.js`)
```js
darkMode: ['class', '[data-theme="dark"]'],
content: ['./*.html'],
theme: { extend: {
  colors: {
    bg: 'var(--color-bg)', 'bg-elevated': 'var(--color-bg-elevated)', 'bg-muted': 'var(--color-bg-muted)',
    fg: 'var(--color-fg)', 'fg-muted': 'var(--color-fg-muted)', 'fg-subtle': 'var(--color-fg-subtle)',
    border: 'var(--color-border)', 'border-strong': 'var(--color-border-strong)',
    primary: { DEFAULT: 'var(--color-primary)', fg: 'var(--color-primary-fg)', hover: 'var(--color-primary-hover)' },
    accent:  { DEFAULT: 'var(--color-accent)',  fg: 'var(--color-accent-fg)' },
    success: 'var(--color-success)', warning: 'var(--color-warning)', danger: 'var(--color-danger)', info: 'var(--color-info)',
  },
  fontFamily: { sans: ['Outfit', 'system-ui', '-apple-system', 'sans-serif'] },
}}
```

> **Opacity note:** color tokens are bare `var(...)`, so the `/opacity` modifier (`bg-primary/10`) works in **HTML utilities** but **not inside `@apply`**. For a tinted background in a component class, use `color-mix(in srgb, var(--color-primary) N%, var(--color-bg-elevated))` instead (see `.plan-option.plan-selected`).

---

## Typography (Outfit + Bricolage Grotesque)

**Display headings (`h1`, `h2`) render in Bricolage Grotesque** (set in `src/input.css` base layer) for marketing personality; `h3`, body, and the wordmark stay **Outfit**. The size/weight classes below are unchanged.

| Role | Classes |
|---|---|
| Hero `h1` | `text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl` |
| Section `h2` | `text-3xl font-bold tracking-tight sm:text-4xl` |
| Card title `h3` | `font-semibold` (≈ base) |
| Lead paragraph | `text-lg text-fg-muted` |
| Body | base / `text-sm`, `text-fg-muted` for secondary |
| Fine print | `text-xs text-fg-subtle` |
| Wordmark | `font-bold tracking-tight` — `Loom` in `text-fg` (or `text-white` on dark), `Lance` in `text-primary` (or `text-accent` on dark) |

---

## Component classes (`src/input.css`)
Reusable classes layered with `@apply`. Use these for consistency; one-off layout still uses raw utilities.

```css
@layer components {
  .btn          { @apply inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors; }
  .btn-primary  { @apply btn bg-primary text-primary-fg hover:bg-primary-hover; }
  .btn-secondary{ @apply btn border border-border bg-bg-elevated text-fg hover:bg-bg-muted; }
  .btn-ghost    { @apply btn text-fg-muted hover:bg-bg-muted hover:text-fg; }

  .card         { @apply rounded-xl border border-border bg-bg-elevated p-6; }

  .field-label  { @apply mb-1.5 block text-sm font-medium text-fg; }
  .field-input  { @apply w-full rounded-lg border border-border bg-bg-elevated px-3 py-2.5 text-sm text-fg placeholder:text-fg-subtle focus:border-primary; }

  .section      { @apply mx-auto max-w-6xl px-5 sm:px-8; }

  /* Selectable plan cards (signup) */
  .plan-option           { @apply relative cursor-pointer rounded-xl border border-border bg-bg-elevated p-3 text-left transition-colors hover:border-border-strong; }
  .plan-option.plan-selected { @apply border-primary ring-1 ring-primary; background-color: color-mix(in srgb, var(--color-primary) 6%, var(--color-bg-elevated)); }
  .plan-check            { @apply absolute right-2 top-2 grid size-5 place-items-center rounded-full bg-primary text-primary-fg opacity-0 transition-opacity; }
  .plan-selected .plan-check { @apply opacity-100; }
  .plan-badge            { @apply absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-fg; }
}
```

**Buttons** sizes are done with utilities (`px-5 py-3 text-base` for large CTAs). **Larger CTA on dark bands** can be a bordered ghost: `btn px-5 py-3 text-base border border-white/20 text-white hover:bg-white/10`.

**Sizing helper:** prefer the `size-*` utility (Tailwind 3.4) for square boxes — `size-8` (logo), `size-11` (feature icon tile).

---

## Layout & section patterns
The home page (`index.html`) is the canonical reference; pricing/contact/signin/signup follow it.

- **Section container:** wrap content in `.section` (`mx-auto max-w-6xl px-5 sm:px-8`). Vertical rhythm: `py-20 lg:py-28` for major sections.
- **Sticky header:**
  ```html
  <header class="sticky top-0 z-50 border-b border-border bg-bg-elevated/80 backdrop-blur">
    <nav class="section flex h-16 items-center justify-between"> … </nav>
  </header>
  ```
  Nav links: `text-sm font-medium text-fg-muted hover:text-fg`; the active page link is `text-primary`. Primary CTA uses `.btn-primary`.
- **Dark hero / CTA band:** `bg-[#0B0E14] text-white`, with violet radial-gradient glows (`bg-[radial-gradient(circle,rgba(124,92,255,0.30),transparent_70%)] blur-2xl`). Body copy at `text-white/70`.
- **Light feature section:** `bg-bg` (or `bg-bg-muted` for alternation). Cards are `.card`; icon tile is `grid size-11 place-items-center rounded-lg bg-primary/10 text-primary`.
- **Footer:** `bg-[#070A0F] text-white/70`, link columns, bottom rule `border-t border-white/10`, copyright at `text-white/40`.
- **Auth/forms:** centered `.card` (signup) using `.field-label` + `.field-input`; native checkboxes styled `size-4 rounded border-border text-primary focus:ring-primary`. Errors: `text-xs text-danger` (toggle a `hidden` class). Banners: `rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger` (and the `success` equivalent).

### Links / URLs
Internal nav uses clean, extensionless, root-absolute paths (`/`, `/pricing`, `/contact`, `/signup`, `/signin`, `/#features`, `/#about`) — Amplify serves these without the `.html`. Sign-in links point through `/signin`, which redirects to the canonical dashboard login (`app.loomlance.com/login`).

---

## Accessibility
- Maintain contrast: `text-fg` for body, `text-fg-muted` for secondary, `text-fg-subtle` only for non-critical hints. On dark bands prefer `text-white/70`+ for readable body copy.
- Focus is visible globally (base layer: `*:focus-visible { @apply outline-none ring-2 ring-primary ring-offset-2 ring-offset-bg; }`).
- Touch targets ≥ ~44px; status never by color alone (pair with icon/text).
- Honeypot/aria-hidden fields use `sr-only` (kept in the DOM, hidden from AT).

---

## Version history
- **2.0 (2026-06-22) — "Slate Pro" violet.** Full Tailwind rebuild mirroring the dashboard; token-driven light+dark palette; component classes; dark marketing bands; Outfit type. Replaces orange and the hand-written `styles.css` (deleted). Applies to `index`, `pricing`, `contact`, `signin`, `signup`.
- **1.0 (Oct 2024) — orange/slate.** Retired. Hand-written CSS, per-page `<style>` blocks, `#F39C12` brand. Superseded entirely by 2.0.

---

**© 2026 LoomLance.** Keep this doc in sync with `src/tokens.css`, `tailwind.config.js`, and `src/input.css` — if they change, update here.
