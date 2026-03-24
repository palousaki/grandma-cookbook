# Grandma's Cookbook

A warm, digital version of Grandma's handwritten recipes — preserved in a realistic flipbook.

---

## Features

- Realistic page-flip effect using [`page-flip`](https://www.npmjs.com/package/page-flip)
- Table of Contents with inline editing (rename, page numbers) and dropdown navigation
- Zoom and page navigation controls
- Custom leather-style covers
- Fully static — deployed to **GitHub Pages**

---

## Tech Stack

- [Vite](https://vitejs.dev/) + [React 19](https://react.dev/)
- [React Router 7](https://reactrouter.com/) (hash mode)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [page-flip](https://www.npmjs.com/package/page-flip)
- [Lucide Icons](https://lucide.dev/)
- TypeScript (strict)

---

## Getting Started

```bash
git clone https://github.com/palousaki/grandma-cookbook.git
cd grandma-cookbook
npm install
npm run dev
```

Then open http://localhost:5173

---

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Build to dist/ (uses /grandma-cookbook/ base path)
npm run deploy   # Build + deploy to GitHub Pages
npm run preview  # Preview production build locally

node scripts/make-manifest.mjs  # Regenerate src/data/pages.json after adding images
```

---

## TOC Editor

Go to `/#/toc-editor` to manage the Table of Contents:

- Navigate pages with the flipbook or type a page number directly
- Type a recipe name and click **Add recipe**
- Click any existing name or page number to edit it inline
- Use **Export backup** to download the current TOC as `toc.json`

TOC changes are saved to `localStorage` automatically. To make them permanent, replace `src/data/toc.json` with the exported file.
