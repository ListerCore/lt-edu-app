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
RUN bun --bun run build

# Minimal runtime: only standalone server, static assets and public files
FROM oven/bun:${BUN_VERSION}-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

COPY --from=builder --chown=bun:bun /app/public ./public
COPY --from=builder --chown=bun:bun /app/.next/standalone ./
COPY --from=builder --chown=bun:bun /app/.next/static ./.next/static

# Run as the non-root user shipped with the bun image
USER bun
EXPOSE 3000
CMD ["bun", "server.js"]
