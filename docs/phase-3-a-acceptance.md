# Phase 3 A 验收记录

## 覆盖范围

- `getPublicContent()` 汇总 notes、thoughts、projects，并排除草稿。
- 标签索引和详情页只按公开内容统计、生成路由。
- 系列索引和详情页读取稳定系列 id、显示名称和顺序。
- 返回内容的 URL 包含 GitHub Pages 的 `/personal-website/` base。
- 文章详情页中的标签和系列入口指向相应归档页。

## 示例系列

Phase 2 的两条公开验收示例暂时组成 `phase-3-content-discovery` 系列：思考顺序为 1，项目顺序为 2。它们仍明确标记为验收示例，不代表站点作者的真实经历或项目。Phase 2 验收示例清理时，应一并删除或更新系列字段。

## 本地验收

- [x] `npm run check` 通过，27 个 Astro 文件 0 错误、0 警告、0 提示。
- [x] `npm run build` 生成标签索引及全部公开标签详情路由。
- [x] 构建生成系列索引及 `series/phase-3-content-discovery/` 详情页。
- [x] 系列详情按 `seriesOrder` 显示思考（1）后项目（2）。
- [x] 草稿标签不会生成公开标签路由或进入公开内容计数。
- [x] 标签和系列链接使用站点 `base` 前缀。
