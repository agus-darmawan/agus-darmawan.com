<div align="center">

# 🖥️ agus-darmawan.com

> Interactive Ubuntu 22.04-themed developer portfolio

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Zustand](https://img.shields.io/badge/Zustand-000000?style=flat-square&logo=react&logoColor=white)](https://zustand-demo.pmnd.rs)
[![Deploy](https://img.shields.io/badge/Live-agus--darmawan.com-E95420?style=flat-square)](https://agus-darmawan.com)

</div>

---

A portfolio that runs like a real desktop — draggable windows, a working terminal, live Spotify integration, and full EN/ID localization. Built with Next.js 16 App Router.

## Features

- **Window manager** — drag, minimize, maximize, z-index stacking
- **Terminal** — bash-like with vim mode, file system simulation, tab completion
- **Spotify** — live "Now Playing" in the top bar with album art
- **i18n** — English & Indonesian via next-intl
- **PDF viewer** — resume rendered in-browser with zoom controls
- **Dark / Light mode** — always-dark top bar, toggleable window theme

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + CSS variables |
| State | Zustand + TanStack Query |
| i18n | next-intl |
| Linter | Biome |

## Quick start

```bash
git clone https://github.com/agus-darmawan/ubuntu-portfolio
cd ubuntu-portfolio
npm install
cp .env.example .env.local   # add Spotify credentials
npm run dev
```

## Env vars

```env
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REFRESH_TOKEN=
```

---

<div align="center">
<sub>Made with ☕ in Bali · <a href="https://agus-darmawan.com">agus-darmawan.com</a></sub>
</div>