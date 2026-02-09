# Deployment Guide

## Lokale Entwicklung (Docker Compose)

```bash
# Alle Services starten
docker compose -f docker/docker-compose.yml up -d

# Status pruefen
docker compose -f docker/docker-compose.yml ps

# Logs anzeigen
docker compose -f docker/docker-compose.yml logs -f keycloak

# Services stoppen
docker compose -f docker/docker-compose.yml down
```

**URLs:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api/v1/public/health
- Keycloak: http://localhost:8180 (Admin: admin/admin)
- Swagger UI: http://localhost:8080/swagger-ui.html

## VPS Deployment (Produktion)

### Voraussetzungen
- VPS mit Docker + Docker Compose
- DNS: `iam-demo.celox.io` + `auth.iam-demo.celox.io` -> VPS IP
- SSH-Zugang

### Deployment
```bash
# Auf VPS: Repository klonen
git clone https://github.com/pepperonas/iam-showcase-keycloak.git /opt/iam-showcase-keycloak
cd /opt/iam-showcase-keycloak

# .env erstellen (basierend auf .env.example)
cp .env.example .env
# Sichere Passwoerter setzen!

# Starten mit Produktion-Overrides
docker compose -f docker/docker-compose.yml -f docker/docker-compose.prod.yml up -d

# SSL einrichten
sudo bash scripts/setup-ssl.sh
```

## Kubernetes (Helm)

```bash
# Helm Chart installieren
helm install iam-showcase helm/iam-showcase/ -n iam-showcase --create-namespace

# Produktion
helm install iam-showcase helm/iam-showcase/ -f helm/iam-showcase/values-prod.yaml

# Lint pruefen
helm lint helm/iam-showcase/

# Template rendern
helm template iam-showcase helm/iam-showcase/
```

(c) 2026 Martin Pfeffer | celox.io
