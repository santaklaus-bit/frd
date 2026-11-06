FROM node:24-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY next.config.ts tsconfig.json postcss.config.mjs ./
COPY src ./src
COPY public ./public
ARG NEXT_PUBLIC_SITE_URL=https://opuscrp.com
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV OPUS_DATA_DIR=/app/var/opus
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY scripts/create-opus-admin.mjs ./scripts/create-opus-admin.mjs
COPY scripts/create-team-accounts.mjs ./scripts/create-team-accounts.mjs
RUN mkdir -p /app/var/opus && chown -R node:node /app/var
USER node
EXPOSE 3000
CMD ["npm", "start"]
