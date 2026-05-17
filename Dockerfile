# Étape de build
FROM node:20-alpine AS builder

# Installation des dépendances système nécessaires
RUN apk add --no-cache libc6-compat

# Définition du répertoire de travail
WORKDIR /app

# Copie des fichiers de configuration
COPY package.json bun.lockb* ./

# Installation des dépendances avec bun
RUN npm install -g bun && \
    bun install --frozen-lockfile

# Copie du code source
COPY . .

RUN bun run prettier:check

RUN bun run prettier --write
# Build de l'application Next.js
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN bun run build

# Étape de production (runtime)
FROM node:20-alpine AS runner

# Installation de dumb-init pour une gestion correcte des processus
RUN apk add --no-cache dumb-init

# Création d'un utilisateur non-root pour la sécurité
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Définition du répertoire de travail
WORKDIR /app

# Configuration de l'environnement
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copie des fichiers nécessaires depuis l'étape de build
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Changement vers l'utilisateur non-root
USER nextjs

# Exposition du port
EXPOSE 7500

# Healthcheck pour vérifier que l'application fonctionne
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:7500/api/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))" || exit 1

# Démarrage de l'application avec dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
