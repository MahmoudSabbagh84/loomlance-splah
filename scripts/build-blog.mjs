// scripts/build-blog.mjs — regenerates ALL blog output from the DB. Idempotent.
// Usage: SUPABASE_URL=... SUPABASE_ANON_KEY=... node scripts/build-blog.mjs
import { mkdir, writeFile, readdir, unlink } from 'node:fs/promises'
import { renderIndexPage, renderPostPage, renderRss, renderSitemap, isExternal } from './blog-lib.mjs'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_ANON_KEY
if (!url || !key) { console.error('Missing SUPABASE_URL / SUPABASE_ANON_KEY'); process.exit(1) }

const res = await fetch(
  `${url}/rest/v1/posts?select=slug,title,excerpt,body_md,cover_image_url,category,external_url,published_at&status=eq.published&order=published_at.desc`,
  { headers: { apikey: key, Authorization: `Bearer ${key}` } },
)
if (!res.ok) { console.error(`Fetch failed: ${res.status} ${await res.text()}`); process.exit(1) }
const posts = await res.json()

await mkdir('blog', { recursive: true })

// Remove stale post pages (unpublished/deleted posts disappear on the next run)
const internal = posts.filter((p) => !isExternal(p))
const keep = new Set(internal.map((p) => `${p.slug}.html`))
for (const f of await readdir('blog')) {
  if (f.endsWith('.html') && !keep.has(f)) await unlink(`blog/${f}`)
}

// Guard against one bad row taking down the whole build. Reviewer note from
// Task 10: templates aren't defensive about `published_at` — formatDate()
// (used by the index/RSS/post-page date labels) tolerates an invalid date by
// rendering the string "Invalid Date", but renderSitemap()'s <lastmod> calls
// `.toISOString()`, which *throws* a RangeError on an unparseable date. Since
// renderSitemap/renderPostPage operate over an array or a single post with no
// per-post error boundary of their own, we filter/try at this layer instead:
// an unparseable published_at on one post is logged and that post is skipped
// from the affected output(s), rather than aborting the entire build.
function hasParseableDate(post) {
  return !Number.isNaN(new Date(post.published_at).getTime())
}

let pageCount = 0
for (const p of internal) {
  try {
    await writeFile(`blog/${p.slug}.html`, renderPostPage(p))
    pageCount++
  } catch (err) {
    console.error(`Skipping post page "${p.slug}": ${err.message}`)
  }
}

const sitemapPosts = posts.filter((p) => {
  if (isExternal(p) || hasParseableDate(p)) return true
  console.error(`Skipping "${p.slug}" from sitemap: unparseable published_at "${p.published_at}"`)
  return false
})

await writeFile('blog.html', renderIndexPage(posts))
await writeFile('blog/feed.xml', renderRss(posts))
await writeFile('sitemap.xml', renderSitemap(sitemapPosts))

console.log(`Generated: blog.html, ${pageCount} post page(s), blog/feed.xml, sitemap.xml (${posts.length} published post(s))`)
