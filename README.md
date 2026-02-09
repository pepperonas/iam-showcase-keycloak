# IAM Showcase Keycloak

[![CI](https://github.com/pepperonas/iam-showcase-keycloak/actions/workflows/ci.yml/badge.svg)](https://github.com/pepperonas/iam-showcase-keycloak/actions/workflows/ci.yml)
![Java 21](https://img.shields.io/badge/Java-21-orange)
![Spring Boot 3.3](https://img.shields.io/badge/Spring%20Boot-3.3-green)
![React 18](https://img.shields.io/badge/React-18-blue)
![Keycloak 24](https://img.shields.io/badge/Keycloak-24-red)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow)

**Live Demo:** [https://iam-demo.celox.io](https://iam-demo.celox.io)

Ein vollstaendiges Identity & Access Management Showcase-Projekt, das Keycloak-basiertes SSO, OAuth2/OIDC, SAML2, RBAC und 2FA (TOTP) in einer modernen Architektur demonstriert.

## Demo-Credentials

| User | Passwort | Rollen |
|------|----------|--------|
| `admin@demo.celox.io` | `Admin123` | admin, api-admin, api-write, api-read |
| `manager@demo.celox.io` | `Manager123` | manager, api-write, api-read |
| `user@demo.celox.io` | `User1234` | user, api-read |
| `viewer@demo.celox.io` | `Viewer123` | viewer |

## Architektur

```
Browser --> React SPA (OIDC/PKCE) --> Keycloak (Auth)
                |
                v
         Spring Boot API (JWT Validation) --> PostgreSQL
                |
                v
         Keycloak Admin API (User/Role Management)
```

## Tech-Stack

- **Identity Provider:** Keycloak 24 (OAuth2, OIDC, SAML2, TOTP)
- **Backend:** Spring Boot 3.3, Java 21, Spring Security OAuth2 Resource Server
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Datenbank:** PostgreSQL 16
- **Infrastruktur:** Docker Compose, Helm Charts, GitHub Actions
- **Testing:** JUnit 5, Mockito, EasyMock, Testcontainers, Vitest

## Quick Start

```bash
# Repository klonen
git clone https://github.com/pepperonas/iam-showcase-keycloak.git
cd iam-showcase-keycloak

# Alle Services starten
docker compose -f docker/docker-compose.yml up -d

# Warten bis Keycloak bereit ist (~30s)
# Frontend: http://localhost:5173
# Backend API: http://localhost:8080/api/v1/public/health
# Keycloak: http://localhost:8180
```

## Dokumentation

- [Architektur](docs/ARCHITECTURE.md)
- [Security-Konzepte](docs/SECURITY.md)
- [API-Referenz](docs/API.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Keycloak Setup](docs/KEYCLOAK_SETUP.md)
- [Testing](docs/TESTING.md)
- [Showcase Features](docs/SHOWCASE.md)

## Lizenz

MIT License - (c) 2026 Martin Pfeffer | [celox.io](https://celox.io)
