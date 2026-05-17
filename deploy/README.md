# Déploiement VPS - Documentation Complète

Configuration complète de déploiement CI/CD pour TailNext sur VPS avec Nginx, Docker et GitHub Actions.

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐
│   GitHub    │────▶│  Registry   │────▶│      VPS        │
│   (push)    │     │  (ghcr.io)  │     │                 │
└─────────────┘     └─────────────┘     │  ┌───────────┐  │
                                        │  │   Nginx   │  │
                                        │  │  (80/443) │  │
                                        │  └─────┬─────┘  │
                                        │        │         │
                                        │  ┌─────▼─────┐  │
                                        │  │  Docker   │  │
                                        │  │  (3000)   │  │
                                        │  └───────────┘  │
                                        │                 │
                                        │  Volumes pers.  │
                                        └─────────────────┘
```

## Fichiers Créés

| Fichier                        | Description                            |
| ------------------------------ | -------------------------------------- |
| `Dockerfile`                   | Build multi-stage de l'image Docker    |
| `docker-compose.yml`           | Orchestration des conteneurs           |
| `.github/workflows/deploy.yml` | Workflow CI/CD GitHub Actions          |
| `deploy/init-server.sh`        | Script d'initialisation du VPS         |
| `deploy/update.sh`             | Script de mise à jour manuelle         |
| `deploy/rollback.sh`           | Script de rollback                     |
| `deploy/nginx.conf`            | Configuration Nginx reverse proxy      |
| `.env.example`                 | Template des variables d'environnement |

## Prérequis

- VPS avec Ubuntu 20.04+ ou Debian 11+
- Nginx déjà installé et configuré
- Nom de domaine pointant vers le VPS
- Compte GitHub avec accès au repository

## Setup Initial

### 1. Configuration du VPS

Connectez-vous en SSH et exécutez le script d'initialisation :

```bash
# Copiez le script sur le VPS
scp deploy/init-server.sh root@votre-vps-ip:/root/

# Connectez-vous et exécutez
ssh root@votre-vps-ip
chmod +x /root/init-server.sh
./init-server.sh
```

Ce script installe automatiquement :

- Docker & Docker Compose
- Fail2ban (sécurité)
- UFW (pare-feu)
- Configuration des backups automatiques

### 2. Configuration Nginx

Éditez le fichier `deploy/nginx.conf` et remplacez :

- `example.com` par votre nom de domaine
- Ajustez les chemins SSL si nécessaire

Déployez la configuration :

```bash
# Sur le VPS
cp deploy/nginx.conf /etc/nginx/sites-available/tailnext
ln -s /etc/nginx/sites-available/tailnext /etc/nginx/sites-enabled/

# Testez la configuration
nginx -t

# Rechargez Nginx
systemctl reload nginx
```

### 3. Certificat SSL (Let's Encrypt)

```bash
# Installation automatique
certbot --nginx -d example.com -d www.example.com

# Renouvellement automatique (déjà configuré par certbot)
```

### 4. Configuration GitHub Secrets

Dans votre repository GitHub (Settings > Secrets and variables > Actions) :

**Secrets (Secrets and variables > Secrets) :**

| Secret        | Description                 | Exemple         |
| ------------- | --------------------------- | --------------- |
| `VPS_HOST`    | IP ou nom de domaine du VPS | `123.456.789.0` |
| `VPS_USER`    | Utilisateur SSH             | `deploy`        |
| `VPS_SSH_KEY` | Clé SSH privée              | `-----BEGIN...` |
| `VPS_PORT`    | Port SSH (optionnel)        | `22`            |

**Variables (Secrets and variables > Variables) :**

| Variable | Description               | Exemple       |
| -------- | ------------------------- | ------------- |
| `DOMAIN` | Nom de domaine pour l'URL | `example.com` |

#### Génération de la clé SSH pour le déploiement

```bash
# Sur votre machine locale
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github-actions

# Copiez la clé publique sur le VPS
ssh-copy-id -i ~/.ssh/github-actions.pub deploy@votre-vps-ip

# Ajoutez la clé privée dans GitHub Secrets (VPS_SSH_KEY)
cat ~/.ssh/github-actions
```

### 5. Première Configuration Docker Compose sur le VPS

```bash
# Sur le VPS, en tant qu'utilisateur deploy
sudo mkdir -p /opt/tailnext
sudo chown deploy:deploy /opt/tailnext

# Copiez le docker-compose.yml
cp docker-compose.yml /opt/tailnext/

# Créez le fichier .env
nano /opt/tailnext/.env
```

Contenu minimal du `.env` :

```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://example.com
```

### 6. Premier Déploiement Manuel (Optionnel)

```bash
cd /opt/tailnext

