# ------------------------------
# 1. Builder — installe et compile
# ------------------------------
FROM node:22-alpine AS builder
WORKDIR /app

# Copie des fichiers de dépendances en premier (cache Docker)
COPY package.json package-lock.json* source.config.ts ./
RUN npm install --legacy-peer-deps

# Copie du reste du code
COPY . .

# Variables d'env nécessaires au build
ARG NEXT_PUBLIC_SITE_URL=https://monsieurdanko.com
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NODE_ENV=production

# Build Next.js uniquement (sans init DB — pas de MySQL pendant le build)
RUN npm run build:next

# ------------------------------
# 2. Runner — image finale légere
# ------------------------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json* ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/.sequelizerc ./.sequelizerc
COPY --from=builder /app/source.config.ts ./source.config.ts
COPY --from=builder /app/.source ./.source

USER root

EXPOSE 3000

# Traefik attend que l'app soit prete avant de router
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

# Au demarrage : migration DB + lancement (plus de build ici)
CMD ["sh", "-c", "npm run db:setup && npm run start"]
