import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';

const COLLECTIONS = ['notes', 'thoughts', 'projects', 'updates', 'vlogs'];
const MULTI_SEGMENT_ROUTES = new Set(['notes', 'thoughts', 'updates']);

function normalizeBase(configText) {
  const match = configText.match(/\bbase\s*:\s*(['"])(.*?)\1/);
  const value = match?.[2]?.trim() || '';
  if (!value || value === '/') return '';
  return `/${value.replace(/^\/+|\/+$/g, '')}`;
}

async function listMarkdownFiles(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
  const results = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) results.push(...await listMarkdownFiles(fullPath));
    else if (entry.isFile() && /\.mdx?$/i.test(entry.name)) results.push(fullPath);
  }
  return results;
}

function parseFrontmatter(source, filePath) {
  const match = source.match(/^\uFEFF?---\s*\r?\n([\s\S]*?)\r?\n---(?:\s*\r?\n|$)/);
  if (!match) return {};
  try {
    const data = parseYaml(match[1]);
    return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
  } catch (error) {
    throw new Error(`Invalid frontmatter in ${filePath}: ${error.message}`, { cause: error });
  }
}

function asStrings(value) {
  if (Array.isArray(value)) return value.filter((item) => typeof item === 'string');
  return typeof value === 'string' ? [value] : [];
}

function idFor(collection, filePath) {
  const relative = path.relative(collection, filePath).split(path.sep).join('/');
  return relative.replace(/\/index\.(?:md|mdx)$/i, '').replace(/\.mdx?$/i, '');
}

function routeFor(type, id) {
  const routeId = MULTI_SEGMENT_ROUTES.has(type) ? id : id.split('/')[0];
  return `/${type}/${routeId.split('/').map((segment) => encodeURIComponent(segment)).join('/')}/`;
}

/** Scan the five Astro content collections and return normalized article records. */
export async function scanContent({ root = process.cwd() } = {}) {
  const contentRoot = path.resolve(root, 'src', 'content');
  let base = '';
  try {
    base = normalizeBase(await readFile(path.resolve(root, 'astro.config.mjs'), 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  const records = [];
  for (const type of COLLECTIONS) {
    const collectionRoot = path.join(contentRoot, type);
    for (const filePath of await listMarkdownFiles(collectionRoot)) {
      const relativePath = path.relative(root, filePath).split(path.sep).join('/');
      const id = idFor(collectionRoot, filePath);
      const data = parseFrontmatter(await readFile(filePath, 'utf8'), relativePath);
      const route = routeFor(type, id);
      records.push({
        type,
        title: typeof data.title === 'string' && data.title.trim() ? data.title.trim() : id.split('/').at(-1),
        description: typeof data.description === 'string' ? data.description : '',
        tags: asStrings(data.tags),
        category: typeof data.category === 'string' ? data.category : '',
        series: typeof data.series === 'string' ? data.series : '',
        draft: data.draft === true,
        id,
        filePath: relativePath,
        urlPath: `${base}${route}` || '/',
      });
    }
  }
  return records;
}

function fuzzyScore(text, query) {
  if (text.includes(query)) return 100 + query.length / Math.max(text.length, 1);

  // Character-order matching makes short Chinese and English queries useful even
  // when separators or a small typo interrupt an exact substring.
  let cursor = 0;
  let gaps = 0;
  for (const character of query) {
    const found = text.indexOf(character, cursor);
    if (found < 0) return 0;
    gaps += found - cursor;
    cursor = found + 1;
  }
  return Math.max(1, 40 - gaps - (text.length - query.length) / 100);
}

/** Filter records by exact taxonomy values and case-insensitive fuzzy search. */
export function filterContent(records, { type, category, tag, series, query } = {}) {
  const needle = typeof query === 'string' ? query.trim().normalize('NFKC').toLocaleLowerCase() : '';
  const matches = records.flatMap((record) => {
    if (type && record.type !== type) return [];
    if (category && record.category.toLocaleLowerCase() !== String(category).toLocaleLowerCase()) return [];
    if (tag && !record.tags.some((item) => item.toLocaleLowerCase() === String(tag).toLocaleLowerCase())) return [];
    if (series && record.series.toLocaleLowerCase() !== String(series).toLocaleLowerCase()) return [];
    if (!needle) return [{ record, score: 0 }];
    const fields = [record.title, record.description, ...record.tags, record.category, record.series, record.id]
      .map((value) => String(value).normalize('NFKC').toLocaleLowerCase());
    const score = Math.max(...fields.map((field) => fuzzyScore(field, needle)));
    return score ? [{ record, score }] : [];
  });
  return matches.sort((a, b) => b.score - a.score || a.record.title.localeCompare(b.record.title, 'zh-CN'))
    .map(({ record }) => record);
}

/** Render collection and nested ID paths as a compact Unicode file tree. */
export function renderTree(records) {
  const grouped = new Map(COLLECTIONS.map((name) => [name, []]));
  for (const record of records) {
    if (grouped.has(record.type)) grouped.get(record.type).push(record);
  }
  const lines = [];
  const collectionNames = [...grouped].filter(([, items]) => items.length);
  collectionNames.forEach(([type, items], collectionIndex) => {
    const lastCollection = collectionIndex === collectionNames.length - 1;
    lines.push(`${lastCollection ? '└──' : '├──'} ${type}/`);
    const root = { children: new Map(), records: [] };
    for (const record of items) {
      const segments = record.id.split('/').filter(Boolean);
      let node = root;
      for (const segment of segments.slice(0, -1)) {
        if (!node.children.has(segment)) node.children.set(segment, { children: new Map(), records: [] });
        node = node.children.get(segment);
      }
      node.records.push({ record, name: segments.at(-1) || record.id });
    }
    const emit = (node, prefix, parentLast = true) => {
      const entries = [
        ...[...node.children].map(([name, child]) => ({ name, child, folder: true })),
        ...node.records.map(({ name, record }) => ({ name: `${name} — ${record.title}${record.draft ? ' [draft]' : ''}`, folder: false })),
      ];
      entries.forEach((entry, index) => {
        const last = index === entries.length - 1;
        lines.push(`${prefix}${last ? '└──' : '├──'} ${entry.name}${entry.folder ? '/' : ''}`);
        if (entry.folder) emit(entry.child, `${prefix}${last ? '    ' : '│   '}`);
      });
    };
    emit(root, lastCollection ? '    ' : '│   ');
  });
  return lines.join('\n');
}
