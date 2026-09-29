import type { APIRoute } from 'astro';
import { getPublicContent } from '../utils/public-content';

/** Build-time search index. Drafts are excluded by getPublicContent(). */
export const GET: APIRoute = async () => {
  const records = await getPublicContent();
  const index = records.map(({ collection, title, description, pubDate, tags, url, body }) => ({
    collection,
    title,
    description,
    pubDate: pubDate.toISOString(),
    tags,
    url,
    body,
  }));

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
