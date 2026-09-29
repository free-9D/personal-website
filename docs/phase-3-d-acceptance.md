# Phase 3 D：内容样例与端到端验收

## 验收范围

使用现有内容模板和明确标记的示例，核对笔记、思考、项目的模板与页面输出、草稿过滤、目录、标签/系列归档及关联内容。此记录只检查当前实现，不代表线上 GitHub Pages 已部署本轮改动。

验收样例沿用 [Phase 2 内容验收记录](./phase-2-acceptance.md) 与 [Phase 3 A 验收记录](./phase-3-a-acceptance.md)：

- `notes/orthogonal-list`：已有十字链表笔记，包含 MDX 结构示意图和图例组件。
- `thoughts/phase-2-acceptance`、`projects/personal-website-acceptance`：显式标记为“验收示例 / 非个人经历”。
- `thoughts/phase-2-draft-check`：草稿过滤样例，`draft: true`。
- 上述公开验收思考与项目属于 `phase-3-content-discovery` 系列，顺序分别为 1、2。

## 执行命令

```powershell
$env:ASTRO_TELEMETRY_DISABLED = '1'
npm run build
git diff --check
```

构建结果：成功。`astro check` 检查 32 个文件，0 错误、0 警告、0 提示；Astro 共生成 29 个页面。随后检查 `dist/` 静态 HTML、JSON、RSS、Sitemap 与输出路由。

## 验收结果

| 检查点 | 结果 | 静态构建观察 |
| --- | --- | --- |
| 写作模板 | 通过 | `templates/notes.md`、`templates/thoughts.md`、`templates/projects.md` 都包含构建所需的标题、摘要、日期、草稿字段及对应集合特有字段；可选字段带有说明或注释示例。模板正文从二级标题开始，并提供相应写作章节。 |
| 笔记详情与文章组件 | 通过 | `/notes/orthogonal-list/` 已生成；HTML 含 SVG 结构图、`firstin`、`tailvex` 等字段标注，并有到排序笔记的关联链接。 |
| 思考列表与详情 | 通过 | 思考列表包含公开验收思考；详情 HTML 含标题、日期、标签和正文，自动目录包含“示例主题”“验收观察点”。 |
| 项目列表与详情 | 通过 | 项目列表包含验收项目；详情显示“进行中”、示例演示链接及关联笔记、思考。项目页也反向聚合了设置 `project` 字段的思考。 |
| 草稿过滤 | 通过 | 草稿详情路由不存在；首页和思考列表无草稿；站内搜索 JSON、RSS、Sitemap 均不含草稿路径。构建产物中搜索草稿 ID 的结果为 0。 |
| 显式关联 | 通过 | 思考详情链接到笔记和项目，不显示被关联的草稿；项目详情显示关联笔记和思考。 |
| 标签归档 | 通过 | `/tags/验收示例/` 已生成，并同时列出公开验收思考和项目。 |
| 系列归档及排序 | 通过 | 系列页 `/series/phase-3-content-discovery/` 已生成，验收思考排在项目之前（顺序 1、2）。 |
| GitHub Pages base | 通过 | 检查到内容关联、标签和系列输出链接使用 `/personal-website/` 前缀。 |
| 输出格式 | 通过 | 搜索索引可解析为 JSON；RSS 和 Sitemap 可由 PowerShell XML 解析器成功解析。 |
| 差异空白检查 | 通过 | `git diff --check` 成功，无空白错误。 |

## 结论与发布提醒

本地静态构建通过了当前 D 阶段约定的内容模型、列表/详情、草稿、目录、关联、标签和系列验收。此次没有进行浏览器视觉或 GitHub Pages 线上验收，也没有修改页面组件、schema、现有文章、个人信息或 GitHub 仓库。

验收项目和思考是 `draft: false` 的公开内容，所以会出现在生产构建中。它们虽在正文与描述中标注为中性验收示例，但推送前仍应由站长决定是保留、替换还是清理；草稿样例则不会被发布。不要将验收示例误认为个人经历、真实项目成果或实际服务链接。
