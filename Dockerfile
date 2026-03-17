# ── Stage 1: deps ────────────────────────────────────────────────────────────
FROM node:20-alpine@sha256:1234567890abcdef AS deps

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy lockfile and manifests only — leverage Docker layer cache
COPY package.json pnpm-lock.yaml ./

# Install all deps (including devDeps needed for build)
RUN pnpm install --frozen-lockfile


# ── Stage 2: builder ──────────────────────────────────────────────────────────
FROM node:20-alpine@sha256:1234567890abcdef AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy deps from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build args — injected at build time
ARG SPOTIFY_CLIENT_ID
ARG SPOTIFY_CLIENT_SECRET
ARG SPOTIFY_REFRESH_TOKEN
ARG NEXT_PUBLIC_APP_URL=https://agus-darmawan.com
ARG NEXT_PUBLIC_SENTRY_DSN
ARG SENTRY_AUTH_TOKEN

ENV SPOTIFY_CLIENT_ID=$SPOTIFY_CLIENT_ID
ENV SPOTIFY_CLIENT_SECRET=$SPOTIFY_CLIENT_SECRET
ENV SPOTIFY_REFRESH_TOKEN=$SPOTIFY_REFRESH_TOKEN
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN

# Next.js standalone output — minimal production bundle
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build


# ── Stage 3: runner ───────────────────────────────────────────────────────────
FROM node:20-alpine@sha256:1234567890abcdef AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only what's needed to run
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]