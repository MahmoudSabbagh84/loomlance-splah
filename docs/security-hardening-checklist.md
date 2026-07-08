# Security Hardening Checklist (AWS Amplify)

From the 2026-06-30 technical audit. **Hosting is AWS Amplify** (Amplify provisions the CloudFront
distribution the audit observed, but you configure it through Amplify — not the CloudFront console,
and not the name-only "add header" form). No secrets were leaking; this is pure hardening.

Two Amplify apps are in scope:
- **loomlance.com** (marketing) — lower stakes.
- **app.loomlance.com** (dashboard SPA) — **higher priority**: authenticated + payment data lives here.

---

## 1. The five always-safe headers — DONE in repo (`customHttp.yml`)

Amplify applies a `customHttp.yml` at the deploy root automatically. Committed:
- Dashboard: `public/customHttp.yml` (Vite copies `public/` → `dist/`, the Amplify artifact root).
- Splash: `customHttp.yml` at repo root.

Headers set (these **never break a working app**): `Strict-Transport-Security`, `X-Content-Type-Options`,
`X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`.

**After the next Amplify deploy, verify:**
```bash
curl -sI https://app.loomlance.com/ | grep -iE 'strict-transport|x-frame|x-content-type|referrer-policy|permissions-policy'
curl -sI https://loomlance.com/     | grep -iE 'strict-transport|x-frame|x-content-type|referrer-policy|permissions-policy'
```
All five should appear.

**If they DON'T appear** (some Amplify apps don't auto-read the file): paste this into the Amplify
console instead — **App settings → Custom headers** (a single YAML text box; this is the right screen,
not the per-header form):
```yaml
customHeaders:
  - pattern: '**'
    headers:
      - key: 'Strict-Transport-Security'
        value: 'max-age=63072000; includeSubDomains; preload'
      - key: 'X-Content-Type-Options'
        value: 'nosniff'
      - key: 'X-Frame-Options'
        value: 'DENY'
      - key: 'Referrer-Policy'
        value: 'strict-origin-when-cross-origin'
      - key: 'Permissions-Policy'
        value: 'camera=(), microphone=(), geolocation=()'
```
Do it for **both** Amplify apps. (Don't set both the file AND the console block — pick one per app.)

---

## 2. Content-Security-Policy — the careful one, NOT auto-shipped

CSP is deliberately excluded from `customHttp.yml`: a missing source silently breaks Stripe/Supabase
calls. Introduce it **Report-Only first**, watch the browser console for a day, add anything real it
flags, then rename the header to enforce.

Add via the console YAML box (append a `Content-Security-Policy-Report-Only` key), per app:

**loomlance.com** (gtag/analytics, Google Fonts, unpkg — note lucide is now pinned + SRI'd):
```
default-src 'self'; script-src 'self' https://www.googletagmanager.com https://unpkg.com 'unsafe-inline'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com; frame-ancestors 'none'; base-uri 'self'
```

**app.loomlance.com** (Supabase + Stripe — confirm exact hosts in the Network tab against Report-Only violations before enforcing):
```
default-src 'self'; script-src 'self' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://zbipqfsqxnvrzhpdjvvy.supabase.co https://api.stripe.com; frame-src https://js.stripe.com https://hooks.stripe.com; frame-ancestors 'none'; base-uri 'self'
```
Once violations are clean, rename `Content-Security-Policy-Report-Only` → `Content-Security-Policy`.

---

## 3. `/.well-known/security.txt`

- Splash: committed to this repo, deploys with the site. Verify: `curl -s https://loomlance.com/.well-known/security.txt`.
- App: add the same file to the dashboard's `public/` so it deploys to the app domain too.

---

## Out of scope (flag for later)

Before real payment volume, commission an **active** security review of the authenticated dashboard
(auth flows, RLS coverage, the Stripe webhook surface) — beyond a passive headers pass.
