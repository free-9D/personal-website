import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const commonSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  pubDate: z.date(),
  updatedDate: z.date().optional(),
  draft: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  /** Stable identifier used to group public entries on their series archive page. */
  series: z.string().min(1).optional(),
  /** Optional human-readable series name; falls back to the series identifier. */
  seriesTitle: z.string().min(1).optional(),
  /** Optional explicit order within a series; omitted entries sort by publication date. */
  seriesOrder: z.number().int().positive().optional(),
  /** Explicit cross-collection links use the collection name and content id. */
  related: z
    .array(
      z.object({
        collection: z.enum(["notes", "thoughts", "projects"]),
        id: z.string().min(1),
      }),
    )
    .default([]),
});

/** Keep folder/index.md entries addressable by their folder name. */
function contentId({ entry }: { entry: string }): string {
  const id = entry.replace(/\\/g, "/").replace(/\/index\.(?:md|mdx)$/i, "");
  return id || entry.replace(/\\/g, "/");
}

const notes = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/notes",
    generateId: contentId,
  }),
  schema: commonSchema.extend({
    category: z.string().optional(),
    /** Optional project id; a project page can gather related notes. */
    project: z.string().min(1).optional(),
  }),
});

const thoughts = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/thoughts",
    generateId: contentId,
  }),
  schema: commonSchema.extend({
    kind: z.string().optional(),
    /** Optional project id; a project page can gather related thoughts. */
    project: z.string().min(1).optional(),
  }),
});

const projects = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/projects",
    generateId: contentId,
  }),
  schema: commonSchema.extend({
    status: z.enum(["进行中", "已完成", "暂停"]),
    startDate: z.date(),
    endDate: z.date().optional(),
    links: z
      .array(
        z.object({
          label: z.string(),
          url: z.string().url(),
        }),
      )
      .optional(),
  }),
});

export const collections = { notes, thoughts, projects };
