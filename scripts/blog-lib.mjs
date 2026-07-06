// Template library for the LoomLance blog generator.
// Pure functions only — no filesystem/network I/O here. `scripts/build-blog.mjs`
// (Task 11) imports these to write blog.html, blog/<slug>.html, blog/feed.xml,
// and sitemap.xml from the Supabase `posts` table.
import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

export const SITE_URL = 'https://loomlance.com'

export const CATEGORY_LABEL = {
  release: 'Feature release',
  update: 'Product update',
  press: 'Press',
}

// Subtle, AA-contrast chip styling per category. Release gets a primary tint;
// update/press stay neutral (press is differentiated by the ↗ affordance on
// its link-out, not by chip color).
const CATEGORY_CHIP_CLASS = {
  release: 'bg-primary/10 text-primary',
  update: 'bg-bg-muted text-fg-muted border border-border',
  press: 'bg-bg-muted text-fg-muted border border-border',
}

export function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export function escapeXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

export function renderMarkdown(md) {
  // Deliberate relaxation: `a` may carry target/rel as authored (no forced
  // rel="noopener") because post authors are trusted (admin-only CMS).
  return sanitizeHtml(marked.parse(md ?? ''), {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt'],
      a: ['href', 'rel', 'target'],
    },
  })
}

export function postHref(post) {
  return post.external_url || `${SITE_URL}/blog/${post.slug}`
}

export function isExternal(post) {
  return Boolean(post.external_url)
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
}

function categoryChip(category) {
  const cls = CATEGORY_CHIP_CLASS[category] || CATEGORY_CHIP_CLASS.update
  const label = CATEGORY_LABEL[category] || category
  return `<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}">${escapeHtml(label)}</span>`
}

