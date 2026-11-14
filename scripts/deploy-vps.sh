#!/bin/bash
# Deploy der Demo auf den VPS.
# Verwendung: bash scripts/deploy-vps.sh
#
# Der Server baut nichts: er zieht die Images, die die CI nach jedem Push
# auf main nach GHCR legt, und startet sie mit den Grenzen aus der
# Compose-Datei. Vorher also pushen und den CI-Lauf abwarten.

set -euo pipefail

VPS="${VPS:-root@69.62.121.168}"

ssh "$VPS" bash -s <<'REMOTE'
set -euo pipefail
cd /opt/iam-showcase-keycloak

git fetch --quiet origin main
git reset --quiet --hard origin/main
echo "Stand: $(git log --oneline -1)"

# Geheimnisse entstehen einmalig auf dem Server und verlassen ihn nicht.
if [ ! -f .env ]; then
  umask 077
  cat > .env <<EOF
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=$(openssl rand -hex 24)
KC_DB_PASSWORD=$(openssl rand -hex 24)
APP_DB_PASSWORD=$(openssl rand -hex 24)
KEYCLOAK_ADMIN_CLIENT_SECRET=$(openssl rand -hex 24)
EOF
  echo ".env neu angelegt"
fi

dc() {
  docker compose --env-file .env \
    -f docker/docker-compose.yml -f docker/docker-compose.prod.yml "$@"
}

dc pull --quiet
dc up -d --no-build --wait --wait-timeout 300

for i in $(seq 1 30); do
  if curl -sf http://127.0.0.1:9080/api/v1/public/health > /dev/null; then
    echo "Backend antwortet."
    docker image prune -f > /dev/null
    docker stats --no-stream --format 'table {{.Name}}\t{{.MemUsage}}\t{{.CPUPerc}}' \
      iam-postgres iam-keycloak iam-backend iam-frontend
    exit 0
  fi
  sleep 5
done

echo "Backend antwortet nicht:" >&2
docker logs iam-backend --tail 50 >&2
exit 1
REMOTE

echo "Frontend: https://iam-demo.celox.io"
echo "Keycloak: https://auth.iam-demo.celox.io"
