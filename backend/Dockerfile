# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev deps for ts-node, seeds)
RUN npm ci && npm cache clean --force

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Copy source files (needed for seeds and migrations)
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "dist/main"]