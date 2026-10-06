import { mkdir, access, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { stringify } from 'yaml';

const TYPES = [
  ['notes', '笔记'],
  ['thoughts', '思考'],
  ['projects', '项目'],
  ['updates', '更新'],
  ['vlogs', 'Vlog'],
];

async function ask(prompt, message, fallback = '') {
  const answer = await prompt(message, fallback);
  return String(answer ?? '').trim();
}

function makeSlug(value) {
  return value
    .normalize('NFKC')
    .toLocaleLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '') || 'untitled';
}

function parseList(value) {
  return value.split(/[,，]/).map((item) => item.trim()).filter(Boolean);
}

function today() {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai' }).format(new Date());
}

function isIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

/** Create a content entry through a small, prompt-adapter-friendly wizard. */
export async function createArticle({ root, prompt, print }) {
  if (typeof prompt !== 'function' || typeof print !== 'function') {
    throw new TypeError('createArticle requires prompt(message, defaultValue?) and print(string) functions');
  }

  print('选择文章类型：notes / thoughts / projects / updates / vlogs');
  let type;
  while (!type) {
    const answer = (await ask(prompt, `文章类型 (${TYPES.map(([key]) => key).join('/')})`, 'notes')).toLowerCase();
    type = TYPES.find(([key]) => key === answer)?.[0];
    if (!type) print(`不支持的类型“${answer}”，请从 ${TYPES.map(([key]) => key).join(', ')} 中选择。`);
  }

  const title = await ask(prompt, '标题');
  if (!title) throw new Error('标题不能为空，已取消创建。');
  const description = await ask(prompt, '摘要（一句话描述文章内容）', title);
  if (!description) throw new Error('摘要不能为空，已取消创建。');
  const suggestedSlug = makeSlug(title);
  const rawSlug = await ask(prompt, '文章目录名（slug）', suggestedSlug);
  const slug = makeSlug(rawSlug || suggestedSlug);
  const tags = parseList(await ask(prompt, '标签（逗号分隔，可留空）'));
  const draftAnswer = (await ask(prompt, '创建为草稿？(y/n)', 'y')).toLowerCase();
  const draft = ['y', 'yes', '是', 'true', '1'].includes(draftAnswer);

  const metadata = { title, description, pubDate: today(), draft, tags };
  if (['notes', 'thoughts', 'projects'].includes(type)) metadata.related = [];

  if (['notes', 'thoughts', 'updates'].includes(type)) {
    const category = await ask(prompt, '分类（可留空）');
    if (category) metadata.category = category;
  }
  if (['notes', 'thoughts', 'projects'].includes(type)) {
    const series = await ask(prompt, '系列标识（可留空）');
    if (series) {
      metadata.series = makeSlug(series);
      metadata.seriesTitle = series;
    }
  }
  if (type === 'projects') {
    let status = await ask(prompt, '项目状态（进行中 / 已完成 / 暂停）', '进行中');
    while (!['进行中', '已完成', '暂停'].includes(status)) {
      print('状态必须是：进行中、已完成或暂停。');
      status = await ask(prompt, '项目状态（进行中 / 已完成 / 暂停）', '进行中');
    }
    metadata.status = status;
    let startDate = await ask(prompt, '开始日期（YYYY-MM-DD）', today());
    while (!isIsoDate(startDate)) {
      print('请输入有效日期，格式为 YYYY-MM-DD。');
      startDate = await ask(prompt, '开始日期（YYYY-MM-DD）', today());
    }
    metadata.startDate = startDate;
  } else if (type === 'vlogs') {
    metadata.platform = 'bilibili';
    metadata.bvid = await ask(prompt, 'Bilibili BV 号');
    if (!metadata.bvid) throw new Error('Vlog 必须填写 Bilibili BV 号，已取消创建。');
  } else if (type === 'updates') {
    metadata.changes = parseList(await ask(prompt, '变更内容（多项用逗号分隔，可留空）'));
  }

  const folder = path.resolve(root, 'src', 'content', type, slug);
  const file = path.join(folder, 'index.md');
  try {
    await access(file);
    throw new Error(`目标文件已存在：${path.relative(root, file)}`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  const body = type === 'updates'
    ? `## 更新内容\n\n${metadata.changes.length ? metadata.changes.map((change) => `- ${change}`).join('\n') : '- 待补充'}\n\n## 说明\n\n在这里补充本次更新的背景和细节。\n`
    : type === 'projects'
      ? `## 项目简介\n\n在这里介绍项目的目标和背景。\n\n## 进展\n\n- [ ] 补充当前进展\n`
      : type === 'vlogs'
        ? `## 视频简介\n\n在这里补充视频内容简介。\n`
        : `在这里开始撰写${type === 'notes' ? '笔记' : '思考'}内容。\n`;
  const content = `---\n${stringify(metadata, { lineWidth: 0 }).trimEnd()}\n---\n\n${body}`;

  await mkdir(folder, { recursive: true });
  await writeFile(file, content, { encoding: 'utf8', flag: 'wx' });
  print(`已创建文章：${path.relative(root, file)}`);
  return { type, slug, file, relativePath: path.relative(root, file) };
}
