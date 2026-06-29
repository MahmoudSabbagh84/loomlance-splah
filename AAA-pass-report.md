# WCAG AAA Contrast + Accessibility Pass — Report
**Date:** 2026-06-28  
**Status:** DONE

---

## Files Changed

| File | Changes |
|---|---|
| `src/tokens.css` | 5 token values updated (light `:root` only); `--color-primary-strong` added |
| `tailwind.config.js` | `primary-strong` color added to `colors` map |
| `index.html` | (a) nav solid, (b) `<main>` added, (c) logo alt emptied |
| `pricing.html` | (a) nav solid, (b) `<main>` added, (c) logo alt emptied, (e) active nav links → `text-primary-strong` |
| `contact.html` | (a) nav solid, (b) `<main>` added, (c) logo alt emptied, (e) active nav link + email link → `text-primary-strong` |
| `privacy.html` | (a) nav solid, (b) `<main>` added, (c) logo alt emptied, (e) all 3 body links → `text-primary-strong` |
| `terms.html` | (a) nav solid, (b) `<main>` added, (c) logo alt emptied, (e) all 3 body links → `text-primary-strong` |
| `signup.html` | (c) logo alt emptied, (d) `#checkEmailView` h1 → h2, (e) Terms/Privacy links, Sign in link, Resend button → `text-primary-strong` |

---

## 1. Token changes (`src/tokens.css`, `:root` only)

| Variable | Old value | New value |
|---|---|---|
| `--color-fg-muted` | `#5A6472` | `#3E4756` |
| `--color-fg-subtle` | `#8A95A5` | `#434C5B` |
| `--color-success` | `#15A66E` | `#075A38` |
| `--color-warning` | `#C77A12` | `#6E4206` |
| `--color-danger` | `#DC4040` | `#9E1C1C` |
| `--color-primary-strong` | _(new)_ | `#5326C9` |

Dark-mode block (`[data-theme='dark']`) was **not touched**.

## 2. Tailwind config (`tailwind.config.js`)

Added `'primary-strong': 'var(--color-primary-strong)'` to the `colors` map, enabling the `text-primary-strong` utility.  
Also added `strong: 'var(--color-primary-strong)'` inside the nested `primary` object for `text-primary-strong`-via-object consistency.

## 3. CSS rebuild

`npm run build:css` succeeded in 330ms. Verified in compiled `app.css`:
- All 6 new light-mode token hex values present: `#3e4756`, `#434c5b`, `#5326c9`, `#075a38`, `#6e4206`, `#9e1c1c`
- `--color-primary-strong` and `primary-strong` utility class present
- Dark-mode overrides unchanged

## 4. Per-page changes

### (a) Solid navbar background
Changed `bg-bg-elevated/80 backdrop-blur` → `bg-bg-elevated` on the sticky `<header>` in:
- `index.html`, `pricing.html`, `contact.html`, `privacy.html`, `terms.html`

`signin.html` has no sticky nav header (it's a redirect page). `signup.html` has no nav header. Neither required changes. The `backdrop-blur` remaining on `index.html:97` is on the product-preview card mockup inside the hero — correct, not the nav.

### (b) `<main>` landmark
Opened `<main>` immediately after `</header>` and closed `</main>` immediately before `<footer>` in:
- `index.html`, `pricing.html`, `contact.html`, `privacy.html`, `terms.html`

`signin.html` and `signup.html` already had `<main>` — left untouched.

### (c) Logo alt emptied
Changed `alt="LoomLance"` → `alt=""` on the nav/header logo `<img>` in:
- `index.html`, `pricing.html`, `contact.html`, `privacy.html`, `terms.html`
- `signup.html` (logo inside `<main>`)

`signin.html` has no logo image — nothing to change.

### (d) signup dual-h1
Changed `<h1 class="mt-4 text-2xl font-bold tracking-tight">Check your email</h1>` → `<h2 …>` in `#checkEmailView`. The visible "Create your account" remains `<h1>`.

### (e) Small-text brand links → `text-primary-strong`

| File | Links updated |
|---|---|
| `pricing.html` | Active "Pricing" nav link (desktop + mobile) |
| `contact.html` | Active "Contact" nav link (desktop + mobile); `info@loomlance.com` email link |
| `privacy.html` | 3 inline body links: 2× `info@loomlance.com`, 1× "contact page" |
| `terms.html` | 3 inline body links: 1× "Privacy Policy", 1× `info@loomlance.com`, 1× "contact page" |
| `signup.html` | "Terms of Service" link, "Privacy Policy" link, "Sign in" link, "Resend code" button |

The `"Lance"` wordmark in nav/footer (`text-primary` / `text-accent` on large bold text) was **not changed**. Button classes (`btn-primary`) were **not changed**. Only small body/nav-sized link text was updated.

---

## Notes / False Positives from Design Hook

The `impeccable` design hook flagged two pre-existing findings on every marketing page:

- **`design-system-font: Bricolage Grotesque`** — Intentional brand choice. `input.css` already declares `h1, h2 { font-family: 'Bricolage Grotesque', ... }` as the display face. Not a regression from this pass.
- **`single-font`** — False positive; both Bricolage Grotesque (display) and Outfit (body) are wired up. The hook is reading the font-link tag rather than the split CSS declarations.
- **`numbered-section-markers` on `terms.html`** — Pre-existing legal section numbering (1. The service, 2. Your account…); required by legal document convention.

None of these were introduced by this session; all predate the AAA pass.

---

## Verification Summary

- `npm run build:css` succeeded
- All 6 new hex values confirmed in compiled `app.css`
- `primary-strong` utility class confirmed in compiled `app.css`
- Nav headers: 5 pages now solid (`bg-bg-elevated`, no `/80` or `backdrop-blur`)
- `<main>` landmarks: present on all 5 marketing pages; auth pages unchanged
- Logo alt text: `""` on all 6 affected pages; wordmark text provides the name
- `signup.html`: single `<h1>` ("Create your account"); "Check your email" is now `<h2>`
- Brand links: `text-primary-strong` applied to all small-text link targets; wordmark and buttons untouched
