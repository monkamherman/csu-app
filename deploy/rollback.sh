#!/bin/bash

# Script de rollback en cas de problème
# Usage: ./deploy/rollback.sh [tag-precedent]

set -e

PROJECT_NAME="tailnext"
DEPLOY_DIR="/opt/$PROJECT_NAME"
REGISTRY="ghcr.io"
IMAGE="ghcr.io/ton-user/tailnext"

# Liste des images disponibles
echo "📋 Images disponibles:"
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.CreatedAt}}" | grep $IMAGE | head -10

# Tag spécifique ou interaction
if [ -z "$1" ]; then
    echo ""
    read -p "Entrez le tag à restaurer: " TAG
else
    TAG="$1"
fi

echo "🔄 Rollback vers $TAG"

cd $DEPLOY_DIR

# Vérifier si l'image existe localement
if ! docker images | grep "$IMAGE" | grep -q "$TAG"; then
    echo "📥 Pull de l'image..."
    docker pull $IMAGE:$TAG
fi

# Arrêt et redémarrage
docker-compose down
docker-compose up -d

echo "✅ Rollback terminé"
docker-compose ps
