#!/bin/bash
# Deploy-Skript fuer VPS (69.62.121.168)
# Verwendung: bash scripts/deploy-vps.sh

set -euo pipefail

VPS_HOST="69.62.121.168"
VPS_USER="deploy"
PROJECT_DIR="/opt/iam-showcase-keycloak"

echo "=== IAM Showcase Deploy ==="

echo "[1/5] Dateien synchronisieren..."
rsync -avz --exclude '.git' --exclude 'node_modules' --exclude 'target' \
  . "${VPS_USER}@${VPS_HOST}:${PROJECT_DIR}/"

echo "[2/5] Services neu bauen und starten..."
ssh "${VPS_USER}@${VPS_HOST}" "cd ${PROJECT_DIR} && \
  docker compose -f docker/docker-compose.yml -f docker/docker-compose.prod.yml up -d --build"

echo "[3/5] Warten auf Keycloak..."
sleep 30

echo "[4/5] Health Check..."
ssh "${VPS_USER}@${VPS_HOST}" "curl -sf http://localhost:8080/api/v1/public/health"
echo ""

echo "[5/5] Nginx konfigurieren..."
ssh "${VPS_USER}@${VPS_HOST}" "sudo cp ${PROJECT_DIR}/infrastructure/nginx/iam-demo-https.conf /etc/nginx/sites-available/iam-demo.conf && \
  sudo ln -sf /etc/nginx/sites-available/iam-demo.conf /etc/nginx/sites-enabled/ && \
  sudo nginx -t && sudo systemctl reload nginx"

echo "=== Deployment abgeschlossen ==="
echo "Frontend: https://iam-demo.celox.io"
echo "Keycloak: https://auth.iam-demo.celox.io"
