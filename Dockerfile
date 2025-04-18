# === Stage 1: Build Stage ===
FROM node:23-alpine AS builder

# Install dependencies required for better-sqlite3
RUN apk add --no-cache python3 make g++ sqlite

# Set working directory
WORKDIR /app

# Copy package files and install deps
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the code
COPY . .

# Build the app
RUN npm run build

# === Stage 2: Production Image ===
FROM node:23-alpine AS production

# Install runtime-only dependencies (for better-sqlite3)
RUN apk add --no-cache sqlite curl dcron

# Create app folder and data folder
WORKDIR /app
RUN mkdir -p /data

COPY --from=builder /app ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_PATH=/data/db.sqlite

COPY entrypoint.sh /app/entrypoint.sh
RUN chown node:node /app/entrypoint.sh && chmod +x /app/entrypoint.sh

# Expose port
EXPOSE 3000


RUN chown -R node:node /data
RUN chown -R node:node /app

# Run as non-root
USER node

# Entrypoint
ENTRYPOINT ["/app/entrypoint.sh"]
