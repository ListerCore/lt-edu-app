# syntax=docker/dockerfile:1

# Bun version matches packageManager in package.json
ARG BUN_VERSION=1.3.14

# Install deps with the frozen lockfile so builds are reproducible
FROM oven/bun:${BUN_VERSION}-slim AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build the Next.js standalone output
FROM oven/bun:${BUN_VERSION}-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Public build-time values (NEXT_PUBLIC_* is inlined into the client bundle)
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY=""
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
# Canonical origin baked into prerendered pages (metadata, sitemap.xml, robots.txt)
ARG APP__SITE_URL=https://listercore.pe
ENV APP__SITE_URL=$APP__SITE_URL
RUN bun --bun run build

# Minimal runtime: only standalone server, static assets and public files. Runs on Node, not Bun: Bun's node:http
# never hands the upgrade to Next, so the WebSockets of /ws/panel and /ws/observability would hang
FROM node:24-slim AS runner
WORKDIR /app

# Defaults; Dokploy overrides them at runtime with the APP__* variables
ENV APP__NODE_ENV=production \
    APP__HOST=0.0.0.0 \
    APP__PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# Run as the non-root user shipped with the node image
USER node
EXPOSE 3000

# Next's standalone server reads NODE_ENV/HOSTNAME/PORT, so map the APP__* names at start
CMD ["sh", "-c", "NODE_ENV=\"$APP__NODE_ENV\" HOSTNAME=\"$APP__HOST\" PORT=\"$APP__PORT\" exec node server.js"]
