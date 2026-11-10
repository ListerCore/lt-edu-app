# syntax=docker/dockerfile:1

# Node and pnpm versions; pnpm matches packageManager in package.json
ARG NODE_VERSION=24
ARG PNPM_VERSION=12.18.0

# Base image with pnpm enabled through corepack
FROM node:${NODE_VERSION}-slim AS base
ARG PNPM_VERSION
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
WORKDIR /app

# Install deps with the frozen lockfile so builds are reproducible
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build the Next.js standalone output
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Public build-time values (NEXT_PUBLIC_* is inlined into the client bundle)
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY=""
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
# Canonical origin baked into prerendered pages (metadata, sitemap.xml, robots.txt)
ARG APP__SITE_URL=https://listercore.pe
ENV APP__SITE_URL=$APP__SITE_URL
RUN pnpm run build

# Minimal runtime: only standalone server, static assets and public files
FROM node:${NODE_VERSION}-slim AS runner
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
