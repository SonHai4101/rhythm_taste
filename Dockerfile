# Optimized Dockerfile - should build in ~2-5 minutes instead of 50 minutes
FROM oven/bun:1 AS base
WORKDIR /app

# Install system dependencies once and cache them
FROM base AS system-deps
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies stage - this will be cached if package.json doesn't change
FROM system-deps AS deps
# Copy only package files first for better Docker layer caching
COPY --chown=bun:bun package.json bun.lockb* ./
# Install production dependencies only
RUN bun install --frozen-lockfile --production

# Build stage - for generating Prisma client
FROM system-deps AS build
# Copy package files
COPY --chown=bun:bun package.json bun.lockb* ./
# Install all dependencies (including dev for Prisma generation)
RUN bun install --frozen-lockfile

# Copy source code and Prisma schema
COPY --chown=bun:bun prisma ./prisma/
COPY --chown=bun:bun tsconfig.json ./

# Generate Prisma client
RUN bunx prisma generate

# Final runtime stage
FROM system-deps AS runtime
USER bun

# Copy production node_modules with correct ownership
COPY --from=deps --chown=bun:bun /app/node_modules ./node_modules

# Copy generated Prisma client
COPY --from=build --chown=bun:bun /app/src/generated ./src/generated

# Copy application source code
COPY --chown=bun:bun src ./src/
COPY --chown=bun:bun package.json ./
COPY --chown=bun:bun prisma ./prisma/

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Start the application
CMD ["bun", "run", "src/index.ts"]
