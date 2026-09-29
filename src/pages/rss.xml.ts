import type { APIRoute } from 'astro';
import { getPublicContent } from '../utils/public-content';

export const prerender = true;

const escapeXml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

export const GET: APIRoute = async () => {
  const site = import.meta.env.SITE;
  if (!site) throw new Error('Astro site must be configured to generate the RSS feed.');
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  const siteRoot = new URL(base, site).href;
  const items = (await getPublicContent())
    .filter(({ collection }) => collection === 'notes' || collection === 'thoughts')
    .map((item) => {
      const url = new URL(item.url, site).href;
      return `    <item>\n      <title>${escapeXml(item.title)}</title>\n      <link>${escapeXml(url)}</link>\n      <guid isPermaLink="true">${escapeXml(url)}</guid>\n      <description>${escapeXml(item.description)}</description>\n      <pubDate>${item.pubDate.toUTCString()}</pubDate>\n      <category>${escapeXml(item.collection)}</category>\n    </item>`;
    }).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>${escapeXml('个人网站 · 笔记与思考')}</title>\n    <link>${escapeXml(siteRoot)}</link>\n    <description>${escapeXml('个人笔记与思考的更新订阅。')}</description>\n    <language>zh-CN</language>\n    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n${items}\n  </channel>\n</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
