# Phase 2 内容验收记录

## 目的

使用明确标注的中性验收内容检查内容模型、列表与详情页面。下列内容均为 **验收示例 / 非个人经历**，不应被理解为站点作者的真实观点、经历或项目成果。

## 验收内容与预期路由

| 集合 | 内容 ID | 预期详情路由 | 主要覆盖点 |
| --- | --- | --- | --- |
| notes | `orthogonal-list`（现有真实笔记） | `/notes/orthogonal-list/` | 既有内容兼容、笔记元数据、显式关联目标 |
| thoughts | `phase-2-acceptance` | `/thoughts/phase-2-acceptance/` | 思考字段、标题层级/目录、所属项目、跨集合关联 |
| projects | `personal-website-acceptance` | `/projects/personal-website-acceptance/` | 状态、开始日期、链接、正文和显式关联 |
| thoughts | `phase-2-draft-check` | 不应生成公开详情页 | `draft: true` 草稿过滤 |

实际部署路径还会带站点 base `/personal-website`，例如 `/personal-website/thoughts/phase-2-acceptance/`。

## 关联关系

- 思考 `phase-2-acceptance` 的 `project` 指向 `personal-website-acceptance`，供项目页验证反向聚合。
- 思考 `phase-2-acceptance` 显式关联笔记 `orthogonal-list` 和项目 `personal-website-acceptance`。
- 思考还声明关联草稿 `phase-2-draft-check`；详情页应过滤掉该目标，不输出草稿链接。
- 项目 `personal-website-acceptance` 显式关联笔记 `orthogonal-list` 与思考 `phase-2-acceptance`。
- 项目的链接使用保留示例地址 `https://example.com/demo`，不指向个人或真实服务。

## 草稿预期

`phase-2-draft-check` 设置 `draft: true`。它不应出现在思考列表、首页的公开内容区或公开详情路由中。其他三条验收内容均设置为 `draft: false`，用于公开列表和详情页面验收。

## 构建后手工验收清单

- [x] 构建成功，且上述 frontmatter 通过内容 schema 校验。
- [x] 思考列表显示 `phase-2-acceptance`，并能打开其详情页。
- [x] 思考详情显示标题、摘要、日期、标签和正文；目录包含两个二级标题。
- [x] 思考详情的关联内容可到达笔记和项目；草稿关联被过滤，没有输出草稿链接。
- [x] 项目列表显示 `personal-website-acceptance`；详情显示“进行中”、开始日期及示例外链。
- [x] 项目详情显示显式关联的笔记与思考，并通过 `project` 字段反向聚合该思考。
- [x] `phase-2-draft-check` 不出现在公开列表，也没有公开详情页。
- [x] 笔记 `orthogonal-list` 仍可正常打开，现有内容兼容新增可选字段。

以上结果由本地 `npm run build` 和对 `dist/` 静态 HTML、路由文件的检查确认。

## 清理提醒

完成验收后，删除 `src/content/thoughts/phase-2-acceptance/`、`src/content/thoughts/phase-2-draft-check/`、`src/content/projects/personal-website-acceptance/`，并根据实际验证结果更新或移除此记录。若保留示例，请继续显眼标注“验收示例 / 非个人经历”，并替换示例项目的状态、日期和链接为准确内容。
