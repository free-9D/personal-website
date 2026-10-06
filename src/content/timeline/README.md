# Timeline 数据说明

页面时间线的数据保存在本目录中，每个年份对应一个 JSON 文件，例如 `2026.json`。新增年份时复制一个文件并修改文件名和 `year`；添加经历时往 `events` 数组追加对象。

## 数据结构

```ts
type TimelineYear = {
  year: number; // 年份，整数
  events: TimelineEvent[];
};

type TimelineEvent = {
  title: string; // 必填，简短描述这件事
  date?: string; // 可选，日期或时间范围，例如 "2026-03"、"2026 年春"
  description?: string; // 可选，对这件事的补充说明
};
```

`date` 不确定时可以省略，不需要猜日期；省略时不显示具体日期。经历按 JSON 中 `events` 的顺序显示，年份按从早到晚排列。即使 `events` 为空，该年份也会显示，并提供默认提示文字。

## 示例

```json
{
  "year": 2026,
  "events": [
    { "title": "开始准备考研" },
    {
      "date": "2026-03",
      "title": "开始建设 personal-website",
      "description": "建立一个长期记录学习、思考与项目的地方。"
    }
  ]
}
```

字段会由 `src/content.config.ts` 中的 Astro schema 校验：`year` 必须是 1900 至 9999 之间的整数，`title` 必须是非空字符串，其余字段可省略。
