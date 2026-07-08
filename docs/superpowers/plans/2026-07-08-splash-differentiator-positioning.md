# Splash Positioning Implementation Plan

> Small, single-file copy/layout change. One task, verified by CSS build + screenshots.

**Goal:** Re-sequence the splash hero + features so the GitHub differentiator leads, the verified KrispiTech quote proves it, and a no-card CTA de-risks signup.

**Spec:** `docs/superpowers/specs/2026-07-08-splash-differentiator-positioning-design.md`

## Global Constraints

- Repo: `C:\Users\mahmo\Desktop\LoomLance-Splash`, file `index.html` only. Branch `feat/splash-positioning` (already checked out). Do NOT push.
- Static HTML + Tailwind (utility classes only — no new CSS). Icons via lucide `data-lucide` (already wired).
- Truthfulness: KrispiTech quote verbatim + attributed; GitHub copy phrased through projects (never "repos → invoices").
- Verify with `npm run build:css` then screenshots at 1440 + mobile; nothing wraps/overflows; hero above the fold.

---

### Task 1: Hero + testimonial + GitHub card + closing CTA

**File:** `index.html`

- [ ] **Step 1: Hero badge** (line ~69) — change text `Built for freelance developers` → `Now with GitHub integration` (keep the `<span class="size-1.5 rounded-full bg-accent">` dot and wrapper).

- [ ] **Step 2: Hero subhead** (lines ~74–76) — replace the `<p>` body with:
```html
          <p class="mt-5 max-w-xl text-lg text-white/70">
            The only freelance platform that connects your GitHub repos and issues to your projects — so time, invoices, and the whole business side live where you already work, and you stay in your IDE.
          </p>
```

- [ ] **Step 3: Hero primary CTA** (line ~78) — change link text `Start free trial` → `Start free — no card` (keep classes/href).

- [ ] **Step 4: Press strip → testimonial** (lines ~150–160) — replace the inner `.section` content with an eyebrow + attributed pull-quote, same dark tokens:
```html
        <div class="section flex flex-col items-center gap-2 py-6 text-center">
          <p class="text-xs font-medium uppercase tracking-wide text-white/45">
            Featured in
            <a href="https://krispitech.com/the-developer-first-freelance-platform-why-loomlance-is-built-differently/" target="_blank" rel="noopener" class="ml-1 inline-flex items-center gap-1 align-baseline font-semibold text-white/80 transition-colors hover:text-accent">
              KrispiTech<i data-lucide="arrow-up-right" class="size-3" aria-hidden="true"></i><span class="sr-only">(opens the article in a new tab)</span>
            </a>
          </p>
          <blockquote class="max-w-2xl text-lg italic leading-relaxed text-white/85">
            &ldquo;No generic freelance fluff. Just a clean interface that handles the business layer so you can stay in your IDE longer.&rdquo;
          </blockquote>
          <p class="text-xs text-white/45">— KrispiTech, <span class="not-italic">The Developer-First Freelance Platform: Why LoomLance Is Built Differently</span></p>
        </div>
```
(Preserve the outer `<div class="relative border-t border-white/10">` wrapper.)

- [ ] **Step 5: GitHub feature card** (features grid, immediately AFTER the flagship "Contracts & invoicing" card `</div>` that closes at ~line 186, BEFORE the `<!-- Online payments -->` card) — insert, matching the existing `.card` markup exactly:
```html
          <!-- GitHub integration (differentiator) -->
          <div class="card lg:col-span-3">
            <div class="flex items-center gap-3">
              <div class="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><i data-lucide="github"></i></div>
              <h3 class="font-semibold">GitHub integration</h3>
            </div>
            <p class="mt-2 text-sm text-fg-muted">Connect your repos to projects and pull GitHub issues straight into your kanban. Smart-commits reference your task keys, so the work you ship links to the work you bill.</p>
          </div>
```

- [ ] **Step 6: Roadmap footnote** (line ~228) — trim the "Just shipped" lead-in now that GitHub has a card:
  `Just shipped: GitHub integration. More on the way: GitLab, scope-creep change requests, and a secure credential vault.`
  → `More on the way: GitLab, scope-creep change requests, and a secure credential vault.`

- [ ] **Step 7: Closing CTA** (line ~263) — change button text `Start your free trial` → `Start free — no card` (keep the supporting line "14-day trial on paid plans · Solo is free forever" unchanged).

- [ ] **Step 8: Build** — `npm run build:css` succeeds (regenerates `app.css`).

- [ ] **Step 9: Verify visually** — serve/open `index.html` (or headless screenshot) at 1440 and ~390px:
  - Hero: badge reads "Now with GitHub integration", new subhead, CTA "Start free — no card"; fits above the fold, no overflow.
  - Testimonial reads as attributed social proof; KrispiTech link works.
  - GitHub card sits beside the flagship in the bento grid, `github` icon renders.
  - Closing CTA matches.
  Run the Impeccable skill pass on the hero + testimonial (brand register — this is a marketing surface).

- [ ] **Step 10: Commit** (include the regenerated `app.css`):
```bash
git add index.html app.css
git commit -m "feat(splash): lead with GitHub differentiator, KrispiTech testimonial, no-card CTA"
```

---

## Self-review notes

- **Spec coverage:** hero badge/subhead/CTA (S1–3), attributed testimonial with verified quote (S4), GitHub card (S5) + footnote trim (S6), closing CTA consistency (S7), build + visual verify (S8–9). Out-of-scope items (other pages, mockup redraw, signup flow) untouched.
- **Truthfulness:** quote verbatim + linked; GitHub body phrased through projects/kanban/task-keys — no "repos → invoices".
- **Known unknowns:** exact line numbers drift as edits apply — anchor on the surrounding markup shown, not the numbers; the flagship card's closing `</div>` (it has a nested `<ul>`, so it closes later than a simple card — insert the GitHub card after the flagship's outer `</div>`, before `<!-- Online payments -->`).
