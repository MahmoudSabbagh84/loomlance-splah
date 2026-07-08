# Splash Positioning — Lead with the Differentiator (Design)

**Status:** Approved 2026-07-08 · **Repo:** LoomLance-Splash (marketing site, loomlance.com) · **File:** `index.html` only

## Summary

Sharpen the splash hero and features section so a cold visitor immediately learns (1) *what makes LoomLance different* — the GitHub/developer-first integration, (2) *that real press validates it* — an attributed KrispiTech pull-quote, and (3) *that trying it costs nothing* — a no-credit-card free CTA. Sequenced **differentiator → proof → frictionless CTA**. All three already exist on the page in weak/buried form; this elevates and re-sequences them. Copy/layout only, no signup-flow or backend change.

## Motivation

Pre-revenue turnkey asset listed for sale (Acquire/Flippa); higher signup conversion and a clearer differentiator strengthen both the traction story and the sale narrative. Also demonstrates positioning judgment (repositioning around the moat, not just tweaking a CTA).

## Truthfulness constraints (a product under due diligence)

- **The KrispiTech quote is real and verified** against the article (`https://krispitech.com/the-developer-first-freelance-platform-why-loomlance-is-built-differently/`). The featured line — *"No generic freelance fluff. Just a clean interface that handles the business layer so you can stay in your IDE longer."* — is verbatim from the piece. Attribution links to the source so it's verifiable.
- **The GitHub claim must not overclaim.** The integration links repos to projects (`project_repos`) and pulls GitHub issues into the kanban (`github_issue_cards`), with smart-commits referencing task keys. Time and invoicing flow *through projects*, not directly from repos. Copy is phrased through projects accordingly — never "links repos to invoices."

## Changes (all in `index.html`)

### 1. Hero — differentiator + de-risked CTA (~lines 68–80)
- **Badge** (68–70): `Built for freelance developers` → `Now with GitHub integration` (keep the accent dot).
- **H1** (72): unchanged — *Code. Ship. Get paid. Repeat.*
- **Subhead** (74–76): replace with a differentiator-led, truthful line:
  > The only freelance platform that connects your GitHub repos and issues to your projects — so time, invoices, and the whole business side live where you already work, and you stay in your IDE.
- **Primary CTA** (78): `Start free trial` → `Start free — no card`. Secondary `See plans` unchanged. (Solo tier is genuinely forever-free, no card — accurate.)
- Hero stats grid (81–94) unchanged (already reinforces Free / 14 days / Anytime).

### 2. Press strip → attributed testimonial (~lines 149–161)
Restructure the thin strip into a credibility-carrying testimonial, same dark tokens, still above the fold:
- Small eyebrow: `FEATURED IN` + the existing `KrispiTech ↗` link (keeps `target="_blank" rel="noopener"` + sr-only affordance).
- The verified pull-quote at larger italic weight, with em-dash attribution to **KrispiTech** and the article title.
- Replaces the current smaller italic tagline line.

### 3. GitHub feature card — differentiator gets a card (~features grid, lines 171+)
The differentiator currently has no card while every commodity feature does. Insert one GitHub `.card` in the prominent top-right slot immediately after the flagship "Contracts & invoicing" card (before "Online payments"), reusing the exact existing card markup:
- Icon `github` (lucide), heading "GitHub integration", body: *Connect your repos to projects and pull GitHub issues straight into your kanban. Smart-commits reference your task keys, so the work you ship links to the work you bill.* (`lg:col-span-3` to sit beside the flagship).
- Keep the existing roadmap footnote (line 228: "More on the way: GitLab, scope-creep…"), trimming its "Just shipped: GitHub integration" lead-in since GitHub now has a card.

### 4. Closing CTA consistency (~lines 258–266)
- CTA band button (263): `Start your free trial` → `Start free — no card`.
- Keep the supporting line "14-day trial on paid plans · Solo is free forever" (it correctly carries the paid-trial nuance).
- Nav / mobile-nav "Get started" buttons (lines 39, 56) unchanged — compact nav buttons don't need the full phrase.

## Verification

- `npm run build:css` (Tailwind) succeeds; new `github` icon renders (lucide already in use).
- Screenshot desktop (1440) + mobile: hero fits above the fold, nothing wraps/overflows, testimonial reads as social proof, GitHub card sits correctly in the bento grid.
- KrispiTech link resolves to the article.

## Out of scope

Other pages (pricing/contact/etc.), the product-preview mockup redraw (showing a GitHub-linked project would be the strongest proof — a larger visual pass for later), signup-flow/pricing/backend changes, and A/B testing infrastructure.
