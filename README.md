# Personal Website

Astro static site for GitHub Pages, built with TypeScript, Tailwind CSS, Markdown/MDX, KaTeX, Mermaid, and Shiki.

## Local development

- Use Node.js 22 or newer (`.nvmrc` records the major version).
- Install dependencies with `npm ci`.
- Start the local server with `npm run dev`.
- Check and build the site with `npm run build`.

## Content CLI

- Run `npm run content` for the interactive content browser and creation wizard.
- Run `npm run content -- tree` to print the content tree, `npm run content -- search "关键词"` to find and select entries, or `npm run content -- new` to create one. Search results let you open a preview, edit the source file in VS Code, or delete the article after confirmation.
- Select an entry from the browser to open its local Astro preview, its source file in VS Code, or both. Opening a preview starts the development server on port 4321 if it is not already running.
- The selected-entry menu can delete an article and its content folder after you confirm by typing `DELETE`.
- The editor action uses the `code` command. Install or enable the VS Code command-line launcher and make sure it is on `PATH`.
- New entries are created as drafts by default; the wizard collects the fields required by each Astro content collection.

The Project Site base path is `/personal-website/`. Update `site` and `base` in `astro.config.mjs` if the repository or publishing address changes.

The About page contains visible editable placeholders. Replace or remove them before publishing personal details.
