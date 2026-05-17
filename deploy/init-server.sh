#!/bin/bash

# Script de déploiement initial sur VPS
# Usage: ./deploy/init-server.sh

set -e

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="tailnext"
DEPLOY_DIR="/opt/$PROJECT_NAME"
DOCKER_NETWORK="tailnext-network"

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérification des privilèges root
if [ "$EUID" -ne 0 ]; then
    log_error "Ce script doit être exécuté en tant que root (sudo)"
    exit 1
fi

log_info "🚀 Initialisation du serveur pour $PROJECT_NAME"

# Mise à jour du système
log_info "Mise à jour du système..."
apt-get update && apt-get upgrade -y

# Installation des dépendances
log_info "Installation des dépendances..."
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    software-properties-common \
    git \
    ufw \
    fail2ban \
    certbot \
    python3-certbot-nginx

# Installation de Docker si non présent
if ! command -v docker &> /dev/null; then
    log_info "Installation de Docker..."
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
fi

# Installation de Docker Compose (standalone)
if ! command -v docker-compose &> /dev/null; then
    log_info "Installation de Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Configuration de Docker pour démarrage automatique
log_info "Configuration de Docker..."
systemctl enable docker
systemctl start docker

# Création de l'utilisateur de déploiement
DEPLOY_USER="deploy"
if ! id "$DEPLOY_USER" &>/dev/null; then
    log_info "Création de l'utilisateur de déploiement..."
    useradd -m -s /bin/bash $DEPLOY_USER
    usermod -aG docker $DEPLOY_USER
fi

# Création du répertoire de déploiement
log_info "Création du répertoire de déploiement..."
mkdir -p $DEPLOY_DIR
chown -R $DEPLOY_USER:$DEPLOY_USER $DEPLOY_DIR
chmod 755 $DEPLOY_DIR

# Configuration du pare-feu
log_info "Configuration du pare-feu..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable

# Configuration de fail2ban
log_info "Configuration de fail2ban..."
cat > /etc/fail2ban/jail.local <<EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
EOF
systemctl restart fail2ban

# Configuration des logs Docker
log_info "Configuration de la rotation des logs Docker..."
cat > /etc/docker/daemon.json <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2"
}
EOF
systemctl restart docker

# Création du script de backup
log_info "Configuration des backups..."
mkdir -p /opt/backups
cat > /opt/backups/backup-$PROJECT_NAME.sh <<'EOF'
#!/bin/bash
BACKUP_DIR="/opt/backups"
PROJECT_NAME="tailnext"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup des volumes Docker
docker run --rm \
  -v ${PROJECT_NAME}_app-logs:/data/logs:ro \
  -v $BACKUP_DIR:/backups \
  alpine:latest \
  tar czf /backups/${PROJECT_NAME}_logs_${DATE}.tar.gz -C /data logs

# Suppression des backups vieux de plus de 30 jours
find $BACKUP_DIR -name "${PROJECT_NAME}_*.tar.gz" -mtime +30 -delete

echo "Backup completed: ${PROJECT_NAME}_${DATE}.tar.gz"
EOF
chmod +x /opt/backups/backup-$PROJECT_NAME.sh

# Crontab pour backups automatiques
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/backups/backup-$PROJECT_NAME.sh >> /var/log/backup-$PROJECT_NAME.log 2>&1") | crontab -

# Installation de logrotate pour les logs applicatifs
log_info "Configuration de logrotate..."
cat > /etc/logrotate.d/$PROJECT_NAME <<EOF
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    missingok
    delaycompress
    copytruncate
}
EOF

# Configuration des limites système pour Docker
log_info "Configuration des limites système..."
cat >> /etc/sysctl.conf <<EOF
# Augmentation des limites pour Docker
net.ipv4.ip_forward=1
net.bridge.bridge-nf-call-iptables=1
net.bridge.bridge-nf-call-ip6tables=1
EOF
sysctl -p

log_info "✅ Configuration du serveur terminée!"
log_info ""
log_info "Prochaines étapes:"
log_info "1. Copiez docker-compose.yml dans $DEPLOY_DIR"
log_info "2. Configurez les secrets GitHub (VPS_HOST, VPS_USER, VPS_SSH_KEY)"
log_info "3. Poussez sur main pour déclencher le déploiement"
log_info ""
log_info "Commandes utiles:"
log_info "  - Voir les logs: docker-compose -f $DEPLOY_DIR/docker-compose.yml logs -f"
log_info "  - Redémarrer: docker-compose -f $DEPLOY_DIR/docker-compose.yml restart"
log_info "  - Mettre à jour manuellement: docker-compose -f $DEPLOY_DIR/docker-compose.yml pull && docker-compose -f $DEPLOY_DIR/docker-compose.yml up -d"
