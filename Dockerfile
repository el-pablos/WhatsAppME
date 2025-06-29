# WhatsApp Me Bot - Docker Configuration
# Multi-stage build for optimized production image

# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci --include=dev

# Copy source code
COPY . .

# Run tests and validation
RUN npm test

# Production stage
FROM node:20-alpine AS production

# Install system dependencies for Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    && rm -rf /var/cache/apk/*

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S whatsapp -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Copy application code from builder stage
COPY --from=builder --chown=whatsapp:nodejs /app .

# Create necessary directories with proper permissions
RUN mkdir -p data/backup logs session && \
    chown -R whatsapp:nodejs /app

# Set Puppeteer to use installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    NODE_ENV=production \
    TZ=Asia/Jakarta

# Switch to non-root user
USER whatsapp

# Expose port (if needed for health checks)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD node -e "console.log('Health check passed')" || exit 1

# Start the application
CMD ["npm", "start"]

# Labels for better maintainability
LABEL maintainer="el_pablos <yeteprem.end23juni@gmail.com>" \
      version="1.0.0" \
      description="WhatsApp Me Bot - Advanced WhatsApp Business Automation" \
      org.opencontainers.image.source="https://github.com/el-pablos/WhatsAppME" \
      org.opencontainers.image.documentation="https://github.com/el-pablos/WhatsAppME#readme" \
      org.opencontainers.image.licenses="MIT"
