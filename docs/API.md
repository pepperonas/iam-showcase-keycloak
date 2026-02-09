# API-Referenz

Basis-URL: `http://localhost:8080/api/v1`

Swagger UI: `http://localhost:8080/swagger-ui.html`

## Oeffentliche Endpoints

### GET /public/health
Health Check - kein Token erforderlich.
```bash
curl http://localhost:8080/api/v1/public/health
```
Response: `{"status":"UP","timestamp":"2026-01-01T00:00:00Z"}`

### GET /public/info
Anwendungsinformationen.
```bash
curl http://localhost:8080/api/v1/public/info
```

## Token Endpoints

### GET /token/inspect
Decodiertes JWT mit Header, Claims, Rollen, Ablaufzeit.
```bash
curl -H "Authorization: Bearer <TOKEN>" http://localhost:8080/api/v1/token/inspect
```

### GET /token/permissions
Effektive Berechtigungen und Permission Matrix.
```bash
curl -H "Authorization: Bearer <TOKEN>" http://localhost:8080/api/v1/token/permissions
```

## User Management

### GET /users
Paginierte Benutzerliste. Rolle: `api-read`
```bash
curl -H "Authorization: Bearer <TOKEN>" "http://localhost:8080/api/v1/users?page=0&size=20"
```

### GET /users/{id}
Benutzer-Details. Rolle: `api-read`

### POST /users
Benutzer erstellen. Rolle: `api-write`
```bash
curl -X POST -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@demo.de","password":"Test1234","firstName":"Test","lastName":"User"}' \
  http://localhost:8080/api/v1/users
```

### PUT /users/{id}
Benutzer aktualisieren. Rolle: `api-write`

### DELETE /users/{id}
Benutzer loeschen. Rolle: `api-admin`

## Rollen

### GET /roles
Alle Realm- und Client-Rollen. Rolle: `api-read`

## Admin

### GET /admin/dashboard
Aggregierte Statistiken. Rolle: `admin`

### GET /admin/audit-log
Paginiertes Audit-Log. Rolle: `admin`

## SAML

### GET /saml/metadata
SAML Service Provider Metadata XML. Kein Token erforderlich.

## Token beziehen
```bash
TOKEN=$(curl -s -X POST "http://localhost:8180/realms/iam-showcase/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&client_id=iam-frontend&username=admin@demo.celox.io&password=Admin123" \
  | jq -r '.access_token')
```

(c) 2026 Martin Pfeffer | celox.io
