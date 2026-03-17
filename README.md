# 🖥️ Ubuntu Portfolio

> Interactive Ubuntu 22.04 GNOME desktop simulation — built as a developer portfolio.

[![CI](https://github.com/agus-darmawan/ubuntu-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/agus-darmawan/ubuntu-portfolio/actions)
[![Deploy](https://img.shields.io/badge/deployed-vercel-black)](https://agus-darmawan.com)

---

## Stack

Next.js 16 · TypeScript · Tailwind CSS v4 · Zustand · TanStack Query · Framer Motion · next-intl · Cloudflare

---

## Features

- 🪟 Draggable windows with snap-to-edge
- ⌨️ Functional terminal with `man agus`, easter eggs, and UI commands
- ⌘ Command palette (`Ctrl+K`)
- 🌙 Screensaver after 60s idle
- 🎵 Live Spotify now-playing
- 🌐 EN / ID bilingual
- 📬 Contact form with Cloudflare Turnstile
- 🚀 OG image, web manifest, Sentry error tracking

---

## Quick Start

```bash
git clone https://github.com/agus-darmawan/ubuntu-portfolio.git
cd ubuntu-portfolio
pnpm install
cp .env.example .env.local
# Fill in .env.local, then:
pnpm dev
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values.

| Variable | Required | Description |
|---|---|---|
| `SPOTIFY_CLIENT_ID` | ✅ | Spotify app client ID |
| `SPOTIFY_CLIENT_SECRET` | ✅ | Spotify app client secret |
| `SPOTIFY_REFRESH_TOKEN` | ✅ | Spotify refresh token |
| `SMTP_*` | — | Email delivery for contact form |
| `CONTACT_EMAIL` | — | Where contact form sends to |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | — | Cloudflare Turnstile (bot protection) |
| `TURNSTILE_SECRET_KEY` | — | Cloudflare Turnstile secret |
| `NEXT_PUBLIC_SENTRY_DSN` | — | Sentry error tracking |
| `SENTRY_AUTH_TOKEN` | — | Sentry source map upload |
| `NEXT_PUBLIC_CONTENT_URL` | — | Cloudflare R2 CDN for MDX/PDF |
| `NEXT_PUBLIC_APP_URL` | — | Base URL for OG images |
| `NEXT_PUBLIC_SPOTIFY_WORKER_URL` | — | Cloudflare Worker for Spotify |
| `CF_ACCOUNT_ID` | — | Cloudflare account (visitor counter) |
| `CF_SITE_TAG` | — | Cloudflare Analytics site tag |
| `CF_API_TOKEN` | — | Cloudflare API token |
| `GITHUB_TOKEN` | — | GitHub API (higher rate limit) |

### Getting Spotify credentials

1. Create app at [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Set redirect URI to `http://localhost:3000`
3. Copy **Client ID** and **Client Secret**
4. Get refresh token: [spotify-refresh-token](https://github.com/aleccool213/get-spotify-refresh-token) — scopes: `user-read-currently-playing`

---

## Scripts

```bash
pnpm dev          # Development server
pnpm build        # Production build
pnpm analyze      # Bundle analyzer
pnpm test:run     # Run tests once
pnpm type-check   # TypeScript check
pnpm lint         # Biome lint
pnpm lint:fix     # Auto-fix lint issues
```

---

## Docker

```bash
docker build \
  --build-arg SPOTIFY_CLIENT_ID=xxx \
  --build-arg SPOTIFY_CLIENT_SECRET=xxx \
  --build-arg SPOTIFY_REFRESH_TOKEN=xxx \
  -t ubuntu-portfolio .

docker run -p 3000:3000 ubuntu-portfolio
```

---

## Project Structure

```
src/
  app/              Next.js App Router + API routes
  features/         Feature-based components
    about/
    blog/
    contact/
    dock/
    experience/
    projects/
    resume/
    screensaver/
    terminal/
    top-bar/
    window-manager/
    command-palette/
    boot/
  hooks/            Shared hooks
  store/            Zustand stores
  lib/              Utilities (no React)
  types/            Shared TypeScript types

content/
  readme/en|id/     Project README files (MDX)
  blog/en|id/       Blog posts (MDX)
  resume/           PDF resume files
```

---

## License

MIT © [I Wayan Agus Darmawan](https://agus-darmawan.com)