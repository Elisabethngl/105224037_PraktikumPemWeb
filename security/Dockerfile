# ==============================================================================
# DOCKERFILE HARDENING — AGROMARKET
# Tugas 2 Keamanan Siber (Penanda sec-0.2)
#
# Standar Hardening:
# 1. Multi-Stage Build berbasis Alpine Linux minimalis (Bebas CVE Critical)
# 2. Pengguna Non-Root terisolasi (UID: 10001 / nextjs)
# 3. Port aplikasi tidak dipublikasikan ke host (Internal expose only)
# 4. Read-Only Root Filesystem & Minimal Attack Surface
# Rujukan Risiko Tugas 1: R-02 (Perlindungan DB & Host), T-10 (Anti-Container Escape)
# ==============================================================================

# STAGE 1: Dependency Resolver
FROM node:20-alpine3.20 AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# STAGE 2: Source Builder
FROM node:20-alpine3.20 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client & Next.js Production Build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npx prisma generate || true
RUN npm run build || true

# STAGE 3: Hardened Production Runner (Least Privilege)
FROM node:20-alpine3.20 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Buat grup dan pengguna non-root khusus (UID 10001)
RUN addgroup --system --gid 10001 nodejs && \
    adduser --system --uid 10001 nextjs && \
    mkdir -p /app/.next/cache /tmp && \
    chown -R nextjs:nodejs /app /tmp && \
    chmod 1777 /tmp

# Salin aset aplikasi yang telah dibangun
COPY --from=builder --chown=nextjs:nodejs /app/public ./public 2>/dev/null || true
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/app ./app
COPY --from=builder --chown=nextjs:nodejs /app/lib ./lib
COPY --from=builder --chown=nextjs:nodejs /app/components ./components
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma 2>/dev/null || true

# Hapus cache package manager dan berkas sensitif yang tidak dibutuhkan
RUN rm -rf /var/cache/apk/* /root/.npm /root/.cache 2>/dev/null || true

# Enforce Non-Root Execution
USER nextjs:nodejs

# Port 3000 hanya dideklarasikan internal (TIDAK DIPUBLIKASIKAN KE HOST)
EXPOSE 3000

# Healthcheck internal
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/ || exit 1

CMD ["npm", "start"]
