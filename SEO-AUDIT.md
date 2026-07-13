# LoomLance SEO Audit & Overhaul Plan

**Site:** https://loomlance.com · **Type:** SaaS (developer-first freelance platform)
**Audited:** 2026-07 · **Baseline Health Score: ~65/100**
**Method:** Source-level review of every page + blog template engine + headers + live probes. (The claude-seo plugin's Python engine isn't runnable on this Windows box — deps uninstalled + `python3` unaliased — so this pass was done by direct source analysis against the same category rubrics.)

---

## Score by category

| Category | Weight | Score | Notes |
|---|---|---|---|
| Technical SEO | 22% | 78 | Solid; pricing missing canonical, unpinned lucide, render-blocking scripts |
| Content Quality / E-E-A-T | 23% | 52 | Thin content (1 internal post), no landing pages, no author authority |
| On-Page SEO | 20% | 68 | Good meta; homepage title + H1 carry no target keywords |
| Schema / Structured Data | 10% | 45 | Only `SoftwareApplication`; no FAQ/Org/WebSite/Article |
| Performance (CWV) | 10% | 80 | Static + minified Tailwind; render-blocking lucide/fonts |
| AI Search / GEO | 10% | 55 | No `llms.txt`, no Article schema, sparse citable content |
| Images | 5% | 85 | Minimal images, mostly CSS/SVG; logo `alt=""` |

**Weighted: ~65/100.**

## What's already strong (do not redo)
- Homepage: unique title/description, canonical, full OG/Twitter, `SoftwareApplication` JSON-LD, GA4.
- Semantic HTML, clean heading hierarchy, sensible internal linking.
- E-E-A-T press signals: KrispiTech feature + PeerPush badge.
- Blog template: canonical, OG/Twitter, `article` og:type, RSS feed, auto sitemap.
- 5 security headers (HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy).
- robots.txt + sitemap.xml (referenced in robots).

---

## Findings

### 🔴 High — quick wins (additive code)
1. **Unpinned `lucide@latest` + no SRI** on `pricing.html` and every blog page (`scripts/blog-lib.mjs` `pageShell`). The homepage was fixed (pinned `@1.23.0` + SRI); the fix regressed elsewhere. Supply-chain + reliability risk (an unpinned CDN already dropped a glyph once).
2. **`pricing.html` missing:** `<link rel=canonical>`, all OG/Twitter tags, and any JSON-LD.
3. **No `FAQPage` schema** — pricing has 6 Q&As ready; eligible for rich results.
4. **No `Organization`, `WebSite`, or `BlogPosting`/`Article` schema** — blog post pages ship zero structured data (hurts article rich results + AI citability).
5. **Render-blocking `lucide` `<script>`** (no `defer`) on all pages → slower LCP/FCP.
6. **No `llms.txt`** (404) — cheap GEO/AI-search guidance file.

### 🟠 High — on-page (brand-sensitive)
7. **Homepage `<title>` + `<h1>` carry no target keywords.** Title "LoomLance — Weave it all together"; H1 "Code. Ship. Get paid. Repeat." Highest-weight on-page elements, zero keywords. **Decision: BLEND** — keyword-bearing H1 + keep the punchy line as a styled tagline; keyword-rich title.

### 🟡 Strategic — growth engine (Phase 2)
8. **Thin content** — 1 internal blog post. SaaS ranks on content depth.
9. **No feature/use-case landing pages** — every feature is a homepage section, so none rank individually. Targets: `/freelance-invoicing`, `/time-tracking-for-developers`, `/github-for-freelancers`, `/freelance-contracts`, `/scope-creep-change-requests` (product).
10. **No comparison / "alternatives" pages** — highest-intent SaaS keywords ("LoomLance vs Bonsai / HoneyBook / Harvest / FreshBooks", "[competitor] alternative for developers"). Use the `/seo-competitor-pages` skill.
11. **Weak blog E-E-A-T** — no author bylines / `Person` authorship / credentials.
12. **Sitemap includes `/signin` + `/signup`** — thin utility pages; consider dropping from sitemap.

---

## Roadmap

### Phase 1 — Quick wins (this session)
- Pin lucide `@1.23.0` + SRI + `defer` on pricing.html and blog template.
- Add canonical + OG/Twitter to pricing.html.
- Add `FAQPage` schema (pricing), `Organization` + `WebSite` (homepage), `BlogPosting` + `BreadcrumbList` + author (blog template).
- Blend homepage title + H1.
- Add `llms.txt`.

### Phase 2 — Content & landing pages (high effort, high return)
- 4–5 feature/use-case landing pages, each targeting a keyword cluster.
- 2–4 comparison / alternatives pages.
- Blog content cadence + author E-E-A-T + `Article` schema (shipped in Phase 1 template).

### Phase 3 — Measurement & iteration
- Wire the Google Search Console MCP (real query data → target "almost page-1" keywords).
- PageSpeed / CrUX Core Web Vitals monitoring; SEO drift baselines before each deploy.

---

## Progress log
- **Phase 1 — ✅ COMPLETE** (this session):
  - Pinned lucide `@1.23.0` + SRI + `defer` on **every** page (pricing, blog template, contact, privacy, signup, terms) — no `@latest` left anywhere.
  - pricing.html: added canonical + full OG/Twitter + `FAQPage` + `BreadcrumbList` schema.
  - Homepage: blended title (`The Freelance Platform Built for Developers`) + keyword H1 with tagline sub-line; added `Organization` + `WebSite` schema.
  - Blog engine (`blog-lib.mjs`): `BlogPosting` + `BreadcrumbList` per post, `Blog` schema on the index, hardened JSON-LD serializer (`jsonLdScript` — escapes `<`/`>`/`&` to prevent `</script>` breakout). Regenerated all blog pages + sitemap.
  - Added `llms.txt`. Rebuilt CSS. All 9 blog-lib tests green; all 7 JSON-LD blocks validate.
  - Schema now on site: SoftwareApplication, Organization, WebSite, FAQPage, Blog, BlogPosting ×3, BreadcrumbList ×4.
- **Phase 2 — next:** feature/use-case landing pages + comparison pages + blog cadence.
- **Phase 3 — next:** wire GSC MCP, CWV monitoring, SEO drift baselines.
