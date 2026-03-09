# ------------------------------
# 1. Install dependencies
# ------------------------------
FROM node:20-alpine
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Copy everything else
COPY . .

# Setting proper environment
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

USER root

# Expose port
EXPOSE 3000

# Script to setup DB, build the app, and start it
CMD ["sh", "-c", "npm run db:setup && npm run build && npm run start"]