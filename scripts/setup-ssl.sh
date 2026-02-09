#!/bin/bash
# SSL-Zertifikat mit Let's Encrypt einrichten
# Verwendung: sudo bash scripts/setup-ssl.sh

set -euo pipefail

DOMAINS="-d iam-demo.celox.io -d auth.iam-demo.celox.io"
EMAIL="admin@celox.io"

echo "=== SSL Setup mit Let's Encrypt ==="

# Certbot installieren (falls nicht vorhanden)
if ! command -v certbot &> /dev/null; then
    echo "Certbot installieren..."
    apt-get update
    apt-get install -y certbot python3-certbot-nginx
fi

# Zertifikat beantragen
echo "Zertifikat beantragen..."
certbot --nginx ${DOMAINS} --email ${EMAIL} --agree-tos --non-interactive

# Auto-Renewal pruefen
echo "Auto-Renewal testen..."
certbot renew --dry-run

echo "=== SSL Setup abgeschlossen ==="
