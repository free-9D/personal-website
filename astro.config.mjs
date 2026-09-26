import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// GitHub Pages Project Site: https://free-9D.github.io/personal-website/
export default defineConfig({
  site: 'https://free-9D.github.io',
  base: '/personal-website',
  trailingSlash: 'always',
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    syntaxHighlight: 'shiki',
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
