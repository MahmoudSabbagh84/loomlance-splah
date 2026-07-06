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