// pageShell — the site's exact head/header/nav/mobile-menu/footer/scripts,
// copied from index.html and pricing.html, parameterized for the blog pages.
// "Blog" is added to the nav (and reads active, via the same
// `text-primary-strong` treatment the site already uses for the current page,
// e.g. `pricing.html`'s "Pricing" link) and to the footer's Product column.
export function pageShell({ title, description, canonical, ogImage, ogType, bodyHtml }) {
  const safeTitle = escapeHtml(title)
  const safeDescription = escapeHtml(description)
  // Escape URL-ish values too: pageShell defends its own attribute contexts
  // rather than trusting callers to pre-escape canonical/og:image.
  const safeCanonical = escapeHtml(canonical)
  const safeImage = escapeHtml(ogImage || `${SITE_URL}/logo-1024.png`)
  const type = ogType || 'website'

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-DPWEBECZBQ"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-DPWEBECZBQ');
    </script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${safeTitle} — LoomLance</title>
    <meta name="description" content="${safeDescription}">
    <link rel="canonical" href="${safeCanonical}">

    <!-- Open Graph / Twitter -->
    <meta property="og:type" content="${type}">
    <meta property="og:url" content="${safeCanonical}">
    <meta property="og:title" content="${safeTitle}">
    <meta property="og:description" content="${safeDescription}">
    <meta property="og:image" content="${safeImage}">
    <meta property="og:site_name" content="LoomLance">
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="${safeTitle}">
    <meta property="twitter:description" content="${safeDescription}">

    <link rel="icon" href="/logo.png">
    <link rel="stylesheet" href="/app.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
</head>
<body class="bg-bg text-fg">

    <!-- Navigation -->
    <header class="sticky top-0 z-50 border-b border-border bg-bg-elevated">
      <nav class="section flex h-16 items-center justify-between">
        <a href="/" class="flex items-center gap-2">
          <img src="/logo.png" alt="" class="size-8">
          <span class="text-lg font-bold tracking-tight"><span class="text-fg">Loom</span><span class="text-primary">Lance</span></span>
        </a>
        <div class="flex items-center gap-1 sm:gap-2">
          <a href="/#features" class="hidden rounded-md px-3 py-2 text-sm font-medium text-fg-muted hover:text-fg sm:block">Features</a>
          <a href="/pricing" class="hidden rounded-md px-3 py-2 text-sm font-medium text-fg-muted hover:text-fg sm:block">Pricing</a>
          <a href="/blog" class="hidden rounded-md px-3 py-2 text-sm font-medium text-primary-strong sm:block">Blog</a>
          <a href="/#about" class="hidden rounded-md px-3 py-2 text-sm font-medium text-fg-muted hover:text-fg sm:block">About</a>
          <a href="/contact" class="hidden rounded-md px-3 py-2 text-sm font-medium text-fg-muted hover:text-fg sm:block">Contact</a>
          <a href="/signin" class="hidden rounded-md px-3 py-2 text-sm font-medium text-fg-muted hover:text-fg sm:block">Sign in</a>
          <a href="/signup" class="btn-primary">Get started</a>
          <button id="menuBtn" type="button" aria-label="Open menu" aria-controls="mobileMenu" aria-expanded="false" class="grid size-10 place-items-center rounded-md text-fg-muted transition-colors hover:bg-bg-muted hover:text-fg sm:hidden">
            <svg id="menuIcon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            <svg id="closeIcon" class="hidden" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
      </nav>

      <!-- Mobile menu -->
      <div id="mobileMenu" class="hidden border-t border-border bg-bg-elevated sm:hidden">
        <nav class="section flex flex-col py-2">
          <a href="/#features" class="rounded-md px-3 py-3 text-sm font-medium text-fg-muted hover:bg-bg-muted hover:text-fg">Features</a>
          <a href="/pricing" class="rounded-md px-3 py-3 text-sm font-medium text-fg-muted hover:bg-bg-muted hover:text-fg">Pricing</a>
          <a href="/blog" class="rounded-md px-3 py-3 text-sm font-medium text-primary-strong">Blog</a>
          <a href="/#about" class="rounded-md px-3 py-3 text-sm font-medium text-fg-muted hover:bg-bg-muted hover:text-fg">About</a>
          <a href="/contact" class="rounded-md px-3 py-3 text-sm font-medium text-fg-muted hover:bg-bg-muted hover:text-fg">Contact</a>
          <a href="/signin" class="rounded-md px-3 py-3 text-sm font-medium text-fg-muted hover:bg-bg-muted hover:text-fg">Sign in</a>
          <a href="/signup" class="btn-primary mt-2">Get started</a>
        </nav>
      </div>
    </header>

    <main>
${bodyHtml}
    </main>

    <!-- Footer (dark) -->
    <footer class="bg-[#070A0F] text-white/70">
      <div class="section grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div class="text-lg font-bold tracking-tight text-white">Loom<span class="text-accent">Lance</span></div>
          <p class="mt-2 text-sm text-white/50">Weave it all together.</p>
        </div>
        <div>
          <h4 class="text-sm font-semibold text-white">Product</h4>
          <ul class="mt-3 space-y-2 text-sm">
            <li><a href="/#features" class="hover:text-white">Features</a></li>
            <li><a href="/pricing" class="hover:text-white">Pricing</a></li>
            <li><a href="/blog" class="hover:text-white">Blog</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-sm font-semibold text-white">Company</h4>
          <ul class="mt-3 space-y-2 text-sm">
            <li><a href="/#about" class="hover:text-white">About</a></li>
            <li><a href="/contact" class="hover:text-white">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-sm font-semibold text-white">Get started</h4>
          <ul class="mt-3 space-y-2 text-sm">
            <li><a href="/signup" class="hover:text-white">Create account</a></li>
            <li><a href="/signin" class="hover:text-white">Sign in</a></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-white/10">
        <div class="section flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/40 sm:flex-row">
          <span>© 2026 LoomLance. All rights reserved.</span>
          <span class="flex gap-4">
            <a href="/terms" class="hover:text-white/70">Terms</a>
            <a href="/privacy" class="hover:text-white/70">Privacy</a>
          </span>
        </div>
      </div>
    </footer>

    <script>
      window.addEventListener('load', function () {
        if (typeof lucide !== 'undefined') lucide.createIcons()
      })
    </script>
    <script>
      // Mobile navigation menu toggle
      (function () {
        var btn = document.getElementById('menuBtn')
        var menu = document.getElementById('mobileMenu')
        if (!btn || !menu) return
        var menuIcon = document.getElementById('menuIcon')
        var closeIcon = document.getElementById('closeIcon')
        function setOpen(open) {
          menu.classList.toggle('hidden', !open)
          btn.setAttribute('aria-expanded', open ? 'true' : 'false')
          btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
          if (menuIcon) menuIcon.classList.toggle('hidden', open)
          if (closeIcon) closeIcon.classList.toggle('hidden', !open)
        }
        btn.addEventListener('click', function () { setOpen(menu.classList.contains('hidden')) })
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false) })
        menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setOpen(false) }) })
      })()
    </script>
