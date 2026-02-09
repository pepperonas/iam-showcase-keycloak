# Showcase Features - Demonstrierte Kompetenzen

## Skills-Matrix

| Kompetenz | Implementierung | Dateien |
|-----------|----------------|---------|
| **Keycloak Administration** | Realm-Konfiguration, Clients, Rollen, Users, Policies | `keycloak/realm-export.json` |
| **OAuth2 / OIDC** | Authorization Code + PKCE, JWT-Validierung, Token-Inspection | `SecurityConfig.java`, `KeycloakJwtConverter.java`, `AuthProvider.tsx` |
| **SAML 2.0** | Keycloak SAML-Client, SP Metadata Endpoint | `realm-export.json` (iam-saml-client), `SamlController.java` |
| **RBAC** | Realm- + Client-Rollen, URL-basierte Zugriffssteuerung | `SecurityConfig.java`, `ProtectedRoute.tsx` |
| **2FA / MFA** | TOTP Konfiguration (6 Digits, 30s) | `realm-export.json` (OTP Policy) |
| **SSO** | Session-Management, Token-Lifetimes | Keycloak-Konfiguration |
| **Custom SPI** | Event Listener mit strukturiertem Audit-Logging | `AuditEventListenerProvider.java` |
| **Spring Security** | OAuth2 Resource Server, Method Security | `SecurityConfig.java` |
| **React + OIDC** | SPA mit PKCE, rollenbasierte UI | `useAuth.ts`, `Sidebar.tsx` |
| **API Design** | RESTful, Versioniert, Swagger/OpenAPI | Controller-Layer |
| **Testing** | Mockito, EasyMock, Testcontainers, Vitest | `*Test.java`, `*.test.tsx` |
| **Docker** | Multi-Stage Build, Compose Orchestrierung | `Dockerfile`, `docker-compose.yml` |
| **Kubernetes** | Helm Charts, HPA, Ingress, Secrets | `helm/iam-showcase/` |
| **CI/CD** | GitHub Actions, Security Scans | `.github/workflows/` |

## Frontend Showcase-Features

1. **Token Inspector** - JWT visuell decodiert, Expiry-Countdown, Copy-Button
2. **Role Switcher** - One-Click User-Wechsel zwischen 4 Demo-Profilen
3. **API Tester** - Interaktiver Endpoint-Tester mit Request/Response-Anzeige
4. **Permission Matrix** - Endpoint x Rolle Grid (gruen/rot)
5. **OIDC Flow Diagram** - 10-Schritt Sequenzdiagramm des Auth-Flows
6. **User Management** - CRUD-Interface mit rollenbasierter UI
7. **Admin Dashboard** - Statistiken + Audit-Log

(c) 2026 Martin Pfeffer | celox.io
