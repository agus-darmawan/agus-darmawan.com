<div align="center">
  <img src=".github/banner.svg" alt="agus-darmawan.com banner" width="100%"/>
</div>

<br/>

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Biome](https://img.shields.io/badge/Biome-60A5FA?style=flat-square&logo=biome&logoColor=white)](https://biomejs.dev)
[![Live](https://img.shields.io/badge/Live-agus--darmawan.com-E95420?style=flat-square&logo=ubuntu&logoColor=white)](https://agus-darmawan.com)

</div>

<br/>

> An interactive Ubuntu 22.04 desktop simulation — draggable windows, a working terminal, live Spotify, and full EN/ID localization. Built with Next.js 16 App Router.

## Features

- **Window manager** — drag, minimize, maximize, z-index stacking, mobile-fullscreen
- **Terminal** — bash-like with vim mode, filesystem simulation, tab autocomplete
- **Spotify** — live "Now Playing" in the top bar with album art and progress ring
- **i18n** — full English & Indonesian via next-intl
- **PDF viewer** — resume rendered in-browser with zoom & page controls
- **Theme** — always-dark GNOME-style top bar, toggleable window light/dark

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript strict |
| Styling | Tailwind CSS v4 + CSS variables |
| State | Zustand + TanStack Query |
| i18n | next-intl (EN / ID) |
| Linter | Biome |

## Quick start

```bash
git clone https://github.com/agus-darmawan/ubuntu-portfolio
cd ubuntu-portfolio
npm install
cp .env.example .env.local
npm run dev
```

**.env.local**

```env
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REFRESH_TOKEN=
```

---

<div align="center">
<sub>Made with ☕ in Bali &nbsp;·&nbsp; <a href="https://agus-darmawan.com">agus-darmawan.com</a></sub>
</div>