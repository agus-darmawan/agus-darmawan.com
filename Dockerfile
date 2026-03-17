# ─────────────────────────────────────────────────────────
# Stage 1: deps
# ─────────────────────────────────────────────────────────
FROM node:22-bookworm-slim AS deps

# Security update
RUN apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Install dependencies (cached layer)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile


# ─────────────────────────────────────────────────────────
# Stage 2: builder
# ─────────────────────────────────────────────────────────
FROM node:22-bookworm-slim AS builder

RUN apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build args
ARG SPOTIFY_CLIENT_ID
ARG SPOTIFY_CLIENT_SECRET
ARG SPOTIFY_REFRESH_TOKEN
ARG NEXT_PUBLIC_APP_URL=https://agus-darmawan.com
ARG NEXT_PUBLIC_SENTRY_DSN
ARG SENTRY_AUTH_TOKEN

# Env
ENV SPOTIFY_CLIENT_ID=$SPOTIFY_CLIENT_ID
ENV SPOTIFY_CLIENT_SECRET=$SPOTIFY_CLIENT_SECRET
ENV SPOTIFY_REFRESH_TOKEN=$SPOTIFY_REFRESH_TOKEN
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN

ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js
RUN pnpm build

# Remove dev dependencies (important 🔥)
RUN pnpm prune --prod


# ─────────────────────────────────────────────────────────
# Stage 3: runner (ULTRA CLEAN)
# ─────────────────────────────────────────────────────────
FROM gcr.io/distroless/nodejs22-debian12 AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Copy only required files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["server.js"]