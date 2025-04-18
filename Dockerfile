# === Stage 1: Build Stage ===
FROM node:23-alpine AS builder

# Enable Corepack
RUN corepack enable

# Install build dependencies required for better-sqlite3
RUN apk add --no-cache python3 make g++ sqlite

# Set working directory
WORKDIR /app

# Copy Yarn config and lock files
COPY package.json yarn.lock .yarnrc.yml ./

# Set Yarn version using the one configured in .yarnrc.yml
RUN yarn install --immutable

# Copy the rest of the app code
COPY . .

# Build the app
RUN yarn build

# === Stage 2: Production Image ===
FROM node:23-alpine AS production

# Enable Corepack
RUN corepack enable

# Install runtime-only dependencies
RUN apk add --no-cache sqlite curl dcron

# Set working directory
WORKDIR /app

# Create data folder
RUN mkdir -p /data

# Copy app from build stage
COPY --from=builder /app ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_PATH=/data/db.sqlite

# Fix permissions
RUN chown node:node /app/entrypoint.sh && chmod +x /app/entrypoint.sh
RUN chown -R node:node /app /data

# Expose port
EXPOSE 3000

# Run as non-root
USER node

# Entrypoint
ENTRYPOINT ["/app/entrypoint.sh"]
