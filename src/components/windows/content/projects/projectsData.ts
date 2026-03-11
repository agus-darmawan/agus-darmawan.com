export type ProjectCategory = "web" | "cli" | "library";

export interface Project {
	id: string;
	name: string;
	emoji: string;
	desc: string;
	longDesc: string;
	tech: string[];
	github: string;
	demo: string | null;
	stars: number;
	featured: boolean;
	category: ProjectCategory;
	color: string;
	readme: string;
}

export const PROJECTS: Project[] = [
	{
		id: "ubuntu-portfolio",
		name: "Ubuntu Portfolio",
		emoji: "🖥️",
		desc: "Interactive OS-themed developer portfolio with draggable windows, Spotify integration, i18n, and dark mode.",
		longDesc:
			"A fully interactive Ubuntu 22.04 GNOME desktop simulation built as a developer portfolio.",
		tech: [
			"Next.js",
			"TypeScript",
			"Tailwind CSS",
			"Zustand",
			"TanStack Query",
		],
		github: "https://github.com/agus-darmawan/ubuntu-portfolio",
		demo: "https://agus.dev",
		stars: 48,
		featured: true,
		category: "web",
		color: "#e95420",
		readme: `# Ubuntu Portfolio

An interactive Ubuntu 22.04-themed developer portfolio that turns a boring resume into a living desktop environment.

## ✨ Features

- **Window Management** — Draggable, resizable windows with minimize/maximize/close controls
- **Spotify Integration** — Live "Now Playing" widget in the top bar with album art
- **i18n Support** — Full English and Indonesian translations via next-intl
- **Dark/Light Mode** — Theme toggling that preserves GNOME's always-dark top bar
- **Terminal Emulator** — Functional bash-like terminal with vim mode, file system simulation
- **PDF Resume Viewer** — In-window PDF rendering with zoom controls

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State | Zustand + TanStack Query |
| i18n | next-intl |
| Icons | lucide-react |

## 🚀 Getting Started

\`\`\`bash
git clone https://github.com/agus-darmawan/ubuntu-portfolio
cd ubuntu-portfolio
npm install
cp .env.example .env.local
npm run dev
\`\`\`

## 📸 Screenshots

The portfolio mimics the GNOME Shell desktop with:
- A top bar showing time, Spotify status, battery, and network ping
- A dock at the bottom for launching apps
- Draggable window frames with macOS-style traffic lights

## 🤝 Contributing

PRs welcome! Please read the contributing guide first.
`,
	},
	{
		id: "taskflow",
		name: "TaskFlow",
		emoji: "📋",
		desc: "Real-time project management app with drag-and-drop kanban boards and AI-powered task suggestions.",
		longDesc:
			"A collaborative project management tool with real-time sync and AI features.",
		tech: ["React", "Node.js", "Socket.io", "PostgreSQL", "Redis", "OpenAI"],
		github: "https://github.com/agus-darmawan/taskflow",
		demo: "https://taskflow.agus.dev",
		stars: 31,
		featured: true,
		category: "web",
		color: "#3b82f6",
		readme: `# TaskFlow

Real-time project management with AI-powered task suggestions.

## Features

- **Kanban Boards** — Drag-and-drop cards with smooth animations
- **Real-time Sync** — Changes broadcast instantly via Socket.io
- **AI Suggestions** — OpenAI integration for smart task breakdown
- **Activity Feed** — Full audit trail of team actions

## Architecture

\`\`\`
client (React) ←→ WebSocket ←→ Node.js server ←→ PostgreSQL
                                      ↕
                                    Redis (pub/sub)
\`\`\`

## Tech Stack

- **Frontend**: React, TanStack Query, Framer Motion
- **Backend**: Node.js, Express, Socket.io
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis for sessions and pub/sub
- **AI**: OpenAI GPT-4o for task suggestions
`,
	},
	{
		id: "weathervue",
		name: "WeatherVue",
		emoji: "🌤️",
		desc: "Weather dashboard with interactive D3.js charts, multi-location tracking, and 7-day forecasts.",
		longDesc: "A beautiful weather dashboard built with Vue 3 and D3.js.",
		tech: ["Vue 3", "D3.js", "Pinia", "TypeScript", "OpenWeather API"],
		github: "https://github.com/agus-darmawan/weathervue",
		demo: "https://weathervue.agus.dev",
		stars: 19,
		featured: true,
		category: "web",
		color: "#06b6d4",
		readme: `# WeatherVue

A beautiful weather dashboard with rich data visualizations.

## Features

- Multi-location weather tracking
- Interactive D3.js temperature and precipitation charts  
- 7-day hourly forecasts
- Customizable widget layouts
- Local storage persistence

## Data Sources

- OpenWeatherMap API for current conditions
- Open-Meteo for historical data and forecasts
`,
	},
	{
		id: "cli-tools",
		name: "devkit-cli",
		emoji: "⚡",
		desc: "Developer productivity CLI tools including project scaffolding and git workflow automation.",
		longDesc: "A collection of CLI tools to supercharge developer workflows.",
		tech: ["Python", "Click", "Rich", "Shell"],
		github: "https://github.com/agus-darmawan/devkit-cli",
		demo: null,
		stars: 12,
		featured: false,
		category: "cli",
		color: "#8b5cf6",
		readme: `# devkit-cli

Supercharge your developer workflow with battle-tested CLI tools.

## Installation

\`\`\`bash
pip install devkit-cli
\`\`\`

## Commands

\`\`\`
devkit scaffold <template>   Create a new project from template
devkit git flow              Interactive git workflow helper
devkit env setup             Bootstrap environment variables
devkit deploy                One-command deployment helper
\`\`\`
`,
	},
	{
		id: "bali-umkm",
		name: "Bali UMKM Platform",
		emoji: "🛒",
		desc: "E-commerce platform connecting local Balinese artisans with customers worldwide.",
		longDesc: "A marketplace platform for local Balinese small businesses.",
		tech: ["Next.js", "Stripe", "Prisma", "PostgreSQL", "Cloudinary"],
		github: "https://github.com/agus-darmawan/bali-umkm",
		demo: "https://bali-umkm.vercel.app",
		stars: 9,
		featured: false,
		category: "web",
		color: "#f59e0b",
		readme: `# Bali UMKM Platform

Empowering local Balinese artisans to reach global customers.

## About

This platform connects traditional Balinese craft makers with customers around the world, featuring local payment gateway integration and multi-language support.

## Features

- Product catalog with rich media support (Cloudinary)
- Stripe + local payment gateway integration
- Order management and tracking
- Artisan profiles and stories
`,
	},
	{
		id: "react-snap-scroll",
		name: "react-snap-scroll",
		emoji: "🎨",
		desc: "Lightweight React hook library for smooth snap scrolling with accessibility features.",
		longDesc: "A zero-dependency React hook for buttery smooth snap scrolling.",
		tech: ["React", "TypeScript", "Rollup", "Vitest"],
		github: "https://github.com/agus-darmawan/react-snap-scroll",
		demo: null,
		stars: 7,
		featured: false,
		category: "library",
		color: "#10b981",
		readme: `# react-snap-scroll

Zero-dependency snap scrolling for React. Tiny, accessible, customizable.

## Install

\`\`\`bash
npm install react-snap-scroll
\`\`\`

## Usage

\`\`\`tsx
import { useSnapScroll } from 'react-snap-scroll'

function Gallery() {
  const { containerRef, activeIndex, snapTo } = useSnapScroll({
    direction: 'horizontal',
    easing: 'ease-out',
  })
  
  return <div ref={containerRef}>...</div>
}
\`\`\`

## API

| Prop | Type | Default |
|------|------|---------|
| direction | 'horizontal' \| 'vertical' | 'vertical' |
| easing | string | 'ease' |
| duration | number | 300 |
`,
	},
];
