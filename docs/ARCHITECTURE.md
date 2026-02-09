# Architektur

## Uebersicht

```
                    +-------------------+
                    |     Browser       |
                    +--------+----------+
                             |
                    OIDC/PKCE Auth Flow
                             |
              +--------------+--------------+
              |                             |
    +---------v----------+       +----------v---------+
    |    React SPA       |       |     Keycloak       |
    |  (Vite + TS + TW)  |       |  (Auth Server)     |
    |  Port 5173/80      |       |  Port 8180         |
    +---------+----------+       +----------+----------+
              |                             |
         Bearer JWT                    JDBC (Realm DB)
              |                             |
    +---------v----------+       +----------v---------+
    |  Spring Boot API   |       |  PostgreSQL        |
    |  (Resource Server) |       |  (Keycloak DB)     |
    |  Port 8080         |       |  Port 5432         |
    +---------+----------+       +--------------------+
              |
           JDBC
              |
    +---------v----------+
    |  PostgreSQL        |
    |  (App DB)          |
    |  Port 5432         |
    +--------------------+
```

## Komponenten

### Keycloak (Identity Provider)
- **Realm:** `iam-showcase`
- **Protokolle:** OIDC, SAML 2.0
- **Features:** SSO, RBAC, TOTP/2FA, Brute-Force-Schutz
- **Custom SPI:** Audit Event Listener fuer strukturiertes Logging

### Spring Boot Backend (Resource Server)
- **Security:** OAuth2 Resource Server mit JWT-Validierung
- **JWT Converter:** Extrahiert Realm- und Client-Rollen
- **API:** RESTful mit Versionierung (`/api/v1/`)
- **Persistenz:** JPA + Flyway Migration

### React Frontend (SPA)
- **Auth:** OIDC Authorization Code + PKCE via `react-oidc-context`
- **Routing:** React Router v6 mit rollenbasierten Guards
- **API:** Axios mit Token-Interceptor

### Datenfluss: Login
1. User klickt "Anmelden" im SPA
2. SPA generiert `code_verifier` + `code_challenge` (PKCE)
3. Redirect zu Keycloak mit `code_challenge`
4. User authentifiziert sich (Passwort + optional TOTP)
5. Keycloak redirectet mit Authorization Code
6. SPA tauscht Code + `code_verifier` gegen Tokens
7. Access Token (JWT) wird fuer API-Calls verwendet

### Datenfluss: API-Call
1. SPA sendet Request mit `Authorization: Bearer <JWT>`
2. Spring Security validiert JWT-Signatur via JWKS
3. `KeycloakJwtConverter` extrahiert Rollen
4. RBAC-Check gegen `SecurityConfig`
5. Response wird zurueckgegeben

## Deployment-Optionen

| Umgebung | Methode | Config |
|----------|---------|--------|
| Lokal | Docker Compose | `docker/docker-compose.yml` |
| VPS | Docker Compose + Nginx | `docker-compose.prod.yml` |
| Kubernetes | Helm Chart | `helm/iam-showcase/` |

(c) 2026 Martin Pfeffer | celox.io
