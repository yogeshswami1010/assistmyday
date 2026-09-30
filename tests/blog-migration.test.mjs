import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';
const source = await readFile(new URL('../lib/blog-migration.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { legacyBlogSlugs, migratedHref, migrateBlogHtml } = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'));
const articles = JSON.parse(await readFile(new URL('../data/imported-blog-articles.json', import.meta.url), 'utf8'));
const target = '/services/websites-ecommerce';
test('every imported article has matching direct legacy paths', () => {
  assert.equal(new Set(legacyBlogSlugs).size, articles.length);
  for (const article of articles) {
    assert.ok(legacyBlogSlugs.includes(article.slug));
    for (const ending of ['', '/']) assert.equal(migratedHref(`/${article.slug}${ending}`), `/blog/${article.slug}`);
  }
});
test('internal link normalization preserves queries and fragments and leaves other sites alone', () => {
  const slug = legacyBlogSlugs[0];
  assert.equal(migratedHref(`https://www.assistmyday.com/${slug}/?ref=blog#cost`), `/blog/${slug}?ref=blog#cost`);
  assert.equal(migratedHref(`https://example.com/${slug}/`), `https://example.com/${slug}/`);
  assert.equal(migratedHref('/unrelated/'), '/unrelated/');
  assert.equal(migratedHref(`/blog/${slug}`), `/blog/${slug}`);
  assert.equal(migratedHref('mailto:info@assistmyday.com'), 'mailto:info@assistmyday.com');
});
test('targeted articles get one contextual link, including database-only content', () => {
  const slugs = ['how-to-choose-the-best-website-designing-company-in-niagara-falls', 'cost-breakdown-of-website-and-app-development-in-st-catharines', 'how-to-choose-the-right-company-for-website-and-app-development-in-st-catharines', 'the-best-web-design-websites-in-the-niagara-falls-region-what-makes-them-stand-out'];
  for (const slug of slugs) {
    const original = articles.find(a => a.slug === slug)?.contentHtml ?? '<p>Introduction.</p><p>Assist My Day designs business websites.</p><p>Next topic.</p>';
    const result = migrateBlogHtml(original, slug);
    assert.equal((result.match(/href="\/services\/websites-ecommerce"/g) || []).length, 1);
    assert.equal(migrateBlogHtml(result, slug), result);
    if (!articles.some(a => a.slug === slug)) assert.ok(result.indexOf(target) < result.indexOf('Next topic.'));
  }
  assert.equal(migrateBlogHtml('<p>Unrelated article.</p>', 'other'), '<p>Unrelated article.</p>');
});
