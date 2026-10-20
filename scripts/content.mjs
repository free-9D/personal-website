#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
import { access, lstat, rm } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanContent, filterContent, renderTree } from './content-cli/content-index.mjs';
import { createArticle } from './content-cli/new-article.mjs';

const execFileAsync = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const promptInterface = createInterface({ input: stdin, output: stdout });
const prompt = (message, defaultValue = '') => promptInterface.question(`${message}${defaultValue ? ` [${defaultValue}]` : ''}: `)
  .then((answer) => answer.trim() || defaultValue);
const print = (message = '') => stdout.write(`${message}\n`);

const types = ['notes', 'thoughts', 'projects', 'updates', 'vlogs'];
const typeLabels = { notes: '笔记', thoughts: '思考', projects: '项目', updates: '更新记录', vlogs: 'Vlog' };

function printRecords(records) {
  if (!records.length) return print('没有找到文章。');
  for (const [index, record] of records.entries()) {
    const badges = [record.category, ...(record.tags ?? []), record.series ? `系列:${record.series}` : null, record.draft ? '草稿' : null]
      .filter(Boolean).join(' · ');
    print(`${String(index + 1).padStart(2, ' ')}. [${typeLabels[record.type] ?? record.type}] ${record.title}${badges ? `  (${badges})` : ''}`);
  }
}

async function chooseRecord(records) {
  printRecords(records);
  if (!records.length) return null;
  const answer = await prompt('输入序号选择文章（回车取消）');
  const index = Number(answer) - 1;
  return Number.isInteger(index) && index >= 0 && index < records.length ? records[index] : null;
}

async function filterRecords(records) {
  const typeAnswer = await prompt(`类型筛选（回车全部：${types.join('/')}）`);
  const type = types.includes(typeAnswer) ? typeAnswer : undefined;
  const category = await prompt('分类筛选（回车跳过）');
  const tag = await prompt('标签筛选（回车跳过）');
  const series = await prompt('系列筛选（回车跳过）');
  const query = await prompt('模糊搜索关键词（回车跳过）');
  return filterContent(records, { type, category: category || undefined, tag: tag || undefined, series: series || undefined, query: query || undefined });
}

async function openBrowser(url) {
  if (process.platform === 'win32') {
    return launchDetached('rundll32.exe', ['url.dll,FileProtocolHandler', url]);
  }
  if (process.platform === 'darwin') return execFileAsync('open', [url]);
  return execFileAsync('xdg-open', [url]);
}

function launchDetached(executable, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, args, {
      ...options,
      detached: true,
      stdio: 'ignore',
      windowsHide: true,
    });
    child.once('error', reject);
    child.once('spawn', () => {
      child.unref();
      resolve();
    });
  });
}

async function resolveVsCodeExecutable() {
  const candidates = [];
  if (process.platform === 'win32') {
    try {
      const { stdout: locations } = await execFileAsync('where.exe', ['code']);
      for (const location of locations.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)) {
        if (/\.exe$/i.test(location)) candidates.push(location);
        if (/\.cmd$/i.test(location)) candidates.push(path.resolve(path.dirname(location), '..', 'Code.exe'));
      }
    } catch { /* Try standard install locations below. */ }

    if (process.env.LOCALAPPDATA) {
      candidates.push(path.join(process.env.LOCALAPPDATA, 'Programs', 'Microsoft VS Code', 'Code.exe'));
    }
    candidates.push('C:\\Program Files\\Microsoft VS Code\\Code.exe');
    candidates.push('C:\\Program Files (x86)\\Microsoft VS Code\\Code.exe');
  }

  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch { /* Continue through known VS Code locations. */ }
  }
  if (process.platform !== 'win32') return 'code';
  throw new Error('找不到 VS Code。请确认已安装 VS Code，并将其 code 命令加入 PATH。');
}

async function openInVsCode(record) {
  const file = path.resolve(root, record.filePath);
  if (process.platform === 'win32') {
    const executable = await resolveVsCodeExecutable();
    return launchDetached(executable, ['--reuse-window', file], { cwd: root });
  }
  await execFileAsync('code', ['--reuse-window', file], { cwd: root });
}

async function ensureDevServer() {
  const url = 'http://localhost:4321';
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(1000) });
    if (response.ok || response.status < 500) return url;
  } catch { /* Start the local server below. */ }

  const nodeExecutable = process.execPath;
  const astroCli = path.join(root, 'node_modules', 'astro', 'astro.js');
  const child = spawn(nodeExecutable, [astroCli, 'dev', '--host', 'localhost'], {
    cwd: root,
    detached: true,
    stdio: 'ignore',
    windowsHide: true,
  });
  child.unref();

  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(1000) });
      if (response.ok || response.status < 500) return url;
    } catch { /* Wait for Astro to finish starting. */ }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error('开发服务器启动超时。请查看 Astro 输出或手动运行 npm run dev。');
}

