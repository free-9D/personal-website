import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getPublicContent, taxonomySlug } from '../utils/public-content';

export const prerender = true;

const escapeXml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

export const GET: APIRoute = async () => {
  const site = import.meta.env.SITE;
  if (!site) throw new Error('Astro site must be configured to generate the sitemap.');
  const [content, vlogs, updates] = await Promise.all([
    getPublicContent(),
    getCollection('vlogs', ({ data }) => !data.draft),
    getCollection('updates', ({ data }) => !data.draft),
  ]);
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  const routes = new Set([
    base,
    `${base}about/`,
    `${base}notes/`,
    `${base}thoughts/`,
    `${base}projects/`,
    `${base}vlogs/`,
    `${base}updates/`,
    `${base}tags/`,
    `${base}series/`,
    ...content.map(({ url }) => url),
    ...vlogs.map(({ id }) => `${base}vlogs/${id}/`),
    ...updates.map(({ id }) => `${base}updates/${id}/`),
    ...[...new Set(content.flatMap(({ tags }) => tags))].map((tag) => `${base}tags/${taxonomySlug(tag)}/`),
    ...[...new Set(content.flatMap(({ series }) => series ? [series] : []))].map((series) => `${base}series/${taxonomySlug(series)}/`),
  ]);
  const urls = [...routes]
    .map((route) => new URL(route, site).href)
    .sort((a, b) => a.localeCompare(b));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`).join('\n')}\n</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
