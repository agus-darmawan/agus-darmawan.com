# 🖥️ Ubuntu Portfolio

> Interactive Ubuntu 22.04 GNOME desktop simulation — built as a developer portfolio.

[![CI](https://github.com/agus-darmawan/ubuntu-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/agus-darmawan/ubuntu-portfolio/actions)
[![Deploy](https://img.shields.io/badge/deployed-vercel-black)](https://agus-darmawan.com)
[![License](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

![Portfolio Preview](./public/og-preview.png)

---

## ✨ Features

- 🪟 **Draggable windows** — resize, minimize, maximize, z-index management
- 🎵 **Spotify integration** — live now-playing in the top bar
- 🌐 **Bilingual** — English and Bahasa Indonesia (next-intl)
- 🌙 **Dark / Light mode** — persisted across sessions
- 💻 **Functional terminal** — with vim editor, file system simulation, and easter eggs
- 📄 **PDF resume viewer** — with zoom and page navigation
- 📬 **Contact form** — with email delivery via SMTP
- ⚡ **Edge-ready** — Cloudflare CDN, Workers, and R2 for static content

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State | Zustand + TanStack Query |
| i18n | next-intl |
| Linting | Biome |
| Email | Nodemailer |
| PDF | pdfjs-dist |
| Infra | Vercel + Cloudflare |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm

### 1. Clone the repo

```bash
git clone https://github.com/agus-darmawan/ubuntu-portfolio.git
cd ubuntu-portfolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the required values.

**Required:**
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REFRESH_TOKEN`

See [Getting Spotify credentials](#getting-spotify-credentials) below.

**Optional (contact form):**
- SMTP variables — if not set, form submissions are logged to console

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🎵 Getting Spotify Credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Set **Redirect URI** to `http://localhost:3000`
4. Copy **Client ID** and **Client Secret**
5. Get your **Refresh Token** using one of these methods:
   - [spotify-refresh-token](https://github.com/aleccool213/get-spotify-refresh-token) — easiest CLI tool
   - [Spotify Auth Flow guide](https://developer.spotify.com/documentation/web-api/tutorials/code-flow)
6. Required scopes: `user-read-currently-playing user-read-playback-state`

---

## 📧 Setting Up Contact Form

The contact form works without SMTP configured — submissions are logged to server console.

To enable email delivery, set SMTP variables in `.env.local`.

**Recommended: [Resend](https://resend.com)** (free tier: 3000 emails/month)

```env
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=resend
SMTP_PASS=re_your_api_key
CONTACT_EMAIL=your@email.com
```

---

## 📁 Project Structure

```
src/
  app/                    # Next.js App Router
    [locale]/             # i18n routing
    api/                  # API routes
  features/               # Feature-based components
    about/
    contact/
    dock/
    experience/
    projects/
    resume/
    terminal/
    top-bar/
    window-manager/
  hooks/                  # Shared hooks (used by 2+ features)
  lib/                    # Utilities (no React)
  store/                  # Zustand stores
  types/                  # Shared TypeScript types
  i18n/                   # next-intl config
  config/                 # App-wide constants

messages/
  en/                     # English translations
  id/                     # Indonesian translations

public/
  avatar.png
  companies/              # Company logos
  resume/                 # PDF resume files
```

---

## 🌍 Adding a New Language

1. Create `messages/{locale}/` directory
2. Copy all files from `messages/en/`
3. Translate the values
4. Add locale to `src/i18n/routing.ts`:

```ts
export const routing = defineRouting({
  locales: ["en", "id", "your-new-locale"],
  defaultLocale: "en",
})
```

---

## 📜 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run Biome linter
npm run lint:fix     # Auto-fix lint issues
npm run format       # Format code with Biome
npm run type-check   # TypeScript type checking
```

---

## 🚢 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/agus-darmawan/ubuntu-portfolio)

1. Click the button above or import repo manually at [vercel.com](https://vercel.com)
2. Add environment variables in Vercel dashboard
3. Deploy

### Docker

```bash
docker build -t ubuntu-portfolio .
docker run -p 3000:3000 --env-file .env.local ubuntu-portfolio
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Commit using conventional commits: `git commit -m "feat: add something"`
4. Push and open a PR

---

## 🙏 Inspiration

- [Ubuntu GNOME](https://ubuntu.com/) — for the desktop aesthetic
- [Dustin Brett's daedalOS](https://github.com/DustinBrett/daedalOS) — OS-in-browser concept