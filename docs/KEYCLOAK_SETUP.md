# Keycloak Konfiguration

## Realm: iam-showcase

### Clients

| Client | Typ | Protokoll | Zweck |
|--------|-----|-----------|-------|
| `iam-frontend` | Public | OIDC | React SPA (PKCE) |
| `iam-backend` | Confidential | OIDC | Spring Boot Resource Server |
| `iam-saml-client` | SAML | SAML 2.0 | Konzept-Demo |

### Rollen-Modell

**Realm-Rollen:** admin, manager, user, viewer

**Client-Rollen (iam-backend):** api-read, api-write, api-admin

### Demo-Benutzer

| User | Realm-Rollen | Client-Rollen |
|------|-------------|---------------|
| admin@demo.celox.io | admin | api-admin, api-write, api-read |
| manager@demo.celox.io | manager | api-write, api-read |
| user@demo.celox.io | user | api-read |
| viewer@demo.celox.io | viewer | - |

### Sicherheits-Konfiguration

- **Password Policy:** min 8 Zeichen, 1 Grossbuchstabe, 1 Ziffer
- **OTP:** TOTP, 6 Stellen, 30 Sekunden
- **Brute Force:** Aktiv, max 5 Fehlversuche, 15 Min Sperre
- **Token Lifetimes:** Access 5min, Refresh 30min, SSO 8h

### Custom SPI: Audit Event Listener
- Provider-ID: `celox-audit-listener`
- Loggt: LOGIN, LOGOUT, REGISTER, ERROR Events
- Format: Strukturiertes JSON
- Deployment: JAR in `/opt/keycloak/providers/`

(c) 2026 Martin Pfeffer | celox.io
