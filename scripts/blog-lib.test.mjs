import test from 'node:test'
import assert from 'node:assert/strict'
import { renderMarkdown, postHref, renderIndexPage, renderPostPage, renderRss, escapeXml } from './blog-lib.mjs'

const post = {
  slug: 'github-integration', title: 'GitHub Integration Is Here', excerpt: 'Link repos to projects.',
  body_md: '# Hi\n\n**bold** and <script>alert(1)</script>', cover_image_url: null,
  category: 'release', external_url: null, published_at: '2026-07-06T12:00:00Z',
}
const pressPost = { ...post, slug: 'krispitech', title: 'KrispiTech on LoomLance', category: 'press', external_url: 'https://krispitech.com/x' }

test('renderMarkdown strips scripts, keeps formatting', () => {
  const html = renderMarkdown(post.body_md)
  assert.match(html, /<strong>bold<\/strong>/)
  assert.doesNotMatch(html, /<script/)
})

test('postHref: internal vs link-out', () => {
  assert.equal(postHref(post), 'https://loomlance.com/blog/github-integration')
  assert.equal(postHref(pressPost), 'https://krispitech.com/x')
})

test('index lists posts; press link-outs open externally', () => {
  const html = renderIndexPage([post, pressPost])
  assert.match(html, /GitHub Integration Is Here/)
  assert.match(html, /href="https:\/\/krispitech\.com\/x"[^>]*target="_blank"/)
})

test('post page has SEO tags', () => {
  const html = renderPostPage(post)
  assert.match(html, /<title>GitHub Integration Is Here — LoomLance<\/title>/)
  assert.match(html, /<meta name="description" content="Link repos to projects\."/)
  assert.match(html, /property="og:title"/)
  assert.match(html, /rel="canonical" href="https:\/\/loomlance\.com\/blog\/github-integration"/)
})

test('rss is valid-ish and escapes', () => {
  const xml = renderRss([{ ...post, title: 'A & B' }])
  assert.match(xml, /<rss version="2.0"/)
  assert.match(xml, /A &amp; B/)
})

test('escapeXml', () => {
  assert.equal(escapeXml('<a>&"\''), '&lt;a&gt;&amp;&quot;&apos;')
})

// --- Attribute-context XSS regressions (hostile URL/title fields) ---

const hostilePost = {
  slug: 'x', title: 'A "quoted" title', excerpt: 'Safe excerpt.',
  body_md: 'Body.', cover_image_url: 'https://x.com/a.png" onerror="alert(2)',
  category: 'release', external_url: 'https://evil.com/x" onmouseover="alert(1)',
  published_at: '2026-07-06T12:00:00Z',
}
const hostileInternalPost = { ...hostilePost, external_url: null }

test('index page escapes hostile URLs/titles in attribute context', () => {
  const html = renderIndexPage([hostilePost])
  assert.doesNotMatch(html, /" onmouseover=/)
  assert.doesNotMatch(html, /" onerror=/)
  // escaped URLs still land inside their attributes
  assert.match(html, /href="https:\/\/evil\.com\/x&quot; onmouseover=&quot;alert\(1\)"/)
  assert.match(html, /src="https:\/\/x\.com\/a\.png&quot; onerror=&quot;alert\(2\)"/)
})

test('post page escapes hostile canonical/og:image/title in attribute context', () => {
  const html = renderPostPage(hostileInternalPost)
  assert.doesNotMatch(html, /" onmouseover=/)
  assert.doesNotMatch(html, /" onerror=/)
  assert.match(html, /rel="canonical" href="https:\/\/loomlance\.com\/blog\/x"/)
  assert.match(html, /property="og:image" content="https:\/\/x\.com\/a\.png&quot; onerror=&quot;alert\(2\)"/)
  assert.match(html, /A &quot;quoted&quot; title/)
})

test('post page with hostile external canonical escapes it', () => {
  const html = renderPostPage(hostilePost)
  assert.doesNotMatch(html, /" onmouseover=/)
  assert.match(html, /rel="canonical" href="https:\/\/evil\.com\/x&quot; onmouseover=&quot;alert\(1\)"/)
})
