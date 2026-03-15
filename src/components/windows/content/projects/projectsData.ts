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

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 16 | App Router |
| Language | TypeScript | Strict mode |
| Styling | Tailwind CSS v4 | CSS variables |
| State | Zustand + TanStack Query | Client + server |
| i18n | next-intl | EN + ID |

## 🚀 Getting Started

\`\`\`bash
git clone https://github.com/agus-darmawan/ubuntu-portfolio
cd ubuntu-portfolio
npm install
cp .env.example .env.local
npm run dev
\`\`\`

## Architecture

> The portfolio is designed to be a faithful recreation of GNOME Shell, with each "app" as an isolated React component mounted into a draggable window frame.

The window management system uses three cooperating hooks:

1. \`useWindowZIndex\` — monotonic z-index counter
2. \`useWindowLifecycle\` — open / close / minimize / maximize state
3. \`useWindowDrag\` — mouse drag with ref-based stale closure prevention

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

## Setup

\`\`\`bash
npm install
cp .env.example .env
docker-compose up -d   # starts Postgres + Redis
npm run dev
\`\`\`

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/boards | List all boards |
| POST | /api/boards | Create board |
| PATCH | /api/cards/:id | Update card |
| DELETE | /api/cards/:id | Remove card |

## AI Integration

> Task suggestions are powered by GPT-4o with a custom system prompt that understands project context and past velocity.

The suggestion pipeline:

1. Collect recent completed tasks from the board
2. Build context window with project metadata
3. Call OpenAI with structured output format
4. Parse and display inline suggestion chips
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

## Charts

### Temperature Chart

Uses a D3 area chart with smooth interpolation. The gradient fill transitions from the accent color at the peak temperature down to transparent at the baseline.

\`\`\`ts
const area = d3.area<HourlyPoint>()
  .x(d => xScale(d.time))
  .y0(height)
  .y1(d => yScale(d.temp))
  .curve(d3.curveCatmullRom.alpha(0.5))
\`\`\`

### Precipitation

Bar chart with rounded tops. Each bar's opacity scales with precipitation probability.

## Data Sources

| Source | Used for | Free tier |
|--------|----------|-----------|
| OpenWeatherMap | Current + 5-day | 1000 calls/day |
| Open-Meteo | Historical | Unlimited |

> All API calls are proxied through a Next.js API route to keep keys server-side.
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

## Templates

| Template | Stack | Description |
|----------|-------|-------------|
| \`next-ts\` | Next.js + TS | Full-stack web app |
| \`fastapi\` | Python + FastAPI | REST API service |
| \`go-gin\` | Go + Gin | High-perf API |
| \`cli-py\` | Click + Rich | Another CLI tool |

## Git Flow

> The \`git flow\` command wraps the conventional git workflow into a guided interactive TUI powered by Rich.

Steps it automates:

1. Branch name validation (conventional format)
2. Pre-commit lint and test run
3. Squash merge with auto-generated commit message
4. Branch cleanup after merge
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

  return (
    <div ref={containerRef}>
      <Slide />
      <Slide />
      <Slide />
    </div>
  )
}
\`\`\`

## API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`direction\` | \`'horizontal' \| 'vertical'\` | \`'vertical'\` | Scroll axis |
| \`easing\` | \`string\` | \`'ease'\` | CSS easing function |
| \`duration\` | \`number\` | \`300\` | Animation duration ms |
| \`onSnap\` | \`(index: number) => void\` | — | Callback on snap |

## Accessibility

> Snap scrolling can interfere with keyboard navigation. This library adds \`role="region"\` and \`aria-label\` to the container, and supports arrow-key navigation out of the box.

All motion respects \`prefers-reduced-motion\` — when the user has reduced motion enabled, snapping is instant with no animation.
`,
	},
];
