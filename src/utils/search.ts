export interface SearchRecord {
  collection: 'notes' | 'thoughts' | 'projects';
  title: string;
  description: string;
  pubDate: string;
  tags: string[];
  url: string;
  body: string;
}

export interface SearchResult {
  record: SearchRecord;
  score: number;
}

const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase().replace(/[\s\p{P}\p{S}]+/gu, '');

/** Rank public content by title, tags, summary, then body matches. */
export function searchContent(records: SearchRecord[], query: string): SearchResult[] {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];

  return records.flatMap((record) => {
    const title = normalize(record.title);
    const description = normalize(record.description);
    const tags = normalize(record.tags.join(' '));
    const body = normalize(record.body);
    let score = 0;
    if (title.includes(normalizedQuery)) score += 12;
    if (tags.includes(normalizedQuery)) score += 8;
    if (description.includes(normalizedQuery)) score += 5;
    if (body.includes(normalizedQuery)) score += 1;
    return score ? [{ record, score }] : [];
  }).sort((a, b) => b.score - a.score || b.record.pubDate.localeCompare(a.record.pubDate));
}