</body>
</html>
`
}

function postRowHtml(post) {
  // postHref output lands in href="..." attributes — escape it for that context.
  const href = escapeHtml(postHref(post))
  const external = isExternal(post)
  const linkAttrs = external ? ' target="_blank" rel="noopener"' : ''
  const titleSafe = escapeHtml(post.title)
  const excerptSafe = escapeHtml(post.excerpt || '')
  const dateHtml = `<time datetime="${escapeHtml(post.published_at)}">${formatDate(post.published_at)}</time>`
  const arrow = external
    ? ' <i data-lucide="arrow-up-right" class="inline size-4 align-[-2px]" aria-hidden="true"></i><span class="sr-only"> (opens in a new tab)</span>'
    : ''
  const cover = post.cover_image_url
    ? `<a href="${href}"${linkAttrs} class="block shrink-0 overflow-hidden rounded-lg border border-border sm:w-48">
        <img src="${escapeHtml(post.cover_image_url)}" alt="${titleSafe}" class="aspect-video w-full object-cover">
      </a>`
    : ''

  return `      <article class="flex flex-col gap-4 py-8 sm:flex-row sm:items-start">
        ${cover}
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-3 text-sm text-fg-muted">
            ${categoryChip(post.category)}
            ${dateHtml}
          </div>
          <h2 class="mt-2 text-xl font-semibold">
            <a href="${href}"${linkAttrs} class="hover:text-primary">${titleSafe}${arrow}</a>
          </h2>
          <p class="mt-2 text-fg-muted">${excerptSafe}</p>
        </div>
      </article>`
}

// renderIndexPage(posts) — the /blog listing: PageHeader-style H1 "Blog",
// posts listed newest-first exactly as given, each row showing a category
// chip, formatted date, a title link (via postHref — external posts open in
// a new tab with the ↗ affordance; internal ones are plain), an excerpt, and
// an optional cover thumbnail.
export function renderIndexPage(posts) {
  const rows = posts.map(postRowHtml).join('\n')
  const bodyHtml = `    <section class="section py-16 lg:py-20">
      <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Blog</h1>
      <p class="mt-3 max-w-2xl text-lg text-fg-muted">Feature releases, product updates, and press — straight from the team building LoomLance.</p>
      <div class="mt-10 divide-y divide-border border-t border-border">
${rows}
      </div>
    </section>`

  return pageShell({
    title: 'Blog',
    description: 'Feature releases, product updates, and press from the LoomLance team.',
    canonical: `${SITE_URL}/blog`,
    ogType: 'website',
    bodyHtml,
  })
}

// renderPostPage(post) — a single article page: category chip + date, H1
// title, cover image (if present), the sanitized markdown body inside
// `<article class="prose ...">`, and a "← All posts" link back to /blog.
export function renderPostPage(post) {
  const titleSafe = escapeHtml(post.title)
  const dateHtml = `<time datetime="${escapeHtml(post.published_at)}">${formatDate(post.published_at)}</time>`
  const cover = post.cover_image_url
    ? `<img src="${escapeHtml(post.cover_image_url)}" alt="${titleSafe}" class="mt-8 w-full rounded-xl border border-border object-cover">`
    : ''

  const bodyHtml = `    <div class="section max-w-3xl py-16 lg:py-20">
      <a href="/blog" class="inline-flex items-center gap-1 text-sm font-medium text-fg-muted hover:text-fg">&larr; All posts</a>
      <header class="mt-6">
        <div class="flex flex-wrap items-center gap-3 text-sm text-fg-muted">
          ${categoryChip(post.category)}
          ${dateHtml}
        </div>
        <h1 class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">${titleSafe}</h1>
      </header>
      ${cover}
      <article class="prose prose-neutral mt-8 max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-lg">
${renderMarkdown(post.body_md)}
      </article>
      <a href="/blog" class="mt-10 inline-flex items-center gap-1 text-sm font-medium text-fg-muted hover:text-fg">&larr; All posts</a>
    </div>`

  return pageShell({
    title: post.title,
    description: post.excerpt || '',
    canonical: postHref(post),
    ogImage: post.cover_image_url || undefined,
    ogType: 'article',
    bodyHtml,
  })
}

// renderRss(posts) — RSS 2.0 feed. Channel title "LoomLance Blog", channel
// link SITE_URL + /blog, one <item> per post with title, link (postHref),
// pubDate (toUTCString), description (escaped excerpt), and a guid.
export function renderRss(posts) {
  const items = posts
    .map((post) => {
      const link = postHref(post)
      const pubDate = new Date(post.published_at).toUTCString()
      const isPermaLink = !isExternal(post)
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.excerpt || '')}</description>
      <guid isPermaLink="${isPermaLink}">${escapeXml(link)}</guid>
    </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>LoomLance Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Feature releases, product updates, and press from the LoomLance team.</description>
${items}
  </channel>
</rss>
`
}

const STATIC_PAGES = ['/', '/pricing', '/contact', '/signin', '/signup', '/terms', '/privacy', '/blog']

// renderSitemap(posts) — urlset with the site's static pages plus one <url>
// per internal (non-external_url) post.
export function renderSitemap(posts) {
  const staticUrls = STATIC_PAGES.map((path) => `  <url>
    <loc>${escapeXml(SITE_URL + path)}</loc>
  </url>`)

  const postUrls = posts
    .filter((post) => !isExternal(post))
    .map((post) => {
      const lastmod = new Date(post.published_at).toISOString().slice(0, 10)
      return `  <url>
    <loc>${escapeXml(postHref(post))}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`
    })

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...postUrls].join('\n')}
</urlset>
`
}