async function openRecord(record) {
  const previewRoot = await ensureDevServer();
  const articleUrl = `${previewRoot}${record.urlPath}`;
  try {
    await openBrowser(articleUrl);
  } catch (error) {
    print(`浏览器未能自动打开：${error.message}`);
    print(`请手动访问：${articleUrl}`);
  }
  try {
    await openInVsCode(record);
  } catch {
    print('未能通过 `code` 命令打开 VS Code；请确认 VS Code CLI 已加入 PATH。');
  }
  print(`预览：${articleUrl}`);
  print(`文件：${record.filePath}`);
}

async function operateRecord(record) {
  print(`\n已选择：${record.title} [${typeLabels[record.type]}]`);
  print('1) 打开预览并编辑源文件  2) 只打开预览  3) 编辑源文件  4) 删除文章  5) 返回');
  const action = await prompt('请选择操作', '1');
  if (action === '1') return openRecord(record);
  if (action === '2') {
    const articleUrl = `${await ensureDevServer()}${record.urlPath}`;
    try {
      await openBrowser(articleUrl);
    } catch (error) {
      print(`浏览器未能自动打开：${error.message}`);
      print(`请手动访问：${articleUrl}`);
    }
    print(`预览：${articleUrl}`);
    return;
  }
  if (action === '3') {
    await openInVsCode(record);
    print(`文件：${record.filePath}`);
    return;
  }
  if (action === '4') return deleteRecord(record);
}

async function deleteRecord(record) {
  const collectionRoot = path.resolve(root, 'src', 'content', record.type);
  const sourceFile = path.resolve(root, record.filePath);
  const relativeSource = path.relative(collectionRoot, sourceFile);
  if (!types.includes(record.type) || !relativeSource || relativeSource.startsWith('..') || path.isAbsolute(relativeSource)) {
    throw new Error('拒绝删除：文章路径不在预期的内容集合目录中。');
  }

  const isIndexFile = /^index\.mdx?$/i.test(path.basename(sourceFile));
  const target = isIndexFile ? path.dirname(sourceFile) : sourceFile;
  const relativeTarget = path.relative(collectionRoot, target);
  if (!relativeTarget || relativeTarget.startsWith('..') || path.isAbsolute(relativeTarget)) {
    throw new Error('拒绝删除：目标路径越出了文章目录。');
  }

  print(`将删除文章“${record.title}”及其文章目录内容：`);
  print(path.relative(root, target));
  const confirmation = await prompt('输入 DELETE 确认删除（其他输入取消）');
  if (confirmation !== 'DELETE') {
    print('已取消删除。');
    return;
  }

  const targetInfo = await lstat(target);
  await rm(target, { recursive: targetInfo.isDirectory(), force: false });
  print(`已删除：${path.relative(root, target)}`);
}

async function createArticleWithFollowUp() {
  const created = await createArticle({ root, prompt, print });
  if (!created) return;
  const editNow = await prompt('现在就编辑并预览这篇文章吗？(y/n)', 'y');
  if (!['y', 'yes', '是', '1'].includes(editNow.toLowerCase())) return;

  const createdPath = path.relative(root, created.file).split(path.sep).join('/');
  const record = (await scanContent({ root })).find((item) => item.filePath === createdPath);
  if (!record) throw new Error('文章已创建，但无法重新读取它以打开预览。');
  await openRecord(record);
}

async function interactive() {
  while (true) {
    print('\n个人网站内容工具');
    print('1) 文件树  2) 筛选/搜索并选择  3) 新建文章  4) 退出');
    const action = await prompt('请选择', '1');
    if (action === '4' || action.toLowerCase() === 'q') break;
    if (action === '1') {
      const records = await scanContent({ root });
      print(renderTree(records));
      continue;
    }
    if (action === '3') {
      await createArticleWithFollowUp();
      continue;
    }
    if (action === '2') {
      const records = await scanContent({ root });
      const filtered = await filterRecords(records);
      const selected = await chooseRecord(filtered);
      if (selected) await operateRecord(selected);
      continue;
    }
    print('无法识别这个选项。');
  }
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (!command) return await interactive();
  if (command === 'new') return await createArticleWithFollowUp();
  const records = await scanContent({ root });
  if (command === 'tree' || command === 'list') return print(renderTree(records));
  if (command === 'search' || command === '--search') {
    const query = args.join(' ') || await prompt('搜索关键词');
    const results = filterContent(records, { query });
    printRecords(results);
    if (!results.length) return;
    const selected = await chooseRecord(results);
    if (selected) await operateRecord(selected);
    return;
  }
  if (command === 'open') {
    const results = args.length ? filterContent(records, { query: args.join(' ') }) : await filterRecords(records);
    const selected = await chooseRecord(results);
    if (selected) await operateRecord(selected);
    return;
  }
  print('用法：npm run content [tree|list|search <关键词>|--search <关键词>|open [关键词]|new]');
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(`内容工具出错：${error.message}`);
  process.exitCode = 1;
}).finally(() => promptInterface.close());
