# 🖥️ agus-darmawan.com

> Portfolio of **I Wayan Agus Darmawan** — an interactive Ubuntu 22.04 GNOME desktop in the browser, plus fast, crawlable pages for every project and post.

[![CI](https://github.com/agus-darmawan/agus-darmawan.com/actions/workflows/ci.yml/badge.svg)](https://github.com/agus-darmawan/agus-darmawan.com/actions)
[![Live](https://img.shields.io/badge/live-agus--darmawan.com-e95420)](https://agus-darmawan.com)

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Zustand · TanStack Query · Framer Motion · next-intl · Zod · Vitest · Biome

---

## Features

- 🪟 Draggable windows with snap-to-edge, dock, command palette (`Ctrl+K`), screensaver
- ⌨️ Terminal with `man agus`, easter eggs and UI commands
- 📂 Projects & blog from MDX **+ live GitHub data** (stars, forks, auto-discovered repos)
- 🔎 SEO: SSG pages per project/post, JSON-LD (`Person`, `ProfilePage`, `BlogPosting`, `SoftwareSourceCode`), hreflang, per-page OG images, sitemap with alternates
- 🌐 EN / ID, 🌙 dark mode, 🎵 Spotify now-playing, 📬 contact form with Turnstile, 🚨 Sentry

---

## Quick start

```bash
git clone https://github.com/agus-darmawan/agus-darmawan.com.git
cd agus-darmawan.com
pnpm install
cp .env.example .env.local   # every variable is optional
pnpm dev
```

---

## Content — adding a project or post

All projects and posts live in `content/` and are loaded by `src/lib/content`.
**No TypeScript or i18n edits needed.**

### Option A — zero-code: tag a GitHub repo

Add the topic **`portfolio`** to any public repo. It appears on the next
revalidation (≤ 1 h) with its README as the write-up. Extra topics:

| Topic | Effect |
|---|---|
| `featured` | Pinned to the top |
| `robotics`, `ros`, `ros2`, `drone`, `embedded`, `slam` | Category → Robotics |
| `research`, `paper`, `machine-learning`, `deep-learning` | Category → Research |
| *(anything else)* | Shown as tags; category → Web |

### Option B — curated write-up (MDX)

`content/projects/en/<slug>.mdx`

```mdx
---
title: "Quadruped Inspection Robot System"
description: "One sentence, ≤ 300 chars — used for cards, meta description and OG."
category: robotics        # web | robotics | research
featured: true
order: 3                  # lower = earlier
emoji: "🤖"
color: "#10b981"
tags: ["ROS2", "Python", "C++"]
repo: "agus-darmawan/quadruped-inspection"   # optional → live stars/forks
demo: "https://example.com"                  # optional
date: 2025-06-01                              # optional for projects
---

Body in Markdown. Don't repeat the title as `# H1` — the page renders it.
```

`content/projects/id/<slug>.mdx` only needs `title`, `description` and the
body — everything else is inherited from `en`. Missing translation → `en`.

Posts are the same under `content/blog/`, with a required `date` (reading time
is computed). Add `draft: true` to hide either.

Frontmatter is validated with Zod — a typo fails the build with the file name.

---

## Environment variables

See [`.env.example`](.env.example). Nothing is required; each missing
integration simply turns its feature off.

| Variable | Feature |
|---|---|
| `SPOTIFY_CLIENT_ID` / `SECRET` / `REFRESH_TOKEN` | Now-playing widget |
| `NEXT_PUBLIC_SPOTIFY_WORKER_URL` | Use the Cloudflare Worker instead of `/api/spotify` |
| `SMTP_*`, `CONTACT_EMAIL` | Contact form delivery (logs in dev otherwise) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Bot protection |
| `GITHUB_TOKEN` | GitHub API 60 → 5000 req/h (recommended in prod) |
| `NEXT_PUBLIC_APP_URL` | Canonical base URL (defaults to `https://agus-darmawan.com`) |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console ownership meta tag |
| `NEXT_PUBLIC_CONTENT_URL` | R2 CDN for the resume PDFs |
| `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN` | Error tracking |
| `CF_ACCOUNT_ID`, `CF_SITE_TAG`, `CF_API_TOKEN` | Visitor counter in the terminal |

---

## Scripts

```bash
pnpm dev          # dev server
pnpm build        # production build
pnpm test:run     # unit tests (parser, highlighter, content loader)
pnpm type-check   # tsc --noEmit
pnpm lint         # Biome
pnpm knip         # unused files / exports / deps
pnpm analyze      # bundle analyzer
```

---

## Docker

```bash
docker build -t agus-darmawan.com .
docker run -p 3000:3000 --env-file .env.local agus-darmawan.com
```

The image uses Next's `standalone` output on a distroless Node 22 runtime.

---

## Structure

```
content/
  projects/{en,id}/*.mdx    project write-ups (frontmatter + Markdown)
  blog/{en,id}/*.mdx        posts
  resume/                   PDFs (synced to R2)
src/
  app/[locale]/             home (desktop) + SSG pages: projects, blog
  app/api/                  contact, spotify, visitors, content bodies
  components/
    content/                ContentWindow (list + in-window detail), ContentCard, ContentHeader,
                            ContentDetail — one implementation behind both Projects and Blog
    markdown/               Markdown renderer, code highlighting, TOC
    seo/                    PageShell, JSON-LD, home text profile, route helpers
    window/                 WindowHero
  config/site.ts            identity, URLs, socials — single source of truth
  features/                 desktop apps (about, blog, projects, terminal, …)
  lib/
    content/                loader, GitHub client, Zod schema, types
    markdown/               parser + highlighter (pure, tested)
    seo/                    metadata + structured data builders
  store/                    Zustand window manager
```

---

## License

MIT © [I Wayan Agus Darmawan](https://agus-darmawan.com)
