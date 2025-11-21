# Use Bun official image which includes Bun runtime
FROM oven/bun:latest

WORKDIR /app

# Copy package manifest first to leverage layer caching
COPY package.json .
COPY bun.lockb .

# Copy source and generated clients
COPY src ./src
COPY generated ./generated
COPY prisma ./prisma
COPY prisma.config.ts tsconfig.json README.md ./

# Install production dependencies
RUN bun install --production

# Ensure uploads directory exists
RUN mkdir -p /app/uploads

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Run the TypeScript entrypoint directly with Bun
CMD ["bun", "run", "src/index.ts"]
