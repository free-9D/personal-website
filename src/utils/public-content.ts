import { getCollection } from 'astro:content';

export type PublicCollection = 'notes' | 'thoughts' | 'projects';

/** Stable, content-collection-independent representation for public content consumers. */
export interface PublicContentRecord {
  collection: PublicCollection;
  id: string;
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  tags: string[];
  series?: string;
  seriesTitle?: string;
  seriesOrder?: number;
  /** Public route including Astro's configured base path, e.g. /personal-website/notes/foo/. */
  url: string;
  /** Raw Markdown/MDX source, suitable for search indexing. */
  body: string;
}

const publicUrl = (collection: PublicCollection, id: string) => {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  return `${base}${collection}/${id}/`;
};

/** Return all non-draft entries as a flat, stable API for taxonomy, search, feeds and SEO. */
export async function getPublicContent(): Promise<PublicContentRecord[]> {
  const [notes, thoughts, projects] = await Promise.all([
    getCollection('notes', ({ data }) => !data.draft),
    getCollection('thoughts', ({ data }) => !data.draft),
    getCollection('projects', ({ data }) => !data.draft),
  ]);

  const records: PublicContentRecord[] = [
    ...notes.map((entry) => ({
      collection: 'notes' as const, id: entry.id, title: entry.data.title,
      description: entry.data.description, pubDate: entry.data.pubDate, updatedDate: entry.data.updatedDate,
      tags: entry.data.tags, series: entry.data.series, seriesTitle: entry.data.seriesTitle,
      seriesOrder: entry.data.seriesOrder, url: publicUrl('notes', entry.id), body: entry.body ?? '',
    })),
    ...thoughts.map((entry) => ({
      collection: 'thoughts' as const, id: entry.id, title: entry.data.title,
      description: entry.data.description, pubDate: entry.data.pubDate, updatedDate: entry.data.updatedDate,
      tags: entry.data.tags, series: entry.data.series, seriesTitle: entry.data.seriesTitle,
      seriesOrder: entry.data.seriesOrder, url: publicUrl('thoughts', entry.id), body: entry.body ?? '',
    })),
    ...projects.map((entry) => ({
      collection: 'projects' as const, id: entry.id, title: entry.data.title,
      description: entry.data.description, pubDate: entry.data.pubDate, updatedDate: entry.data.updatedDate,
      tags: entry.data.tags, series: entry.data.series, seriesTitle: entry.data.seriesTitle,
      seriesOrder: entry.data.seriesOrder, url: publicUrl('projects', entry.id), body: entry.body ?? '',
    })),
  ];

  return records.sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf() || a.title.localeCompare(b.title, 'zh-CN'));
}

/** URL-safe, deterministic taxonomy segment while keeping readable Unicode labels. */
export function taxonomySlug(value: string): string {
  return value.trim().normalize('NFC').split('').map((character) => {
    return /[\p{L}\p{N}_-]/u.test(character) ? character : `~${character.codePointAt(0)?.toString(16)}~`;
  }).join('');
}

export const publicCollectionLabel = (collection: PublicCollection) => ({
  notes: '笔记', thoughts: '思考', projects: '项目',
})[collection];
