# Phase 4 D：集成与验收

日期：2026-10-01

## 验收范围

- 将 Vlog 和更新记录列表路由加入 Sitemap。
- 将非草稿的 Vlog 和更新记录详情路由加入 Sitemap，并按 `draft` 过滤。
- 检查 GitHub Pages Project Site 的 `/personal-website/` 路径、静态页面生成和播放器配置。
- 本次仅做本地构建验收；没有提交、推送或验证线上部署。

## 执行命令

```powershell
$env:ASTRO_TELEMETRY_DISABLED='1'; npm run build; git diff --check
```

结果：最终构建成功；Astro 检查 38 个文件，0 errors、0 warnings、0 hints；静态构建生成 36 个页面。`git diff --check` 通过。Git 对若干文件报告 LF 将来可能转换为 CRLF，这是换行符提示，不是 diff 检查失败。修改验收条目后第一次内容同步曾出现重复 id 警告；再次完整构建时未复现，最终验收以无该警告的完整构建为准。

## 检查结果

| 检查项 | 结果 | 实际观察 |
| --- | --- | --- |
| Vlog 列表页生成 | 通过 | `dist/vlogs/index.html` 存在。 |
| 更新记录列表页生成 | 通过 | `dist/updates/index.html` 存在。 |
| Sitemap XML 格式 | 通过 | `dist/sitemap.xml` 可由 PowerShell XML 解析器解析。 |
| Sitemap 列表入口 | 通过 | 含 `/personal-website/vlogs/` 与 `/personal-website/updates/`。 |
| Project Site 路径 | 通过 | 已生成的 Vlog / 更新记录 Sitemap URL 带有 `/personal-website/` 前缀；Vlog 页返回列表的链接也包含此前缀。 |
| Sitemap 详情入口 | 通过 | 当前三条 Phase 4 条目都设为草稿，因此没有 Vlog/更新记录详情链接进入 Sitemap。 |
| 三条草稿详情不生成 | 通过 | `phase-4-draft-check`、`lushichuanshuo`、`acceptance-draft` 的详情 HTML 均不存在于 `dist/`。 |
| Sitemap 草稿过滤 | 通过 | Sitemap 不包含以上三个 slug；同时仍包含带 `/personal-website/` 前缀的 Vlog 和更新记录列表入口。 |
| Vlog 播放器配置 | 代码静态检查通过，播放未验证 | `BilibiliPlayer.astro` 将播放器固定为 `https://player.bilibili.com/player.html`、分 P 映射到 `p`、默认 `autoplay=0`，详情页提供 B 站观看链接作为降级。当前条目均为草稿，未生成真实播放器页面；未实际访问外部播放器。 |

## 待处理

当前三个 Vlog/更新记录条目均明确标记为内部验收草稿，并设置 `draft: true`。其中 `lushichuanshuo` 里的第一人称经历已移除，内容和 BV 号均为内部占位信息，不代表真实视频或个人经历。发布真实视频前，需由站长替换为本人确认公开的内容与 BV 号。

## 未覆盖

- 没有进行线上 GitHub Pages 部署或线上路由检查。
- 没有验证真实 B 站视频播放、跨域策略或用户网络环境下的嵌入表现。
- 没有修改 schema、BaseLayout、B/C 页面或组件；仅把三条明确的内部验收内容恢复/设置为草稿，并移除其中不真实的第一人称表述。