# Build local (ou pull depuis ghcr.io)
docker-compose up -d
```

## Workflow CI/CD

### Déclenchement Automatique

Le déploiement se déclenche automatiquement sur :

- Push sur `main` ou `master`
- Merge de pull request

### Étapes du Pipeline

1. **Tests & Lint** - Vérifie la qualité du code
2. **Build Docker** - Crée et pousse l'image sur ghcr.io
3. **Déploiement VPS** - SSH vers le VPS, pull et restart

### Déploiement Manuel

```bash
# Sur le VPS
cd /opt/tailnext
./deploy/update.sh latest
```

## Stockage & Persistance

### Volumes Docker Configurés

| Volume           | Description           | Emplacement        |
| ---------------- | --------------------- | ------------------ |
| `app-logs`       | Logs de l'application | `/app/logs`        |
| `app-cache`      | Cache Next.js         | `/app/.next/cache` |
| `backup-storage` | Backups automatiques  | `/backups`         |

### Backup Automatique

Les backups sont configurés automatiquement via cron :

- **Fréquence** : Tous les jours à 2h du matin
- **Rétention** : 30 jours
- **Emplacement** : `/opt/backups/`

Backup manuel :

```bash
cd /opt/tailnext
docker-compose --profile backup run backup
tar czf backup-manuel-$(date +%Y%m%d).tar.gz /var/lib/docker/volumes/tailnext_*
```

### Restauration

```bash
# Liste des backups disponibles
ls -la /opt/backups/

# Restauration
cd /opt/tailnext
docker-compose down
tar xzf /opt/backups/tailnext_logs_20240301_020000.tar.gz -C /
docker-compose up -d
```

## Maintenance & Monitoring

### Commandes Utiles

```bash
# Voir les logs en temps réel
docker-compose logs -f app

# Voir les stats des conteneurs
docker stats

# Redémarrer l'application
docker-compose restart app

# Mettre à jour l'image
docker-compose pull && docker-compose up -d

# Nettoyer les volumes non utilisés
docker volume prune
```

### Healthcheck

L'application expose un endpoint de healthcheck :

```bash
curl http://localhost:3000/api/health
```

### Monitoring avec les Logs

```bash
# Logs Nginx
sudo tail -f /var/log/nginx/tailnext-access.log
sudo tail -f /var/log/nginx/tailnext-error.log

# Logs applicatifs
docker-compose logs -f --tail=100 app
```

## Rollback

En cas de problème après un déploiement :

```bash
# Méthode 1: Script de rollback
cd /opt/tailnext
./deploy/rollback.sh

# Méthode 2: Manuel
docker-compose down
docker images  # Notez le tag précédent
docker tag IMAGE_ID:TAG_PREVIOUS tailnext-app:latest
docker-compose up -d
```

## Sécurité

### Mesures en Place

1. **Utilisateur non-root** dans le conteneur Docker
2. **UFW** - Pare-feu configuré (ports 22, 80, 443 uniquement)
3. **Fail2ban** - Protection contre les attaques par force brute
4. **Headers de sécurité** - X-Frame-Options, X-Content-Type-Options, etc.
5. **SSL/TLS** - Configuration moderne avec Let's Encrypt
6. **Rotation des logs** - Limitation de l'espace disque
7. **Scan de vulnérabilités** - Via Docker Scout (optionnel)

### Mise à Jour de Sécurité

```bash
# Mise à jour des paquets système
sudo apt-get update && sudo apt-get upgrade -y

# Mise à jour des images Docker
docker-compose pull
docker-compose up -d

# Vérification des CVE
sudo apt-get install docker-scan-plugin
docker scan ghcr.io/user/tailnext:latest
```

## Troubleshooting

### Problèmes Courants

**L'application ne démarre pas**

```bash
# Vérifier les logs
docker-compose logs app

# Vérifier les variables d'environnement
docker-compose exec app env
```

**Nginx erreur 502 Bad Gateway**

```bash
# Vérifier que l'app écoute sur le bon port
docker-compose ps
curl http://localhost:3000

# Vérifier la config Nginx
nginx -t
```

**Erreur de permission**

```bash
# Fixer les permissions
docker-compose down
sudo chown -R 1001:1001 /var/lib/docker/volumes/tailnext_*
docker-compose up -d
```

**Déploiement GitHub Actions échoue**

```bash
# Vérifier les secrets GitHub
# Vérifier la connexion SSH manuellement
ssh -i ~/.ssh/github-actions deploy@votre-vps-ip

# Vérifier les logs sur le VPS
sudo journalctl -u docker
```

### Nettoyage de l'Espace Disque

```bash
# Supprimer les images non utilisées
docker image prune -af

# Supprimer les volumes orphelins
docker volume prune -f

# Supprimer les conteneurs arrêtés
docker container prune -f

# Nettoyer le cache de build
docker builder prune -f
```

## Personnalisation

### Variables d'Environnement Additionnelles

Créez un fichier `.env` dans `/opt/tailnext/` :

```bash
# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Feature flags
NEXT_PUBLIC_FEATURE_BLOG=true

# API externes
API_SECRET_KEY=your_secret
```

### Configuration Multi-Environnement

Pour staging et production :

```bash
# Créer des fichiers compose séparés
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Monitoring Avancé (Optionnel)

Installation de Netdata ou Prometheus/Grafana :

```bash
# Netdata (rapide)
bash <(curl -Ss https://my-netdata.io/kickstart.sh)
```

## Contact & Support

En cas de problème :

1. Consultez les logs : `docker-compose logs`
2. Vérifiez la santé : `curl localhost:3000/api/health`
3. Vérifiez Nginx : `nginx -t && systemctl status nginx`

---

**Note** : Adaptez les chemins et noms selon votre configuration spécifique.

# Configuration de déploiement ajoutée
