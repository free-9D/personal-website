# Phase 4 内容约定

本文件记录 Vlog 与更新记录页面开始实现前共用的 collection、字段和 URL 契约。页面及示例内容由后续任务建立。

## 集合与路由

| Collection | 内容目录 | 列表路由 | 单条路由 |
| --- | --- | --- | --- |
| `vlogs` | `src/content/vlogs/<slug>/index.md` | `/vlogs/` | `/vlogs/<slug>/` |
| `updates` | `src/content/updates/<slug>/index.md` | `/updates/` | `/updates/<slug>/` |

站内链接必须通过 Astro 的 `BASE_URL` 或现有 URL 工具生成，以兼容 GitHub Pages 的 `/personal-website/` 前缀。

## 共用发布字段

两个集合都使用：

- `title`、`description`、`pubDate`：必填标题、摘要和发布日期。
- `updatedDate`：可选的实质更新日期。
- `draft`：默认 `false`；列表和公开输出必须排除草稿。
- `tags`：默认空数组，供展示或后续筛选。

正文仍写在 Markdown/MDX 文件中。不要把正文内容重复放进 frontmatter。

## Vlog 字段

- `platform`：当前固定为 `bilibili`，默认为此值。
- `bvid`：必填的 B 站视频 BV 标识，用于构造平台链接或播放器地址。
- `page`：可选正整数，对应多 P 视频的分 P 序号；省略时使用视频默认分 P。

内容 schema 不接受任意 iframe HTML 或任意嵌入地址，也不在本阶段生成播放器。详情页播放器和外链降级由 Vlog 页面任务实现。

## 更新记录字段

- `version`：可选版本标签。
- `category`：可选更新分类。
- `changes`：变更说明字符串数组，默认为空数组。

发布日期用于排序；每条记录的细节说明可继续写在 Markdown 正文中。

## 草稿与发布

新增内容应使用小写英文和连字符作为稳定 slug。页面、搜索/RSS/Sitemap 等公开内容输出都应遵循同一草稿过滤规则。此阶段暂不添加 Vlog 或更新记录样例，避免把演示信息误当成真实公开内容。
