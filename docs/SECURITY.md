# Security-Konzepte

## Authentifizierung

### OAuth2 / OpenID Connect
- **Flow:** Authorization Code mit PKCE (S256)
- **Client-Typ:** Public Client (SPA) - kein Client Secret
- **Token-Typ:** JWT (RS256 signiert)
- **Token-Lebensdauer:** Access 5 Min, Refresh 30 Min, SSO Session 8 Std.
- **Silent Renew:** Automatische Token-Erneuerung im Hintergrund

### SAML 2.0 (Konzept-Demo)
- SAML-Client in Keycloak konfiguriert (`iam-saml-client`)
- SP Metadata XML Endpoint (`/api/v1/saml/metadata`)
- Assertion Consumer Service URL konfiguriert
- Signierte Assertions (RSA-SHA256)

### Multi-Faktor-Authentifizierung (2FA)
- **Methode:** TOTP (Time-based One-Time Password)
- **Konfiguration:** 6 Ziffern, 30 Sekunden Intervall
- **Algorithmus:** HMAC-SHA1
- **Kompatible Apps:** Google Authenticator, FreeOTP, Microsoft Authenticator

## Autorisierung

### Role-Based Access Control (RBAC)

**Realm-Rollen:**
| Rolle | Beschreibung |
|-------|-------------|
| admin | Vollzugriff auf alle Funktionen |
| manager | Verwaltung von Benutzern und Ressourcen |
| user | Standard-Benutzerrolle |
| viewer | Nur-Lese-Zugriff |

**Client-Rollen (iam-backend):**
| Rolle | Beschreibung |
|-------|-------------|
| api-admin | Administrative API-Rechte (DELETE) |
| api-write | Schreibrechte (POST, PUT) |
| api-read | Leserechte (GET) |

### JWT-Verarbeitung
1. Keycloak stellt JWT mit `realm_access.roles` und `resource_access.iam-backend.roles`
2. `KeycloakJwtConverter` extrahiert beide Rollen-Sets
3. Mapping auf Spring Security `GrantedAuthority` mit `ROLE_` Prefix
4. `SecurityConfig` definiert URL-basierte RBAC-Regeln

## Sicherheitsmassnahmen

### API-Sicherheit
- CSRF deaktiviert (Stateless API mit JWT)
- CORS konfiguriert (nur erlaubte Origins)
- Session: STATELESS
- Rate-Limiting via Keycloak Brute-Force-Schutz

### Password Policy
- Mindestens 8 Zeichen
- Mindestens 1 Grossbuchstabe
- Mindestens 1 Ziffer

### Audit-Logging
- Custom Keycloak SPI Event Listener
- Strukturiertes JSON-Logging aller Auth-Events
- Anwendungsseitiges Audit-Log fuer API-Zugriffe

(c) 2026 Martin Pfeffer | celox.io
