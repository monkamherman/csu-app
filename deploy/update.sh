#!/bin/bash

# Script de mise à jour manuelle sur le VPS
# Usage: ./deploy/update.sh [tag]

set -e

# Configuration
PROJECT_NAME="tailnext"
DEPLOY_DIR="/opt/$PROJECT_NAME"
REGISTRY="ghcr.io"
IMAGE="ghcr.io/ton-user/tailnext"
TAG="${1:-latest}"

echo "🔄 Mise à jour de $PROJECT_NAME vers $TAG"

cd $DEPLOY_DIR

# Pull de la nouvelle image
echo "📥 Pull de l'image $IMAGE:$TAG"
docker pull $IMAGE:$TAG

# Mise à jour du docker-compose.yml
if [ -f docker-compose.yml ]; then
    sed -i "s|image:.*|image: $IMAGE:$TAG|" docker-compose.yml
fi

# Arrêt des conteneurs existants
echo "🛑 Arrêt des conteneurs..."
docker-compose down --remove-orphans

# Nettoyage
echo "🧹 Nettoyage des images..."
docker image prune -af --filter "until=168h"

# Démarrage
echo "▶️ Démarrage..."
docker-compose up -d --remove-orphans

# Healthcheck
echo "🏥 Vérification..."
sleep 10
for i in {1..5}; do
    if curl -sf http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Application healthy!"
        exit 0
    fi
    echo "⏳ Tentative $i/5..."
    sleep 5
done

echo "❌ Healthcheck failed"
docker-compose logs --tail=50
exit 1
